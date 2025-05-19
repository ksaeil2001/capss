import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Meal } from "@shared/schema";

// 식단 구성 슬롯 타입 정의
type MealSlot = "breakfast" | "lunch" | "dinner";

// 영양소 총합 타입 정의
type MealPlanTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  budget: number;
};

// 식단 계획 상태 타입 정의
type MealPlanState = {
  meals: Record<MealSlot, Meal[]>;
  totals: MealPlanTotals;
  addMeal: (slot: MealSlot, meal: Meal) => void;
  removeMeal: (slot: MealSlot, index: number) => void;
  moveMeal: (fromSlot: MealSlot, fromIndex: number, toSlot: MealSlot, toIndex: number) => void;
  resetMeals: () => void;
};

// 총합 영양소 계산 함수
const calculateTotals = (meals: Record<MealSlot, Meal[]>): MealPlanTotals => {
  const initialTotals: MealPlanTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    budget: 0,
  };

  // 모든 슬롯의 전체 음식을 하나의 배열로 평탄화
  const allMeals = Object.values(meals).flat();

  // 평탄화된 배열을 reduce로 순회하면서 영양소 수치 계산
  return allMeals.reduce((acc, meal) => {
    return {
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
      budget: acc.budget + (meal.price || 0),
    };
  }, initialTotals);
};

// Zustand 스토어 생성
export const useMealPlanStore = create(
  persist<MealPlanState>(
    set => ({
      // 초기 상태
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
      },

      // 초기 총합 값
      totals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        budget: 0,
      },

      // 식단 추가 메서드
      addMeal: (slot, meal) =>
        set(state => {
          // 새로운 식단 구성 - 현재 슬롯에 음식 추가
          const newMeals = {
            ...state.meals,
            [slot]: [...state.meals[slot], meal],
          };

          // 새로운 총합 계산
          const newTotals = calculateTotals(newMeals);

          return {
            meals: newMeals,
            totals: newTotals,
          };
        }),

      // 식단 삭제 메서드
      removeMeal: (slot, index) =>
        set(state => {
          // 새로운 슬롯 구성
          const newSlotMeals = [...state.meals[slot]];
          newSlotMeals.splice(index, 1);

          // 새로운 식단 구성
          const newMeals = {
            ...state.meals,
            [slot]: newSlotMeals,
          };

          // 새로운 총합 계산
          const newTotals = calculateTotals(newMeals);

          return {
            meals: newMeals,
            totals: newTotals,
          };
        }),

      // 식단 이동 메서드 (Drag & Drop)
      moveMeal: (fromSlot, fromIndex, toSlot, toIndex) =>
        set(state => {
          // 이동할 음식 선택
          const mealToMove = state.meals[fromSlot][fromIndex];

          // 원본 배열의 복사본 생성
          const newFromSlotMeals = [...state.meals[fromSlot]];
          const newToSlotMeals = [...state.meals[toSlot]];

          // 원본에서 삭제
          newFromSlotMeals.splice(fromIndex, 1);

          // 목적지에 추가
          if (fromSlot === toSlot && fromIndex < toIndex) {
            // 같은 슬롯에서 바로 위 항목을 삭제했으니 인덱스 조정
            newToSlotMeals.splice(toIndex - 1, 0, mealToMove);
          } else {
            newToSlotMeals.splice(toIndex, 0, mealToMove);
          }

          // 새로운 식단 구성
          const newMeals = {
            ...state.meals,
            [fromSlot]: newFromSlotMeals,
            [toSlot]: newToSlotMeals,
          };

          return {
            meals: newMeals,
            totals: state.totals, // 이동이기 때문에 총합은 변하지 않음
          };
        }),

      // 식단 초기화 메서드
      resetMeals: () =>
        set({
          meals: {
            breakfast: [],
            lunch: [],
            dinner: [],
          },
          totals: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            budget: 0,
          },
        }),
    }),
    {
      name: "meal-plan-storage", // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);
