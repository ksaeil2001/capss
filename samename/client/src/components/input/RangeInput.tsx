import React from "react";

interface RangeInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

/**
 * Range slider input component
 */
const RangeInput: React.FC<RangeInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="main-input__label flex justify-between">
        <span>{label}</span>
        <span className="font-medium text-primary">{value}%</span>
      </label>
      <div className="mb-2">
        <input
          type="range"
          id={id}
          name={id}
          className="main-input__range range-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
};

export default RangeInput;
