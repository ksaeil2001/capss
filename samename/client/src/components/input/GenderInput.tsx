import React from "react";
import { UserInfo } from "@shared/schema";

interface GenderInputProps {
  value: UserInfo["gender"] | undefined;
  onChange: (value: UserInfo["gender"]) => void;
  id?: string;
}

/**
 * Gender selection component with two buttons (male/female)
 */
const GenderInput: React.FC<GenderInputProps> = ({ value, onChange, id = "gender" }) => {
  return (
    <div className="flex flex-col" data-bind="userInfo.gender">
      <label htmlFor={id} className="main-input__label">
        성별
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          id={`${id}-male`}
          className={`main-input__gender-btn ${value === "male" ? "main-input__gender-btn--active" : ""}`}
          onClick={() => onChange("male")}
          aria-pressed={value === "male"}
        >
          남성
        </button>
        <button
          type="button"
          id={`${id}-female`}
          className={`main-input__gender-btn ${value === "female" ? "main-input__gender-btn--active" : ""}`}
          onClick={() => onChange("female")}
          aria-pressed={value === "female"}
        >
          여성
        </button>
      </div>
    </div>
  );
};

export default GenderInput;
