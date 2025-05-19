import React from "react";

interface ButtonOption {
  value: number | string;
  label: string;
}

interface ButtonGroupProps {
  id?: string; // ✅ 추가
  options: ButtonOption[];
  value: number | string | undefined;
  onChange: (value: any) => void;
  label: string;
}

/**
 * Button group for selecting from multiple options
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
  id, // ✅ 추가
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <div className="flex flex-col" id={id}>
      {" "}
      {/* ✅ id prop 사용 */}
      <label className="main-input__label">{label}</label>
      <div className="flex gap-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            className={`main-input__meal-btn ${
              value === option.value ? "main-input__meal-btn--active" : ""
            }`}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGroup;
