import { Handle, Position } from '@xyflow/react';

function DelayNode({ data, selected }) {
  return (
    <div className={`
      px-6 py-4 bg-white border-2 rounded-xl shadow-sm transition-all duration-200
      ${selected ? 'border-primary-500 shadow-md ring-2 ring-primary-200' : 'border-purple-400 hover:shadow-md'}
    `}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-neutral-900">{data.label}</span>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
      />
    </div>
  );
}

export default DelayNode;
