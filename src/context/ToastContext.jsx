import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: { bg: '#10B981', border: '#059669' },
  error: { bg: '#EF4444', border: '#DC2626' },
  warning: { bg: '#F59E0B', border: '#D97706' },
  info: { bg: '#4A90D9', border: '#2563EB' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => showToast(msg, 'success', dur),
    error: (msg, dur) => showToast(msg, 'error', dur),
    warning: (msg, dur) => showToast(msg, 'warning', dur),
    info: (msg, dur) => showToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          const color = COLORS[t.type];
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-white pointer-events-auto min-w-[280px] max-w-[400px]"
              style={{ backgroundColor: color.bg, borderLeft: `4px solid ${color.border}` }}
            >
              <Icon size={20} className="flex-shrink-0 mt-0.5" />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}