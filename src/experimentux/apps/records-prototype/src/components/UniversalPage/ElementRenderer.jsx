import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ElementRegistry } from '../elements/registry';

/**
 * Error Boundary for Element Rendering
 *
 * Catches and handles errors that occur during element rendering,
 * preventing the entire page from crashing.
 */
class ElementErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Element rendering error:', error, errorInfo);

    // Log to monitoring service if available
    if (window.errorMonitoring) {
      window.errorMonitoring.captureException(error, {
        context: 'ElementRenderer',
        elementId: this.props.elementId,
        elementType: this.props.elementType,
        errorInfo
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
          <div className="font-semibold mb-2">Failed to render element</div>
          <div className="text-sm text-red-600">
            {this.state.error?.message || 'Unknown error'}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ElementErrorBoundary.propTypes = {
  children: PropTypes.node,
  elementId: PropTypes.string,
  elementType: PropTypes.string
};

/**
 * Skeleton Loader for Lazy-Loaded Elements
 *
 * Displayed while element component is being loaded.
 */
const ElementSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
);

/**
 * ElementRenderer Component
 *
 * Renders individual elements using the ElementRegistry.
 * Handles lazy loading, error boundaries, and memoization.
 *
 * @param {Object} element - Element configuration
 * @param {Function} onUpdate - Callback for element updates
 */
const ElementRenderer = React.memo(({ element, onUpdate }) => {
  const startTime = performance.now();

  // Get element definition from registry
  const elementDef = ElementRegistry[element.type];

  if (!elementDef) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded text-yellow-700">
        <div className="font-semibold mb-2">Unknown element type</div>
        <div className="text-sm">
          Element type "{element.type}" is not registered in the ElementRegistry.
        </div>
      </div>
    );
  }

  const ElementComponent = elementDef.component;

  // Log slow renders
  React.useEffect(() => {
    const renderTime = performance.now() - startTime;
    if (renderTime > 1000) {
      console.warn(`Slow element render: ${renderTime}ms`, {
        elementId: element.id,
        elementType: element.type
      });
    }
  }, [element.id, element.type, startTime]);

  return (
    <div data-element-id={element.id} data-element-type={element.type}>
      <ElementErrorBoundary
        elementId={element.id}
        elementType={element.type}
      >
        <Suspense fallback={<ElementSkeleton />}>
          <ElementComponent
            data={element.data || {}}
            settings={element.settings || {}}
            onUpdate={(updates) => onUpdate && onUpdate(element.id, updates)}
          />
        </Suspense>
      </ElementErrorBoundary>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if element data or settings have changed

  // Quick check: if same object reference, no re-render needed
  if (prevProps.element === nextProps.element) {
    return true;
  }

  // Check if IDs match
  if (prevProps.element.id !== nextProps.element.id) {
    return false;
  }

  // Check if type changed
  if (prevProps.element.type !== nextProps.element.type) {
    return false;
  }

  // Deep comparison of data and settings
  // Note: This is a simple JSON stringify comparison
  // For better performance with large objects, consider using a deep equality library
  const prevData = JSON.stringify(prevProps.element.data);
  const nextData = JSON.stringify(nextProps.element.data);
  const prevSettings = JSON.stringify(prevProps.element.settings);
  const nextSettings = JSON.stringify(nextProps.element.settings);

  // Return true if equal (no re-render), false if different (re-render)
  return prevData === nextData && prevSettings === nextSettings;
});

ElementRenderer.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    settings: PropTypes.object,
    data: PropTypes.any
  }).isRequired,
  onUpdate: PropTypes.func
};

ElementRenderer.displayName = 'ElementRenderer';

export default ElementRenderer;
