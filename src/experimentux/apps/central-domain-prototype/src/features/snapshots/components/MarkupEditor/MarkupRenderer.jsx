/**
 * MarkupRenderer
 * Renders saved markup on top of an image (read-only view)
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';

export function MarkupRenderer({ imageUrl, markup = [] }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    // Create canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      selection: false, // Disable selection in view mode
      backgroundColor: 'transparent',
    });

    fabricRef.current = canvas;

    // Load background image
    fabric.Image.fromURL(imageUrl, (img) => {
      // Set canvas size to match image
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);

      // Set image as background
      img.selectable = false;
      img.evented = false;
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

      // Load markup if provided
      if (markup && markup.length > 0) {
        canvas.loadFromJSON({ objects: markup }, () => {
          // Make all objects non-selectable in view mode
          canvas.getObjects().forEach((obj) => {
            obj.selectable = false;
            obj.evented = false;
          });
          canvas.renderAll();
        });
      }
    }, { crossOrigin: 'anonymous' });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [imageUrl, markup]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
      }}
    />
  );
}

MarkupRenderer.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  markup: PropTypes.arrayOf(PropTypes.object),
};
