// samename/client/src/pages/DietResult.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

import useRecommendStore from "../stores/useRecommendStore";
import useSelectedMealsStore from "../stores/useSelectedMealsStore";
import { getMealInfo } from "@/utils/mealInfo";

const DietResult: React.FC = () => {
  const { recommendation } = useRecommendStore();
  const { selectedMeals } = useSelectedMealsStore();

  // 실제 선택된 식사만 필터링
  const meals = selectedMeals.filter(meal => !!meal);

  // 0) 식사가 없을 경우 안내
  if (!selectedMeals || selectedMeals.length === 0) {
    return (
      <div className="p-6">
        <p className="text-center py-8 text-gray-500">먼저 식단 추천을 받아주세요.</p>
      </div>
    );
  }

  // 1) 선택한 식단 영양소 합산하기
  const nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  meals.forEach(meal => {
    if (meal) {
      nutrition.calories += meal.calories || 0;
      nutrition.protein += meal.protein || 0;
      nutrition.carbs += meal.carbs || 0;
      nutrition.fat += meal.fat || 0;
    }
  });

  // 2) PieChart용 퍼센트 데이터(2자리수)
  const pieData = [
    {
      id: "칼로리",
      label: "칼로리",
      value: parseFloat(
        ((nutrition.calories / (recommendation?.summary?.totalCalories || 1)) * 100).toFixed(2)
      ),
    },
    {
      id: "단백질",
      label: "단백질",
      value: parseFloat(
        ((nutrition.protein / (recommendation?.summary?.totalProtein || 1)) * 100).toFixed(2)
      ),
    },
    {
      id: "탄수화물",
      label: "탄수화물",
      value: parseFloat(
        ((nutrition.carbs / (recommendation?.summary?.totalCarbs || 1)) * 100).toFixed(2)
      ),
    },
    {
      id: "지방",
      label: "지방",
      value: parseFloat(
        ((nutrition.fat / (recommendation?.summary?.totalFat || 1)) * 100).toFixed(2)
      ),
    },
  ];

  // 3) BarChart용 비교 데이터
  const nutritionComparisonData = [
    {
      name: "칼로리",
      섭취량: nutrition.calories,
      권장량: recommendation?.summary?.totalCalories ?? 0,
    },
    {
      name: "단백질",
      섭취량: nutrition.protein,
      권장량: recommendation?.summary?.totalProtein ?? 0,
    },
    { name: "탄수화물", 섭취량: nutrition.carbs, 권장량: recommendation?.summary?.totalCarbs ?? 0 },
    { name: "지방", 섭취량: nutrition.fat, 권장량: recommendation?.summary?.totalFat ?? 0 },
  ];

  // 식사 시간 레이블 준비 (아침, 점심, 저녁)
  const baseLabels = ["아침", "점심", "저녁"];
  const mealLabels = baseLabels.slice(0, meals.length);

  // 동적 그리드 컬럼 클래스
  const colsClass =
    meals.length === 2
      ? "sm:grid-cols-2"
      : meals.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-1";

  return (
    <div className="p-6 space-y-6">
      {/* 상단 제목 */}
      <h1 className="text-3xl font-bold text-center">오늘의 식단 결과</h1>

      {/* 차트 섹션 */}
      <div className="flex justify-center">
        <Card className="w-full max-w-[1200px] lg:h-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 목표 대비 영양소 섭취 비율 (PieChart) */}
              <div className="md:border-r md:border-gray-200 md:pr-4">
                <h2 className="text-xl font-semibold">목표 대비 영양소 섭취 비율</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  일일 권장량 대비 섭취 비율(%)을 보여줍니다.
                </p>
                <Separator className="my-4" />
                <div className="w-full h-[350px] overflow-hidden">
                  <ResponsivePie
                    data={pieData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.6}
                    padAngle={1.5}
                    cornerRadius={4}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: "set2" }}
                    borderWidth={1}
                    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemsSpacing: 10,
                        itemWidth: 80,
                        itemHeight: 18,
                        symbolSize: 12,
                        symbolShape: "circle",
                        itemTextColor: "#555",
                        effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
                      },
                    ]}
                  />
                </div>
              </div>

              {/* 영양소 섭취량 비교 (BarChart) */}
              <div className="md:pl-4">
                <h2 className="text-xl font-semibold">영양소 섭취량 비교</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  실제 섭취량과 권장량을 나란히 비교합니다.
                </p>
                <Separator className="my-4" />
                <div className="w-full h-[350px] overflow-hidden">
                  <ResponsiveBar
                    data={nutritionComparisonData}
                    keys={["섭취량", "권장량"]}
                    indexBy="name"
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    padding={0.4}
                    colors={({ id }: { id: string }) => (id === "섭취량" ? "#FFC107" : "#03A9F4")}
                    axisLeft={{
                      legend: "섭취량 / 권장량",
                      legendPosition: "middle",
                      legendOffset: -55,
                    }}
                    enableLabel
                    labelSkipWidth={16}
                    labelSkipHeight={16}
                    labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemsSpacing: 10,
                        itemWidth: 80,
                        itemHeight: 18,
                        symbolSize: 12,
                        symbolShape: "circle",
                        itemTextColor: "#555",
                        effects: [{ on: "hover", style: { itemTextColor: "#000" } }],
                      },
                    ]}
                    tooltip={({
                      id,
                      value,
                      indexValue,
                    }: {
                      id: string;
                      value: number;
                      indexValue: string;
                    }) => (
                      <div className="p-2 text-sm bg-white border rounded shadow">
                        <strong>{indexValue}</strong>
                        <br />
                        {id}: {value.toLocaleString()}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 식사별 선택 이유 & 장점 */}
            <section className={`mt-8 grid grid-cols-1 ${colsClass} gap-6`}>
              {meals.map((meal, idx) => {
                if (!meal) return null;
                const { reason, benefit } = getMealInfo(meal.name);
                const label = mealLabels[idx] || `식사 ${idx + 1}`;
                return (
                  <Card key={idx} className="w-full">
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold mb-2">
                        {label}: {meal.name}
                      </h2>
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <p className="mb-1">
                        <strong>선택 이유:</strong> {reason}
                      </p>
                      <p>
                        <strong>장점:</strong> {benefit}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DietResult;
