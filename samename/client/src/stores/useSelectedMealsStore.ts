import { create } from "zustand";
import useUserInfoStore from "./useUserInfoStore";
import { persist, createJSONStorage } from "zustand/middleware";
import { Meal } from "@shared/schema";
import { useMealPlanStore } from "./useMealPlanStore";

type SelectedMealsStore = {
  selectedMeals: (Meal | null)[];
  isInitialized: boolean;
  selectMeal: (meal: Meal, index?: number) => void;
  removeMeal: (index: number) => void;
  clearSelectedMeals: () => void;
  transferToMealPlan: () => void;
  initialize: () => void;
};

// 사용자가 선택한 끼니 수에 따라 슬롯 배열 크기를 조정하는 함수
const getInitialState = () => {
  let mealsPerDay = 3;

  try {
    const userInfo = useUserInfoStore.getState().userInfo;
    if (userInfo && userInfo.mealsPerDay) {
      mealsPerDay = userInfo.mealsPerDay;
    }
  } catch (error) {
    console.error("유저 정보를 가져오는데 실패했습니다:", error);
  }

  return {
    selectedMeals: Array(mealsPerDay).fill(null),
    isInitialized: false,
  };
};

// 초기 상태 설정
const initialState = getInitialState();

const useSelectedMealsStore = create(
  persist<SelectedMealsStore>(
    (set, get) => ({
      ...initialState,

      selectMeal: (meal, index) =>
        set(state => {
          const newSelectedMeals = [...state.selectedMeals];

          if (index !== undefined) {
            newSelectedMeals[index] = meal;
          } else {
            const emptyIndex = newSelectedMeals.findIndex(item => item === null);
            if (emptyIndex !== -1) {
              newSelectedMeals[emptyIndex] = meal;
            }
          }

          return { selectedMeals: newSelectedMeals };
        }),

      removeMeal: index =>
        set(state => {
          const newSelectedMeals = [...state.selectedMeals];
          newSelectedMeals[index] = null;
          return { selectedMeals: newSelectedMeals };
        }),

      clearSelectedMeals: () => {
        let mealsPerDay = 3;
        try {
          const userInfo = useUserInfoStore.getState().userInfo;
          if (userInfo && userInfo.mealsPerDay) {
            mealsPerDay = userInfo.mealsPerDay;
          }
        } catch (error) {
          console.error("유저 정보를 가져오는데 실패했습니다:", error);
        }

        set({ selectedMeals: Array(mealsPerDay).fill(null) });
      },

      initialize: () => {
        if (!get().isInitialized) {
          set({ ...initialState, isInitialized: true });
        }
      },

      transferToMealPlan: () => {
        const { selectedMeals } = get();
        const mealPlanStore = useMealPlanStore.getState();

        mealPlanStore.resetMeals();

        const mealSlots = ["breakfast", "lunch", "dinner"] as const;

        console.log("transferToMealPlan 호출됨, 전달할 식단:", selectedMeals);

        const validMeals = selectedMeals.filter(meal => meal !== null);

        validMeals.forEach((meal, index) => {
          if (meal) {
            const targetSlot = mealSlots[index % mealSlots.length];
            mealPlanStore.addMeal(targetSlot, meal);
            console.log(`${targetSlot} 슬롯에 식단 추가:`, meal.name);
          }
        });
      },
    }),
    {
      name: "selected-meals-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSelectedMealsStore;
