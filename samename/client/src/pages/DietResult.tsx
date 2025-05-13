import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

// stores 폴더 파일에서 데이터 가져오기
import useRecommendStore from "../stores/useRecommendStore";
import useSelectedMealsStore from "../stores/useSelectedMealsStore";

const DietResult = () => {
  const { recommendation } = useRecommendStore();
  const { selectedMeals } = useSelectedMealsStore();

  // 선댁한 식단 영양소 합산하기
  const nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  selectedMeals.forEach(meal => {
    if (meal) {
      nutrition.calories += meal.calories || 0;
      nutrition.protein += meal.protein || 0;
      nutrition.carbs += meal.carbs || 0;
      nutrition.fat += meal.fat || 0;
    }
  });

  // 차트용 데이터 가공하기
  // 1. 퍼센트 차트용 (PieChart)
  const pieData = [
    {
      id: "칼로리",
      label: "칼로리",
      value: (nutrition.calories / (recommendation?.summary?.totalCalories || 1)) * 100,
    },
    {
      id: "단백질",
      label: "단백질",
      value: (nutrition.protein / (recommendation?.summary?.totalProtein || 1)) * 100,
    },
    {
      id: "탄수화물",
      label: "탄수화물",
      value: (nutrition.carbs / (recommendation?.summary?.totalCarbs || 1)) * 100,
    },
    {
      id: "지방",
      label: "지방",
      value: (nutrition.fat / (recommendation?.summary?.totalFat || 1)) * 100,
    },
  ];

  // 2. 목표 대비 차트용(BarChart) → Nivo용 데이터로 가공
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
    {
      name: "탄수화물",
      섭취량: nutrition.carbs,
      권장량: recommendation?.summary?.totalCarbs ?? 0,
    },
    {
      name: "지방",
      섭취량: nutrition.fat,
      권장량: recommendation?.summary?.totalFat ?? 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 상단 제목 */}
      <h1 className="text-3xl font-bold text-center">오늘의 식단 결과</h1>

      {/* 카드 영역 */}
      <div className="flex justify-center">
        <Card className="w-full max-w-[1200px] lg:h-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 목표 대비 영양소 섭취 비율 */}
              <div className="md:border-r md:border-gray-200 md:pr-4">
                <h2 className="text-xl font-semibold">목표 대비 영양소 섭취 비율</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  이 영양소의 일일 권장량 대비 섭취 비율(%)을 보여줍니다.
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
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 10,
                        itemWidth: 80,
                        itemHeight: 18,
                        itemDirection: "left-to-right",
                        symbolSize: 12,
                        symbolShape: "circle",
                        itemTextColor: "#555",
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemTextColor: "#000",
                            },
                          },
                        ],
                      },
                    ]}
                  />
                </div>
              </div>

              {/* 영양소 섭취량 비교 */}
              <div className="md:pl-4">
                <h2 className="text-xl font-semibold">영양소 섭취량 비교</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  각 영양소의 실제 섭취량과 권장량을 나란히 비교해보세요.
                </p>
                <Separator className="my-4" />

                <div className="w-full h-[350px] overflow-hidden">
                  <ResponsiveBar
                    data={nutritionComparisonData}
                    keys={["섭취량", "권장량"]}
                    indexBy="name"
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    padding={0.4}
                    colors={({ id }) => (id === "섭취량" ? "#FFC107" : "#03A9F4")}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      legend: "섭취량 / 권장량",
                      legendPosition: "middle",
                      legendOffset: -55,
                    }}
                    enableLabel={true}
                    labelTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    labelSkipWidth={16}
                    labelSkipHeight={16}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 10,
                        itemWidth: 80,
                        itemHeight: 18,
                        itemDirection: "left-to-right",
                        symbolSize: 12,
                        symbolShape: "circle",
                        itemTextColor: "#555",
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemTextColor: "#000",
                            },
                          },
                        ],
                      },
                    ]}
                    tooltip={({ id, value, indexValue }: { id: string; value: number; indexValue: string }) => (
                      <div className="p-2 text-sm bg-white border rounded shadow">
                        <strong>{indexValue}</strong> <br />
                        {id}: {value.toLocaleString()}
                      </div>
                    )}
                    role="application"
                    ariaLabel="영양소 섭취량 비교 바 차트"
                    barAriaLabel={e => `${e.id}: ${e.formattedValue} (${e.indexValue})`}
                  />
                </div>
              </div>
            </div> {/* /grid grid-cols-2 */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DietResult;
