import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((message, options) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = {
      id,
      type: options?.type || 'info',
      title: options?.title,
      message,
      duration: options?.duration ?? 4500,
      action: options?.action,
      createdAt: Date.now(),
    };

    setToasts((prev) => {
      const next = [newToast, ...prev];
      return next.slice(0, 5);
    });

    return id;
  }, []);

  const showSuccess = useCallback((message, title, options) => {
    return showToast(message, {
      ...options,
      type: 'success',
      title: title || 'Success',
    });
  }, [showToast]);

  const showError = useCallback((message, title, options) => {
    return showToast(message, {
      ...options,
      type: 'error',
      title: title || 'Error',
    });
  }, [showToast]);

  const showWarning = useCallback((message, title, options) => {
    return showToast(message, {
      ...options,
      type: 'warning',
      title: title || 'Warning',
    });
  }, [showToast]);

  const showInfo = useCallback((message, title, options) => {
    return showToast(message, {
      ...options,
      type: 'info',
      title: title || 'Information',
    });
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
        clearToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
