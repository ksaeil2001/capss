import React from "react";
import { Meal } from "@shared/schema";
import { X, Coffee, Sun, Moon } from "lucide-react";
import useUserInfoStore from "@/stores/useUserInfoStore";

interface LeftBoxProps {
  selectedMeals: (Meal | null)[];
  onRemove: (index: number) => void;
}

// 식사별 레이블 정의
const mealLabels = ["아침", "점심", "저녁"];

// 식사별 아이콘 정의
const mealIcons = [Coffee, Sun, Moon];

// 식사별 배경색 정의 - 웰니스 테마
const mealColors = [
  "bg-secondary/30 border-secondary/40", // 아침 - 부드러운 베이지
  "bg-accent/40 border-primary/20", // 점심 - 민트 계열
  "bg-tertiary/30 border-tertiary/40", // 저녁 - 블러시 핑크
];

// 식사별 아이콘 색상 정의 - 웰니스 테마
const iconColors = [
  "text-secondary-foreground", // 아침
  "text-primary", // 점심
  "text-tertiary-foreground", // 저녁
];

const LeftBox: React.FC<LeftBoxProps> = ({ selectedMeals, onRemove }) => {
  // 현재 사용자가 선택한 끼니 수 (userInfo 기반)
  const { userInfo } = useUserInfoStore();
  const mealsPerDay = userInfo.mealsPerDay || 3;

  return (
    <div className="wellness-card sticky top-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">선택한 식단</h3>

      <div className="space-y-4">
        {selectedMeals.map((meal, index) => {
          // 선택한 끼니 수를 초과하는 슬롯은 표시하지 않음
          if (index >= mealsPerDay) return null;

          const MealIcon = mealIcons[index];

          return (
            <div
              key={index}
              className={`p-3 rounded-xl border shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] ${mealColors[index]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <MealIcon size={16} className={`${iconColors[index]} mr-2`} />
                  <span className="text-sm font-medium">{mealLabels[index]}</span>
                </div>
              </div>

              {meal ? (
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 mr-3 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={meal.imageUrl || "/placeholder-food.jpg"}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-foreground line-clamp-2">{meal.name}</div>
                    <div className="text-xs text-primary/90 font-medium">
                      {meal.calories || meal.nutrition?.calories || 0}kcal
                    </div>
                  </div>
                  <button
                    className="p-1.5 bg-muted rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={() => onRemove(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-16 text-muted-foreground space-y-1">
                  <span className="text-xs">드래그하여 식단 추가</span>
                  <span className="text-sm">비어 있음</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftBox;
