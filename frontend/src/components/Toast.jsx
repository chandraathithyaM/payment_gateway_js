import { useState, useEffect, useCallback } from 'react';

/**
 * Toast notification component.
 * Supports success, error, and info types with auto-dismiss.
 *
 * Usage:
 *   <Toast toasts={toasts} removeToast={removeToast} />
 *   const { toasts, addToast, removeToast } = useToast();
 */

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const TITLES = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
};

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : ''}`}>
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <div className="toast-content">
        <div className="toast-title">{toast.title || TITLES[toast.type]}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button
        className="toast-close"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export function Toast({ toasts, removeToast }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

/**
 * Custom hook to manage toast notifications.
 * @returns {{ toasts, addToast, removeToast }}
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, title, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, title, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

export default Toast;
