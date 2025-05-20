import React from "react";
import { RefreshCw, ArrowRight } from "lucide-react";

interface BottomBarProps {
  currentStep: number;
  totalSteps: number;
  onRefresh: () => void;
  onNext: () => void;
  refreshDisabled?: boolean;
  nextDisabled?: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({
  currentStep,
  totalSteps,
  onRefresh,
  onNext,
  refreshDisabled = false,
  nextDisabled = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background backdrop-blur-sm border-t border-border/30 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* 왼쪽 버튼 */}
        <button
          className="px-4 py-2 bg-muted border border-border/30 text-muted-foreground rounded-xl shadow-[0_3px_6px_-3px_rgba(0,0,0,0.07),0_-1px_2px_-1px_rgba(255,255,255,0.6)_inset] hover:brightness-105 hover:scale-[1.02] transition-all duration-150 ease-out flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={onRefresh}
          disabled={refreshDisabled}
        >
          <RefreshCw size={18} className={`${refreshDisabled ? "animate-spin" : ""}`} />
          <span>새로 추천</span>
        </button>

        {/* 중앙 진행 상태 */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${
                index + 1 === currentStep
                  ? "bg-primary shadow-[0_0_5px_rgba(var(--primary-rgb),0.3)]"
                  : index + 1 < currentStep
                    ? "bg-accent-foreground/50"
                    : "bg-muted"
              } transition-all duration-300`}
            />
          ))}
        </div>

        {/* 오른쪽 버튼 */}
        <button
          className="px-4 py-2 bg-primary text-white rounded-xl shadow-[0_3px_6px_-3px_rgba(0,0,0,0.15),0_-1px_2px_-1px_rgba(255,255,255,0.3)_inset] hover:brightness-105 hover:scale-[1.02] transition-all duration-150 ease-out flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={onNext}
          disabled={nextDisabled}
        >
          <span>다음</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
