import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // duration in ms, 0 or undefined for default 4500ms
  action?: ToastAction;
  createdAt: number;
}

export interface ShowToastOptions {
  type?: ToastType;
  title?: string;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, options?: ShowToastOptions) => string;
  showSuccess: (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  showError: (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  showWarning: (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  showInfo: (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, options?: ShowToastOptions): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = {
        id,
        type: options?.type || 'info',
        title: options?.title,
        message,
        duration: options?.duration ?? 4500,
        action: options?.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Keep a maximum of 5 concurrent toasts to avoid layout clutter
        const next = [newToast, ...prev];
        return next.slice(0, 5);
      });

      return id;
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>): string => {
      return showToast(message, {
        ...options,
        type: 'success',
        title: title || 'Success',
      });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>): string => {
      return showToast(message, {
        ...options,
        type: 'error',
        title: title || 'Error',
      });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>): string => {
      return showToast(message, {
        ...options,
        type: 'warning',
        title: title || 'Warning',
      });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string, options?: Omit<ShowToastOptions, 'type' | 'title'>): string => {
      return showToast(message, {
        ...options,
        type: 'info',
        title: title || 'Information',
      });
    },
    [showToast]
  );

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
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
