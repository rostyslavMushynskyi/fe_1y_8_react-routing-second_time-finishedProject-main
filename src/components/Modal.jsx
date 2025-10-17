import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  onConfirm,
  showActions = true,
  size = "medium",
}) {
  // Закриття по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Блокуємо скрол
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={`${styles.modal} ${styles[size]}`}>
        {/* Header */}
        {title && (
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{title}</h3>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрити модальне вікно"
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>{children}</div>

        {/* Actions */}
        {showActions && (
          <div className={styles.modalActions}>
            <button className={styles.cancelButton} onClick={onClose}>
              {cancelText}
            </button>
            {onConfirm && (
              <button className={styles.confirmButton} onClick={handleConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  showActions: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default Modal;
