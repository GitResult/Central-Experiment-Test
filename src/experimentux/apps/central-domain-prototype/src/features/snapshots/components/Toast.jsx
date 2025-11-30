/**
 * Toast Notification
 * Simple toast component for snapshot notifications
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success' ? '#10b981' : '#ef4444';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: bgColor,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10000,
        maxWidth: '400px',
        animation: 'slideInUp 0.3s ease-out',
      }}
    >
      <Icon size={20} />
      <span style={{ flex: 1, fontSize: '14px' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Close"
      >
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error']),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};
