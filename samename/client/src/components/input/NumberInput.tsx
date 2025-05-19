import React, { useState, useEffect } from "react";

interface NumberInputProps {
  id: string;
  label: string;
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  min: number;
  max: number;
  placeholder: string;
  errorMessage: string;
  step?: number;
}

/**
 * Number input field with validation
 */
const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  errorMessage,
  step = 1,
}) => {
  const [error, setError] = useState<boolean>(false);

  // Validate the value when it changes
  useEffect(() => {
    if (value === null || value === undefined) {
      setError(false);
      return;
    }

    setError(value < min || value > max);
  }, [value, min, max]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? undefined : Number(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="main-input__label">
        {label}
      </label>
      <input
        type="number"
        id={id}
        name={id}
        className={`main-input__field ${error ? "border-destructive" : ""}`}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        value={value === null || value === undefined ? "" : value}
        onChange={handleChange}
        aria-invalid={error}
      />
      {error && <div className="main-input__error-msg">{errorMessage}</div>}
    </div>
  );
};

export default NumberInput;
