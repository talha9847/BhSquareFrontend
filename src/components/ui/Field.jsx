import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className = "",
  children,
}) {
  return (
    <div className={`crm-field ${className}`}>
      {label && (
        <label className="crm-label" htmlFor={id}>
          {label}
          {required && <span className="crm-required">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="crm-field-error">{error}</p>
      ) : hint ? (
        <p className="crm-field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    icon: Icon,
    id,
    name,
    required,
    className = "",
    inputClassName = "",
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id || name || autoId;

  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div className={`crm-input-wrap ${Icon ? "has-icon" : ""}`}>
        {Icon && (
          <Icon className="crm-input-icon" size={16} aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          required={required}
          aria-invalid={error ? "true" : undefined}
          className={`crm-input ${error ? "is-invalid" : ""} ${inputClassName}`}
          {...rest}
        />
      </div>
    </FieldShell>
  );
});

export const Select = forwardRef(function Select(
  {
    label,
    hint,
    error,
    icon: Icon,
    id,
    name,
    required,
    className = "",
    selectClassName = "",
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const selectId = id || name || autoId;

  return (
    <FieldShell
      id={selectId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div className={`crm-input-wrap ${Icon ? "has-icon" : ""}`}>
        {Icon && (
          <Icon className="crm-input-icon" size={16} aria-hidden="true" />
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          aria-invalid={error ? "true" : undefined}
          className={`crm-input crm-select ${
            error ? "is-invalid" : ""
          } ${selectClassName}`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          className="crm-select-chevron"
          size={15}
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
});

export const Textarea = forwardRef(function Textarea(
  {
    label,
    hint,
    error,
    id,
    name,
    required,
    className = "",
    textareaClassName = "",
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const textareaId = id || name || autoId;

  return (
    <FieldShell
      id={textareaId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        required={required}
        aria-invalid={error ? "true" : undefined}
        className={`crm-input crm-textarea ${
          error ? "is-invalid" : ""
        } ${textareaClassName}`}
        {...rest}
      />
    </FieldShell>
  );
});

export function Field({ label, hint, error, required, id, className, children }) {
  const autoId = useId();
  return (
    <FieldShell
      id={id || autoId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {children}
    </FieldShell>
  );
}
