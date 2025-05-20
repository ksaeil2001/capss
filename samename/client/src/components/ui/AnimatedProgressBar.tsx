import React from "react";

interface AnimatedProgressBarProps {
  value: number;
  max: number;
  type: "calories" | "protein" | "carbs" | "fat";
  label?: string;
  showText?: boolean;
  unit?: string; // ✅ 추가된 부분
}

const mascotSVGs = {
  calories: (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#FFD54F" />
    </svg>
  ),
  protein: (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#FF7043" />
    </svg>
  ),
  carbs: (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#FFCA28" />
    </svg>
  ),
  fat: (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" fill="#81C784" />
    </svg>
  ),
};

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  max,
  type,
  label,
  showText = true,
  unit, // ✅ props 받음
}) => {
  const progressPercent = Math.min(100, Math.max(0, (value / max) * 100));
  const progressStyle = {
    "--progress-width": `${progressPercent}%`,
  } as React.CSSProperties;

  return (
    <div className="mb-4">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {value.toLocaleString()} / {max.toLocaleString()}
            {unit
              ? ` ${unit}` // ✅ unit 있으면 사용
              : type === "calories"
                ? " kcal"
                : type === "protein"
                  ? "g"
                  : type === "carbs"
                    ? "g"
                    : type === "fat"
                      ? "g"
                      : ""}
          </span>
        </div>
      )}

      <div className="nutrition-progress">
        <div
          className={`nutrition-progress__fill nutrition-progress__fill--${type}`}
          style={progressStyle}
        />
        {showText && <div className="nutrition-progress__text">{progressPercent.toFixed(0)}%</div>}
        {progressPercent > 10 && (
          <div
            className="nutrition-progress__mascot"
            style={{
              left: `calc(${progressPercent}% - 16px)`,
              transition: "left 1.5s ease-out",
            }}
          >
            {mascotSVGs[type]}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedProgressBar;
