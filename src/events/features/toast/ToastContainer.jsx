import React from "react";
import { SPACING } from '../../design-system';
import { Toast } from './Toast';

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{
      position: "fixed",
      bottom: SPACING.lg,
      right: SPACING.lg,
      display: "flex",
      flexDirection: "column",
      gap: SPACING.sm,
      zIndex: 9999,
      pointerEvents: "none",
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
}
