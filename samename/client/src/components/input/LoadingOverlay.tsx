import React from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  submessage?: string;
}

/**
 * Loading overlay with spinner
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "AI 식단을 계산 중입니다...",
  submessage = "맞춤형 식단을 생성하는 데 약 10초가 소요됩니다.",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-sm">
        <div className="spinner w-12 h-12 border-4 border-gray-200 border-solid rounded-full mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600 text-center">{submessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
