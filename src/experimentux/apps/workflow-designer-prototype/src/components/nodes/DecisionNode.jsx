import { Handle, Position } from '@xyflow/react';

function DecisionNode({ data, selected }) {
  return (
    <div className="relative" style={{ width: '160px', height: '160px' }}>
      {/* Diamond shape container */}
      <div
        className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-28 h-28 rotate-45 bg-white border-2 shadow-sm transition-all duration-200
          ${selected ? 'border-primary-500 shadow-md ring-2 ring-primary-200' : 'border-amber-400 hover:shadow-md'}
        `}
      >
        {/* Content inside diamond (counter-rotated) */}
        <div className="absolute inset-0 -rotate-45 flex flex-col items-center justify-center p-3">
          <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center mb-1.5">
            <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs font-medium text-neutral-900 text-center leading-tight">
            {data.label}
          </span>
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-neutral-500">
            <span className="flex items-center gap-0.5">
              <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Yes
            </span>
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-0.5">
              <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              No
            </span>
          </div>
        </div>
      </div>

      {/* Handles positioned at diamond points */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-white"
        style={{ left: '0', top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="yes"
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
        style={{ left: '50%', top: '10px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="w-3 h-3 !bg-red-500 !border-2 !border-white"
        style={{ left: '50%', bottom: '10px' }}
      />
    </div>
  );
}

export default DecisionNode;
