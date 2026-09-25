import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

/**
 * Confirmation dialog.
 * Props: isOpen, onClose, onConfirm, title, message, confirmLabel, cancelLabel, variant
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger', // danger | warning | primary
  loading = false,
}) {
  const confirmColors = {
    danger: { bg: '#EF4444', hover: '#DC2626' },
    warning: { bg: '#F59E0B', hover: '#D97706' },
    primary: { bg: '#E9A23B', hover: '#C8862A', text: '#14213D' },
  };
  const c = confirmColors[variant] || confirmColors.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor:
              variant === 'danger'
                ? 'rgba(239, 68, 68, 0.15)'
                : variant === 'warning'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(233, 162, 59, 0.15)',
          }}
        >
          <AlertTriangle
            size={24}
            style={{
              color:
                variant === 'danger'
                  ? '#EF4444'
                  : variant === 'warning'
                  ? '#F59E0B'
                  : '#E9A23B',
            }}
          />
        </div>
        <p className="text-sm text-gray-600 pt-2">{message}</p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: c.bg, color: c.text || '#FFFFFF' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = c.hover)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = c.bg)}
        >
          {loading ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;