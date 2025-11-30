/**
 * Panel Component
 * Universal panel component with docking, floating, and minimize support
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import PanelHeader from './PanelHeader';
import PanelResizer from './PanelResizer';
import usePanel from './hooks/usePanel';
import usePanelDocking from './hooks/usePanelDocking';
import usePanelResize from './hooks/usePanelResize';
import usePanelZIndex from './hooks/usePanelZIndex';

export function Panel({
  id,
  title,
  icon,
  children,
  defaultMode = 'docked',
  defaultPosition = 'right',
  defaultSize = { width: 400, height: 500 },
  resizable = true,
  minimizable = true,
  closable = true,
  actions,
  className,
  style
}) {
  const { panel, isVisible, isDocked, isFloating, close } = usePanel(id, {
    title,
    mode: defaultMode,
    position: defaultPosition,
    defaultSize,
    resizable,
    minimizable,
    closable,
    visible: true
  });

  const { toggleDockFloat, minimize } = usePanelDocking(id);
  const { handleResizeStart, isResizing } = usePanelResize(id);
  const { zIndex, bringToFront } = usePanelZIndex(id);

  // Dragging state for floating panels
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef(null);

  if (!panel || !isVisible) return null;

  const handleDragStart = (e) => {
    if (isFloating) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - panel.floatingPosition.x,
        y: e.clientY - panel.floatingPosition.y
      };
      bringToFront();
    }
  };

  const handleDragMove = (e) => {
    if (isDragging && panel) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      // Keep panel within viewport bounds
      const maxX = window.innerWidth - panel.size.width;
      const maxY = window.innerHeight - panel.size.height;

      const constrainedX = Math.max(0, Math.min(maxX, newX));
      const constrainedY = Math.max(0, Math.min(maxY, newY));

      if (panelRef.current) {
        panelRef.current.style.left = `${constrainedX}px`;
        panelRef.current.style.top = `${constrainedY}px`;
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add/remove drag listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

  const getPanelStyle = () => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.base,
      overflow: 'hidden',
      ...style
    };

    if (isFloating) {
      return {
        ...baseStyle,
        position: 'fixed',
        left: `${panel.floatingPosition.x}px`,
        top: `${panel.floatingPosition.y}px`,
        width: `${panel.size.width}px`,
        height: `${panel.size.height}px`,
        zIndex: theme.zIndex.modal + zIndex,
        boxShadow: theme.shadows.xl
      };
    }

    if (isDocked) {
      const dockedStyle = {
        ...baseStyle,
        height: '100%',
        boxShadow: 'none',
        borderRadius: 0
      };

      if (panel.position === 'left' || panel.position === 'right') {
        dockedStyle.width = `${panel.size.width}px`;
      } else if (panel.position === 'bottom') {
        dockedStyle.height = `${panel.size.height}px`;
      }

      return dockedStyle;
    }

    return baseStyle;
  };

  return (
    <div
      ref={panelRef}
      className={className}
      style={getPanelStyle()}
      onMouseDown={bringToFront}
    >
      {/* Header */}
      <PanelHeader
        title={title}
        icon={icon}
        mode={panel.mode}
        minimizable={minimizable}
        closable={closable}
        onMinimize={minimize}
        onDockFloat={toggleDockFloat}
        onClose={close}
        actions={actions}
        isDraggable={isFloating}
        onDragStart={handleDragStart}
      />

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {children}
      </div>

      {/* Resize handles for floating panels */}
      {isFloating && resizable && (
        <>
          <PanelResizer handle="n" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="s" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="e" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="w" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="ne" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="nw" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="se" onResizeStart={handleResizeStart} isResizing={isResizing} />
          <PanelResizer handle="sw" onResizeStart={handleResizeStart} isResizing={isResizing} />
        </>
      )}
    </div>
  );
}

Panel.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  defaultMode: PropTypes.oneOf(['docked', 'floating', 'minimized']),
  defaultPosition: PropTypes.oneOf(['left', 'right', 'bottom', 'center']),
  defaultSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  resizable: PropTypes.bool,
  minimizable: PropTypes.bool,
  closable: PropTypes.bool,
  actions: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Panel;
