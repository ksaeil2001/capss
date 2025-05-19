import { create } from "zustand";
import { type DietRecommendation } from "@shared/schema";

// DietRecommendation의 summary 부분만 취하는 타입
type NutritionSummary = DietRecommendation["summary"];

type PreviewStore = {
  summary: NutritionSummary | null;
  isVisible: boolean;

  setSummary: (summary: NutritionSummary) => void;
  setVisible: (isVisible: boolean) => void;
  reset: () => void;
};

const usePreviewStore = create<PreviewStore>(set => ({
  summary: null,
  isVisible: false,

  setSummary: summary => {
    set({ summary });
  },

  setVisible: isVisible => {
    set({ isVisible });
  },

  reset: () => {
    set({
      summary: null,
      isVisible: false,
    });
  },
}));

export default usePreviewStore;
