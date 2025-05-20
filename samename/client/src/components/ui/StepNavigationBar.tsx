import React from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import useUserInfoStore from "@/stores/useUserInfoStore";

interface StepNavigationBarProps {
  currentStep: 1 | 2 | 3 | 4;
  onNext?: () => void;
  nextButtonText?: string;
}

const StepNavigationBar: React.FC<StepNavigationBarProps> = ({
  currentStep,
  onNext,
  nextButtonText = "다음",
}) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isFormValid } = useUserInfoStore();

  const handleNavigate = (path: string) => {
    if (path === "/recommendations" && currentStep === 1) {
      if (!isFormValid) {
        toast({
          title: "사용자 정보가 불완전합니다",
          description: "필수 정보를 모두 입력해주세요",
          variant: "destructive",
        });
        return;
      }
    }
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t border-border p-4 z-10">
      <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          {/* Step 1 */}
          <button
            onClick={() => handleNavigate("/")}
            className="flex items-center transition-colors hover:text-primary focus:outline-none group"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentStep === 1
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/20"
              }`}
            >
              1
            </div>
            <div
              className={`ml-2 text-sm ${
                currentStep === 1 ? "font-medium" : "text-muted-foreground"
              }`}
            >
              입력
            </div>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => handleNavigate("/recommendations")}
            className="flex items-center transition-colors hover:text-primary focus:outline-none group"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentStep === 2
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/20"
              }`}
            >
              2
            </div>
            <div
              className={`ml-2 text-sm ${
                currentStep === 2 ? "font-medium" : "text-muted-foreground"
              }`}
            >
              추천
            </div>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => handleNavigate("/configure")}
            className="flex items-center transition-colors hover:text-primary focus:outline-none group"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentStep === 3
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/20"
              }`}
            >
              3
            </div>
            <div
              className={`ml-2 text-sm ${
                currentStep === 3 ? "font-medium" : "text-muted-foreground"
              }`}
            >
              구성
            </div>
          </button>

          {/* Step 4 */}
          <button
            onClick={() => {
              toast({
                title: "결과 확인 버튼을 눌러 요약 페이지로 이동할 수 있어요.",
                description: "하단의 '결과 확인' 버튼을 사용하세요.",
                variant: "default",
              });
            }}
            className="flex items-center transition-colors hover:text-primary focus:outline-none group cursor-not-allowed"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentStep === 4 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              4
            </div>
            <div
              className={`ml-2 text-sm ${
                currentStep === 4 ? "font-medium" : "text-muted-foreground"
              }`}
            >
              요약
            </div>
          </button>
        </div>

        {onNext && (
          <button
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            onClick={onNext}
          >
            {nextButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigationBar;
