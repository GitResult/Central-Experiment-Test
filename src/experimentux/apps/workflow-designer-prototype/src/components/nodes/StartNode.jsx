import { Handle, Position } from '@xyflow/react';

function StartNode({ data, selected }) {
  return (
    <div className={`
      px-8 py-4 bg-white border-2 shadow-sm transition-all duration-200
      ${selected ? 'border-primary-500 shadow-md ring-2 ring-primary-200' : 'border-green-400 hover:shadow-md'}
    `}
    style={{ borderRadius: '50px' }} // Oval/pill shape
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-neutral-900">{data.label}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />
    </div>
  );
}

export default StartNode;
