import { useEffect } from 'react';

/**
 * Hook to handle keyboard shortcuts on modals:
 * - 'Escape' key immediately triggers onClose()
 * - 'Enter' key triggers onConfirm() (or form submission), while respecting multi-line textareas (unless Ctrl/Cmd+Enter)
 *
 * @param {boolean} isOpen - Whether the modal is currently open
 * @param {function} onClose - Function to call on Escape
 * @param {function} [onConfirm] - Optional function to call on Enter
 */
export function useModalKeyboard(isOpen, onClose, onConfirm) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onClose === 'function') {
          onClose();
        }
        return;
      }

      if (e.key === 'Enter') {
        const target = e.target;
        const isTextarea = target && target.tagName === 'TEXTAREA';

        // In a textarea, regular Enter creates a new line.
        // Ctrl+Enter or Cmd+Enter will confirm.
        if (isTextarea && !(e.ctrlKey || e.metaKey)) {
          return;
        }

        // If the focused element is a button, let the default click action happen
        if (target && target.tagName === 'BUTTON') {
          return;
        }

        if (typeof onConfirm === 'function') {
          e.preventDefault();
          onConfirm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onConfirm]);
}

export default useModalKeyboard;
