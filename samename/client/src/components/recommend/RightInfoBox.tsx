import React, { useMemo } from "react";
import { Meal, DietRecommendation } from "@shared/schema";
import { Flame, Beef, Cookie, Droplet, CreditCard } from "lucide-react";

interface RightInfoBoxProps {
  summary?: DietRecommendation["summary"];
  selectedMeals: (Meal | null)[];
}

const RightInfoBox: React.FC<RightInfoBoxProps> = ({ summary, selectedMeals }) => {
  // 선택한 식단의 총 영양소 계산
  const selectedNutrition = useMemo(() => {
    const initialValue = { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 };

    return selectedMeals.reduce((acc, meal) => {
      if (!meal) return acc;

      return {
        calories: acc.calories + (meal.calories || meal.nutrition?.calories || 0),
        protein: acc.protein + (meal.protein || meal.nutrition?.protein || 0),
        carbs: acc.carbs + (meal.carbs || meal.nutrition?.carbs || 0),
        fat: acc.fat + (meal.fat || meal.nutrition?.fat || 0),
        cost: acc.cost + (meal.price || 0),
      };
    }, initialValue);
  }, [selectedMeals]);

  // 예산 및 목표 영양소 계산
  const remaining = useMemo(() => {
    if (!summary) return null;

    return {
      calories: summary.totalCalories - selectedNutrition.calories,
      protein: summary.totalProtein - selectedNutrition.protein,
      carbs: summary.totalCarbs - selectedNutrition.carbs,
      fat: summary.totalFat - selectedNutrition.fat,
      budget: summary.totalBudget - selectedNutrition.cost,
    };
  }, [summary, selectedNutrition]);

  return (
    <div className="wellness-card sticky top-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">영양 정보</h3>

      <div className="space-y-4">
        {/* 총 칼로리 */}
        <div className="p-3 rounded-xl shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 bg-white/60 rounded-full shadow-inner">
                <Flame className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">총 칼로리</span>
            </div>
            <div className="font-semibold text-foreground">
              {selectedNutrition.calories}
              <span className="text-xs text-muted-foreground ml-1">kcal</span>
            </div>
          </div>
          {remaining && (
            <div className="mt-1 text-xs text-right">
              <span
                className={
                  remaining.calories >= 0
                    ? "text-accent-foreground font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {remaining.calories >= 0
                  ? `남은 칼로리: ${remaining.calories}kcal`
                  : `초과: ${Math.abs(remaining.calories)}kcal`}
              </span>
            </div>
          )}
        </div>

        {/* 단백질 */}
        <div className="p-3 rounded-xl shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-tertiary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 bg-white/60 rounded-full shadow-inner">
                <Beef className="w-4 h-4 text-tertiary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">단백질</span>
            </div>
            <div className="font-semibold text-foreground">
              {selectedNutrition.protein}
              <span className="text-xs text-muted-foreground ml-1">g</span>
            </div>
          </div>
          {remaining && (
            <div className="mt-1 text-xs text-right">
              <span
                className={
                  remaining.protein >= 0
                    ? "text-accent-foreground font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {remaining.protein >= 0
                  ? `남음: ${remaining.protein}g`
                  : `초과: ${Math.abs(remaining.protein)}g`}
              </span>
            </div>
          )}
        </div>

        {/* 탄수화물 */}
        <div className="p-3 rounded-xl shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 bg-white/60 rounded-full shadow-inner">
                <Cookie className="w-4 h-4 text-secondary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">탄수화물</span>
            </div>
            <div className="font-semibold text-foreground">
              {selectedNutrition.carbs}
              <span className="text-xs text-muted-foreground ml-1">g</span>
            </div>
          </div>
          {remaining && (
            <div className="mt-1 text-xs text-right">
              <span
                className={
                  remaining.carbs >= 0
                    ? "text-accent-foreground font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {remaining.carbs >= 0
                  ? `남음: ${remaining.carbs}g`
                  : `초과: ${Math.abs(remaining.carbs)}g`}
              </span>
            </div>
          )}
        </div>

        {/* 지방 */}
        <div className="p-3 rounded-xl shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 p-1.5 bg-white/60 rounded-full shadow-inner">
                <Droplet className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-sm font-medium text-foreground">지방</span>
            </div>
            <div className="font-semibold text-foreground">
              {selectedNutrition.fat}
              <span className="text-xs text-muted-foreground ml-1">g</span>
            </div>
          </div>
          {remaining && (
            <div className="mt-1 text-xs text-right">
              <span
                className={
                  remaining.fat >= 0
                    ? "text-accent-foreground font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {remaining.fat >= 0
                  ? `남음: ${remaining.fat}g`
                  : `초과: ${Math.abs(remaining.fat)}g`}
              </span>
            </div>
          )}
        </div>

        {/* 예산 */}
        {summary && (
          <div className="p-3 rounded-xl shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2 p-1.5 bg-white/60 rounded-full shadow-inner">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">예산</span>
              </div>
              <div className="font-semibold text-foreground">
                {selectedNutrition.cost.toLocaleString()}
                <span className="text-xs text-muted-foreground ml-1">원</span>
              </div>
            </div>
            {remaining && (
              <div className="mt-1 text-xs text-right">
                <span
                  className={
                    remaining.budget >= 0
                      ? "text-accent-foreground font-medium"
                      : "text-red-500 font-medium"
                  }
                >
                  {remaining.budget >= 0
                    ? `남은 예산: ${remaining.budget.toLocaleString()}원`
                    : `초과: ${Math.abs(remaining.budget).toLocaleString()}원`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightInfoBox;
