import React, { useState, useEffect } from "react";

interface ErrorModalProps {
  isVisible: boolean;
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

/**
 * Error modal component with animation and delay
 */
const ErrorModal: React.FC<ErrorModalProps> = ({ isVisible, message, onRetry, onClose }) => {
  // 실제 표시 상태를 관리하는 state
  const [showModal, setShowModal] = useState(false);
  // 모달 자체의 표시 여부를 관리하는 state
  const [renderModal, setRenderModal] = useState(false);

  // isVisible prop이 변경될 때마다 지연 효과 적용
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let renderTimer: ReturnType<typeof setTimeout>;

    if (isVisible) {
      // 에러가 감지되었을 때 최소 1초 후에 모달 렌더링 시작
      renderTimer = setTimeout(() => {
        setRenderModal(true);
        // 렌더링 후 애니메이션을 위해 살짝 지연
        showTimer = setTimeout(() => {
          setShowModal(true);
        }, 50);
      }, 1000); // 에러 모달이 표시되기 전 1초 지연
    } else {
      // 모달 숨기기
      setShowModal(false);
      // 애니메이션 완료 후 모달 제거
      renderTimer = setTimeout(() => {
        setRenderModal(false);
      }, 300); // 페이드 아웃 애니메이션 시간
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(renderTimer);
    };
  }, [isVisible]);

  if (!renderModal) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] transition-all duration-300 ${showModal ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 pointer-events-none"}`}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col items-center max-w-sm transform transition-all duration-300 ${showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"} relative overflow-hidden`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-1 bg-red-500/5"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-500"></div>
        </div>

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 mx-auto shadow-sm">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            오류가 발생했습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{message}</p>

          <div className="flex gap-3 justify-center">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              onClick={onClose}
            >
              닫기
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-lg shadow-sm hover:from-red-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              onClick={onRetry}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
