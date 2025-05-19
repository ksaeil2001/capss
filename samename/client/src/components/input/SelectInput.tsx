import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder: string;
}

/**
 * Select dropdown component
 */
const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="main-input__label">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="main-input__field"
        value={value || ""}
        onChange={handleChange}
      >
        <option value="" disabled title={placeholder} className="truncate">
          {placeholder}
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value} title={option.label} className="truncate">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
