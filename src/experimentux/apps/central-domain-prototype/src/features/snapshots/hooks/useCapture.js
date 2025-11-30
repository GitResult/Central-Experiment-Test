/**
 * useCapture Hook
 * Manages snapshot capture workflow
 */

import { useCallback } from 'react';
import { useSnapshotStore } from '../../../store/snapshotStore';
import { captureRegion, compressImage } from '../services/captureEngine';
import { uploadSnapshot } from '../services/snapshotAPI';

export function useCapture() {
  const {
    isCapturing,
    isUploading,
    captureError,
    lastSnapshot,
    startCapture,
    cancelCapture,
    setUploading,
    setCaptureError,
    setLastSnapshot,
    addSnapshot,
    openDiscussionPanel,
  } = useSnapshotStore();

  /**
   * Merge pre-capture annotations with screenshot
   */
  const mergeAnnotations = useCallback(async (screenshotDataUrl, annotationsDataUrl) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const screenshot = new Image();
      const annotations = new Image();

      let loadedCount = 0;

      const onLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          // Set canvas size to screenshot dimensions
          canvas.width = screenshot.width;
          canvas.height = screenshot.height;

          // Draw screenshot first
          ctx.drawImage(screenshot, 0, 0);

          // Draw annotations on top
          ctx.drawImage(annotations, 0, 0);

          // Convert to blob
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png', 0.95);
        }
      };

      screenshot.onload = onLoad;
      annotations.onload = onLoad;

      screenshot.src = screenshotDataUrl;
      annotations.src = annotationsDataUrl;
    });
  }, []);

  /**
   * Complete capture (region selected, now render and upload)
   */
  const completeCapture = useCallback(async (region, sourceContext = {}, annotations = null) => {
    setUploading(true);
    setCaptureError(null);

    const startTime = Date.now();

    try {
      console.log('📸 Capturing region:', region);

      // Step 1: Capture region as PNG
      const { blob, dataUrl, dimensions } = await captureRegion(region, {
        scale: window.devicePixelRatio,
        backgroundColor: '#ffffff',
      });

      console.log('✅ Capture completed:', {
        duration: Date.now() - startTime,
        fileSize: blob.size,
        dimensions,
      });

      // Step 2: Merge with pre-capture annotations if provided
      let finalBlob = blob;
      if (annotations?.annotationsDataUrl) {
        console.log('🎨 Merging pre-capture annotations...');
        finalBlob = await mergeAnnotations(dataUrl, annotations.annotationsDataUrl);
        console.log('✅ Annotations merged');
      }

      // Step 3: Compress image (optional, graceful degradation)
      try {
        const compressedBlob = await compressImage(finalBlob);
        const reductionPct = Math.round((1 - compressedBlob.size / finalBlob.size) * 100);

        // Only use compressed version if significantly smaller (>20% reduction)
        if (reductionPct > 20) {
          finalBlob = compressedBlob;
          console.log('🗜️ Image compressed:', {
            originalSize: blob.size,
            compressedSize: compressedBlob.size,
            reduction: `${reductionPct}%`,
          });
        }
      } catch (compressionError) {
        console.warn('Image compression failed, using original:', compressionError);
      }

      // Step 4: Upload to storage
      const snapshot = await uploadSnapshot({
        imageBlob: finalBlob,
        sourceContext: {
          url: window.location.pathname,
          module: sourceContext.module || 'general',
          filters: sourceContext.filters || {},
          scrollPosition: {
            x: window.scrollX,
            y: window.scrollY,
          },
        },
        metadata: {
          dimensions,
          fileSize: finalBlob.size,
          hasPreCaptureAnnotations: !!annotations,
        },
      });

      console.log('✅ Snapshot uploaded:', snapshot.id);

      setLastSnapshot(snapshot);
      addSnapshot(snapshot);
      setUploading(false);

      // Auto-open discussion panel with a small delay for smoother transition
      setTimeout(() => {
        openDiscussionPanel(snapshot);
      }, 300);

      return snapshot;
    } catch (err) {
      console.error('Capture failed:', err);
      setCaptureError(err.message || 'Capture failed');
      setUploading(false);

      throw err;
    }
  }, [setUploading, setCaptureError, setLastSnapshot, addSnapshot, openDiscussionPanel, mergeAnnotations]);

  return {
    isCapturing,
    isUploading,
    captureError,
    lastSnapshot,
    startCapture,
    cancelCapture,
    completeCapture,
  };
}
