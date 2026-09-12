import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FormFieldProps {
  id?: string;
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string | null;
  success?: string | null;
  hint?: string | null;
  children: React.ReactNode;
  className?: string;
  rightElement?: React.ReactNode;
  touched?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  htmlFor,
  required = false,
  error,
  success,
  hint,
  children,
  className = "",
  rightElement,
  touched
}) => {
  const effectiveId = id || htmlFor;
  const errorId = effectiveId ? `${effectiveId}-error` : undefined;
  const hintId = effectiveId ? `${effectiveId}-hint` : undefined;

  const showError = touched !== undefined ? (touched && Boolean(error)) : Boolean(error);
  const displayError = showError ? error : null;

  // Clone single child to inject aria attributes and error styling if applicable
  const renderedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        id: effectiveId || (children as any).props.id,
        "aria-invalid": Boolean(displayError),
        "aria-describedby": displayError ? errorId : hint ? hintId : undefined,
        className: `${(children as any).props.className || ""} ${
          displayError
            ? "!border-rose-500 !ring-1 !ring-rose-500/40 focus:!border-rose-600 focus:!ring-rose-500/30"
            : success
            ? "!border-emerald-500 focus:!border-emerald-600"
            : ""
        }`
      })
    : children;

  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide"
          >
            {label}
            {required && <span className="text-rose-500 ml-1 font-black">*</span>}
          </label>
          {rightElement && <div>{rightElement}</div>}
        </div>
      )}

      {renderedChild}

      {/* Direct inline error underneath */}
      <AnimatePresence mode="wait">
        {displayError ? (
          <motion.p
            key="error"
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-start gap-1 leading-snug"
          >
            <span>{displayError}</span>
          </motion.p>
        ) : success ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-start gap-1 leading-snug"
          >
            <span>{success}</span>
          </motion.p>
        ) : hint ? (
          <p id={hintId} className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {hint}
          </p>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
