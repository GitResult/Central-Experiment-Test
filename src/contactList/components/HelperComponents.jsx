/**
 * Helper Components
 *
 * Small reusable components for the contact list:
 * - TaskItem: Display task with status icon
 * - TaskListItem: Display task list item with checkbox
 * - DeliverableItem: Display deliverable with icon and title
 * - Confetti: Animated confetti effect
 */

import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const TaskItem = ({ label, status }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      {status === 'complete' && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={1.5} />}
      {status === 'active' && <Loader2 className="w-5 h-5 text-slate-600 flex-shrink-0 animate-spin" strokeWidth={1.5} />}
      {status === 'queued' && <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />}
      <span className={`text-sm ${status === 'complete' ? 'text-gray-500' : 'text-gray-900'}`}>
        {label}
      </span>
    </div>
  );
};

export const TaskListItem = ({ text, agent }) => {
  return (
    <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
      <CheckCircle2 className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
      <span className="text-sm text-gray-700">
        {text} {agent && <span className="text-gray-500">— {agent}</span>}
      </span>
    </div>
  );
};

export const DeliverableItem = ({ icon, title, subtitle }) => {
  return (
    <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
      </div>
      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={1.5} />
    </div>
  );
};

export const Confetti = () => {
  const particles = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
            animation: `fall ${2 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
