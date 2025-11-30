import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';

function AddableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleAddClick = (e) => {
    e.stopPropagation();
    // Enter insert mode instead of showing dropdown
    if (data?.onEnterInsertMode) {
      data.onEnterInsertMode(id);
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* Plus button - triggers insert mode */}
          <button
            onClick={handleAddClick}
            className={`
              w-6 h-6 rounded-full bg-white border-2 border-neutral-300
              flex items-center justify-center
              transition-all duration-200
              hover:border-primary-500 hover:bg-primary-50 hover:scale-110
              ${isHovered ? 'opacity-100' : 'opacity-30'}
            `}
            title="Add node (opens component panel)"
          >
            <svg className="w-3 h-3 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default AddableEdge;
