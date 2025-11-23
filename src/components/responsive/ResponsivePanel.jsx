/**
 * ResponsivePanel Component
 *
 * A unified panel component that adapts to different screen sizes and contexts:
 * - Desktop: Centered modal dialog
 * - Tablet: Slide-in side drawer
 * - Mobile: Bottom sheet with swipe gestures
 * - Slide-out Panel: Embedded drawer (no backdrop)
 *
 * Features:
 * - Maintains desktop functionality exactly as is
 * - Responsive behavior based on container width
 * - Touch gestures (swipe to dismiss)
 * - Keyboard accessibility (ESC to close)
 * - Smooth animations
 * - Backdrop click to close
 *
 * @component
 */

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const ResponsivePanel = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  variant = 'auto', // 'auto', 'modal', 'drawer', 'sheet', 'embedded'
  showHeader = true,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  position = 'center', // 'center', 'right', 'bottom'
  className = '',
  headerActions = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const panelRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Track viewport width for responsive behavior
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine actual variant based on viewport width if 'auto'
  const getEffectiveVariant = () => {
    if (variant !== 'auto') return variant;

    if (viewportWidth < 640) return 'sheet'; // Mobile: bottom sheet
    if (viewportWidth < 1024) return 'drawer'; // Tablet: side drawer
    return 'modal'; // Desktop: centered modal
  };

  const effectiveVariant = getEffectiveVariant();

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen && effectiveVariant !== 'embedded') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, effectiveVariant]);

  // Touch/drag handlers for bottom sheet
  const handleTouchStart = (e) => {
    if (effectiveVariant !== 'sheet') return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || effectiveVariant !== 'sheet') return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    // Only allow dragging down
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    // Close if dragged more than 100px
    if (dragY > 100) {
      onClose();
    }

    setIsDragging(false);
    setDragY(0);
    setStartY(0);
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  // Variant-specific classes and styles
  const getVariantClasses = () => {
    switch (effectiveVariant) {
      case 'sheet':
        return {
          container: 'items-end sm:items-center',
          panel: `w-full sm:${sizeClasses[size]} rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col`,
          animation: 'animate-slideUp',
        };
      case 'drawer':
        return {
          container: 'items-stretch justify-end',
          panel: 'w-full max-w-md h-full flex flex-col',
          animation: 'animate-slideInRight',
        };
      case 'modal':
        return {
          container: 'items-center justify-center p-4',
          panel: `w-full ${sizeClasses[size]} rounded-2xl max-h-[90vh] flex flex-col`,
          animation: 'animate-slideIn',
        };
      case 'embedded':
        return {
          container: 'relative',
          panel: 'w-full h-full flex flex-col',
          animation: '',
        };
      default:
        return {
          container: 'items-center justify-center p-4',
          panel: `w-full ${sizeClasses[size]} rounded-2xl max-h-[90vh] flex flex-col`,
          animation: 'animate-slideIn',
        };
    }
  };

  const variantClasses = getVariantClasses();

  if (!isOpen) return null;

  const panelContent = (
    <div
      ref={panelRef}
      className={`bg-white shadow-2xl overflow-hidden ${variantClasses.panel} ${variantClasses.animation} ${className}`}
      style={{
        transform: effectiveVariant === 'sheet' && dragY > 0 ? `translateY(${dragY}px)` : undefined,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull handle for bottom sheet */}
      {effectiveVariant === 'sheet' && (
        <div className="flex justify-center pt-3 pb-2 sm:hidden">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-2">
              {headerActions}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );

  // Embedded variant doesn't need backdrop
  if (effectiveVariant === 'embedded') {
    return panelContent;
  }

  // Render with backdrop
  return (
    <div
      className={`fixed inset-0 z-50 flex ${variantClasses.container}`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>

      {/* Panel */}
      <div
        className="relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {panelContent}
      </div>
    </div>
  );
};

export default ResponsivePanel;
