import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Meal } from '@shared/schema';
import { useMealPlanStore } from './useMealPlanStore';

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
  // 기본적으로 3개 슬롯 사용, 나중에 useUserInfoStore에서 가져온 값으로 조정
  let mealsPerDay = 3;
  
  try {
    // useUserInfoStore에서 mealsPerDay 값 가져오기 시도
    const userInfoStore = require('./useUserInfoStore').default;
    const userInfo = userInfoStore.getState().userInfo;
    
    if (userInfo && userInfo.mealsPerDay) {
      mealsPerDay = userInfo.mealsPerDay;
    }
  } catch (error) {
    console.error('유저 정보를 가져오는데 실패했습니다:', error);
  }
  
  // 선택한 끼니 수에 맞게 빈 슬롯 배열 생성
  return {
    selectedMeals: Array(mealsPerDay).fill(null),
    isInitialized: false
  };
};

// 초기 상태 설정
const initialState = getInitialState();

const useSelectedMealsStore = create(
  persist<SelectedMealsStore>(
    (set, get) => ({
      ...initialState,
      
      selectMeal: (meal, index) => set((state) => {
        const newSelectedMeals = [...state.selectedMeals];
        
        if (index !== undefined) {
          newSelectedMeals[index] = meal;
        } else {
          // 빈 슬롯 찾아서 추가
          const emptyIndex = newSelectedMeals.findIndex(item => item === null);
          if (emptyIndex !== -1) {
            newSelectedMeals[emptyIndex] = meal;
          }
        }
        
        return { selectedMeals: newSelectedMeals };
      }),
      
      removeMeal: (index) => set((state) => {
        const newSelectedMeals = [...state.selectedMeals];
        newSelectedMeals[index] = null;
        return { selectedMeals: newSelectedMeals };
      }),
      
      clearSelectedMeals: () => {
        // useUserInfoStore에서 mealsPerDay 값 가져오기
        let mealsPerDay = 3;
        try {
          const userInfoStore = require('./useUserInfoStore').default;
          const userInfo = userInfoStore.getState().userInfo;
          
          if (userInfo && userInfo.mealsPerDay) {
            mealsPerDay = userInfo.mealsPerDay;
          }
        } catch (error) {
          console.error('유저 정보를 가져오는데 실패했습니다:', error);
        }
        
        // 선택한 끼니 수에 맞게 빈 슬롯 배열 생성
        set({ selectedMeals: Array(mealsPerDay).fill(null) });
      },
      
      initialize: () => {
        // 이 함수는 앱이 시작될 때 한 번만 호출됨
        if (!get().isInitialized) {
          set({ ...initialState, isInitialized: true });
        }
      },
      
      transferToMealPlan: () => {
        const { selectedMeals } = get();
        const mealPlanStore = useMealPlanStore.getState();
        
        // 기존 식단 초기화
        mealPlanStore.resetMeals();
        
        // 선택한 식단들을 슬롯 순서대로 아침, 점심, 저녁에 배정
        const mealSlots = ['breakfast', 'lunch', 'dinner'] as const;
        
        console.log('transferToMealPlan 호출됨, 전달할 식단:', selectedMeals);
        
        // 비어있지 않은 식단만 필터링
        const validMeals = selectedMeals.filter(meal => meal !== null);
        
        // 각 슬롯에 식단을 고르게 분배
        validMeals.forEach((meal, index) => {
          if (meal) {
            // 인덱스에 따라 아침/점심/저녁 슬롯에 배정
            const targetSlot = mealSlots[index % mealSlots.length];
            
            // 식단 추가
            mealPlanStore.addMeal(targetSlot, meal);
            console.log(`${targetSlot} 슬롯에 식단 추가:`, meal.name);
          }
        });
      },
    }),
    {
      name: 'selected-meals-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useSelectedMealsStore;
