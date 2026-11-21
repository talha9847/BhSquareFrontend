import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SIZES = {
  xs: "crm-modal--xs",
  sm: "crm-modal--sm",
  md: "crm-modal--md",
  lg: "crm-modal--lg",
  xl: "crm-modal--xl",
  "2xl": "crm-modal--2xl",
  full: "crm-modal--full",
};

const TONES = {
  primary: "crm-modal-icon--primary",
  success: "crm-modal-icon--success",
  warning: "crm-modal-icon--warning",
  danger: "crm-modal-icon--danger",
  neutral: "crm-modal-icon--neutral",
};

let scrollLocks = 0;
let originalBodyOverflow = "";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The single dialog primitive for every CRM workspace.
 *
 * <Modal
 *   open={open}
 *   onClose={close}
 *   title="New Vehicle"
 *   subtitle="Fleet assets"
 *   eyebrow="Dispatch"
 *   icon={Truck}
 *   size="sm"
 *   footer={<Button>Save</Button>}
 * >
 *   ...
 * </Modal>
 *
 * Use `as="form"` with `onSubmit` when the dialog itself is a form so the
 * footer submit button stays inside the form.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  eyebrow,
  icon: Icon,
  tone = "primary",
  size = "md",
  footer,
  children,
  className = "",
  bodyClassName = "",
  as: Tag = "section",
  closeOnOverlay = true,
  closeOnEsc = true,
  preventClose = false,
  hideClose = false,
  initialFocusRef,
  ...rest
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;

    if (scrollLocks === 0) {
      originalBodyOverflow = document.body.style.overflow;
    }
    scrollLocks += 1;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      panel ? Array.from(panel.querySelectorAll(FOCUSABLE)) : [];

    const focusTimer = window.requestAnimationFrame(() => {
      if (!panel) return;
      const target = initialFocusRef?.current || getFocusable()[0] || panel;
      target?.focus?.({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && closeOnEsc && !preventClose) {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", handleKeyDown, true);
      scrollLocks = Math.max(0, scrollLocks - 1);
      if (scrollLocks === 0) {
        document.body.style.overflow = originalBodyOverflow;
      }
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, closeOnEsc, preventClose, onClose, initialFocusRef]);

  if (!open) return null;

  const requestClose = () => {
    if (!preventClose) onClose?.();
  };

  return createPortal(
    <div className="crm-modal-root">
      <div
        className="crm-modal-overlay"
        aria-hidden="true"
        onClick={closeOnOverlay ? requestClose : undefined}
      />
      <div className="crm-modal-stage">
        <Tag
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={subtitle ? subtitleId : undefined}
          tabIndex={-1}
          className={`crm-modal ${SIZES[size] || SIZES.md} ${className}`}
          {...rest}
        >
          <span className="crm-modal-accent" aria-hidden="true" />

          {(title || Icon || !hideClose) && (
            <header className="crm-modal-header">
              {Icon && (
                <span
                  className={`crm-modal-icon ${TONES[tone] || TONES.primary}`}
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
              )}

              <div className="crm-modal-heading">
                {eyebrow && <p className="crm-modal-eyebrow">{eyebrow}</p>}
                {title && (
                  <h2 id={titleId} className="crm-modal-title">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p id={subtitleId} className="crm-modal-subtitle">
                    {subtitle}
                  </p>
                )}
              </div>

              {!hideClose && (
                <button
                  type="button"
                  onClick={requestClose}
                  disabled={preventClose}
                  className="crm-modal-close"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              )}
            </header>
          )}

          <div className={`crm-modal-body ${bodyClassName}`}>{children}</div>

          {footer && <footer className="crm-modal-footer">{footer}</footer>}
        </Tag>
      </div>
    </div>,
    document.body,
  );
}

export function ModalSection({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section className={`crm-modal-section ${className}`}>
      {title && (
        <div className="crm-modal-section-head">
          {Icon && (
            <span className="crm-modal-section-icon" aria-hidden="true">
              <Icon size={14} />
            </span>
          )}
          <div>
            <h3 className="crm-modal-section-title">{title}</h3>
            {description && (
              <p className="crm-modal-section-description">{description}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  eyebrow = "Please confirm",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  icon,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={description}
      eyebrow={eyebrow}
      icon={icon}
      tone={tone}
      size="xs"
      preventClose={loading}
      footer={
        <>
          <button
            type="button"
            className="crm-btn crm-btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`crm-btn ${
              tone === "danger"
                ? "crm-btn--danger"
                : tone === "warning"
                  ? "crm-btn--warning"
                  : "crm-btn--primary"
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Working..." : confirmLabel}
          </button>
        </>
      }
    />
  );
}
