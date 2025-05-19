import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type DietRecommendation, type Meal, type UserInfo } from "@shared/schema";
import { getDietRecommendation } from "@/api/recommend";
import useUserInfoStore from "./useUserInfoStore";

type RecommendStore = {
  recommendation: DietRecommendation | null;
  meals: Meal[];
  isLoading: boolean;
  error: string | null;

  setRecommendation: (recommendation: DietRecommendation) => void;
  setMeals: (meals: Meal[]) => void;
  refreshMeals: () => Promise<void>; // API 호출하여 새로운 추천 가져오기
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const useRecommendStore = create(
  persist<RecommendStore>(
    (set, get) => ({
      recommendation: null,
      meals: [],
      isLoading: false,
      error: null,

      setRecommendation: recommendation => {
        set({
          recommendation,
          meals: recommendation?.meals || [],
          isLoading: false,
          error: null,
        });
      },

      setMeals: meals => set({ meals }),

      refreshMeals: async () => {
        try {
          set({ isLoading: true, error: null });
          const userInfo = useUserInfoStore.getState().userInfo as UserInfo;
          const recommendation = await getDietRecommendation(userInfo);
          set({
            recommendation,
            meals: recommendation.meals,
            isLoading: false,
          });
        } catch (err) {
          console.error("Error refreshing meals:", err);
          set({
            error: "식단 추천을 가져오는 데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      setLoading: isLoading => {
        set({ isLoading });
      },

      setError: error => {
        set({ error, isLoading: false });
      },

      reset: () => {
        set({
          recommendation: null,
          meals: [],
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "recommend-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRecommendStore;
