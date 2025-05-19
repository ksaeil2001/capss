import React from "react";

interface InputCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card container for form input elements
 */
const InputCard: React.FC<InputCardProps> = ({ children, className = "" }) => {
  return <div className={`main-input__card ${className}`}>{children}</div>;
};

export default InputCard;
