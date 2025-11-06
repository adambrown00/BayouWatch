import React from "react";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} ${loading ? "btn-loading" : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner" aria-hidden="true"></span>
      ) : null}
      <span className={loading ? "btn-text-loading" : ""}>{children}</span>
    </button>
  );
};

export default Button;
