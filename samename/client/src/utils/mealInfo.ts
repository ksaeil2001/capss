// samename/client/src/utils/mealInfo.ts

export interface MealInfo {
  reason: string;
  benefit: string;
}

export const mealInfoMap: Record<string, MealInfo> = {
  "닭가슴살 샐러드": {
    reason: "단백질 함량이 높아 근육 회복에 도움이 됩니다.",
    benefit: "포만감을 유지하면서도 전체 칼로리는 낮출 수 있습니다.",
  },
  "현미밥과 구운 야채": {
    reason: "식이섬유가 풍부해 소화에 용이하고 포만감을 오래 유지해줍니다.",
    benefit: "혈당 상승을 완만하게 해줘 안정적인 에너지를 제공합니다.",
  },
};

export function getMealInfo(name: string): MealInfo {
  return (
    mealInfoMap[name] ?? {
      reason: "선택 이유 정보가 없습니다.",
      benefit: "추가된 정보가 없습니다.",
    }
  );
}
