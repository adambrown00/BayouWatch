import React from "react";
import "./inputField.css";

type InputType = "text" | "email" | "password";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: InputType;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, type = "text", error, ...props }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={type}
        className={`input-field ${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default Input;
