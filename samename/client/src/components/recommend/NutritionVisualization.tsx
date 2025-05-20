import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { DietRecommendation, Meal } from "@shared/schema";
import { Payload } from "recharts/types/component/DefaultTooltipContent";

interface NutritionVisualizationProps {
  summary: DietRecommendation["summary"];
  selectedMeals: (Meal | null)[];
}

// 칼로리 섭취량을 영양소별로 분석하는 컴포넌트
const NutritionVisualization: React.FC<NutritionVisualizationProps> = ({
  summary,
  selectedMeals,
}) => {
  // 선택된 식단들의 영양소 합계 계산
  const selectedMealsNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    budget: 0,
  };

  // 빈 값(null)이 아닌 선택된 식단들의 영양소만 합산
  selectedMeals.forEach(meal => {
    if (meal) {
      selectedMealsNutrition.calories += meal.calories || 0;
      selectedMealsNutrition.protein += meal.protein || 0;
      selectedMealsNutrition.carbs += meal.carbs || 0;
      selectedMealsNutrition.fat += meal.fat || 0;
      selectedMealsNutrition.budget += meal.price || 0;
    }
  });

  // 영양소 비율 계산 (PieChart용)
  const macroDistributionData = [
    { name: "단백질", value: selectedMealsNutrition.protein * 4 }, // 단백질 1g = 4kcal
    { name: "탄수화물", value: selectedMealsNutrition.carbs * 4 }, // 탄수화물 1g = 4kcal
    { name: "지방", value: selectedMealsNutrition.fat * 9 }, // 지방 1g = 9kcal
  ];

  // 총 칼로리에 대한 각 영양소의 비율 계산
  const totalCalories = macroDistributionData.reduce((sum, item) => sum + item.value, 0);
  const macroPercentages = macroDistributionData.map(item => ({
    ...item,
    percentage: totalCalories > 0 ? Math.round((item.value / totalCalories) * 100) : 0,
  }));

  // 영양소 목표치 대비 현재 섭취량 비교 (BarChart용)
  const nutritionComparisonData = [
    {
      name: "칼로리",
      current: selectedMealsNutrition.calories,
      target: summary.totalCalories,
      unit: "kcal",
    },
    {
      name: "단백질",
      current: selectedMealsNutrition.protein,
      target: summary.totalProtein,
      unit: "g",
    },
    {
      name: "탄수화물",
      current: selectedMealsNutrition.carbs,
      target: summary.totalCarbs,
      unit: "g",
    },
    {
      name: "지방",
      current: selectedMealsNutrition.fat,
      target: summary.totalFat,
      unit: "g",
    },
  ];

  // 영양소 균형 점수 (RadarChart용)
  // 각 영양소의 목표 대비 현재 비율을 백분율로 계산(최대 120%까지 표시)
  const nutritionBalanceData = [
    {
      subject: "칼로리",
      value: Math.min(
        120,
        Math.round((selectedMealsNutrition.calories / summary.totalCalories) * 100) || 0
      ),
      fullMark: 100,
    },
    {
      subject: "단백질",
      value: Math.min(
        120,
        Math.round((selectedMealsNutrition.protein / summary.totalProtein) * 100) || 0
      ),
      fullMark: 100,
    },
    {
      subject: "탄수화물",
      value: Math.min(
        120,
        Math.round((selectedMealsNutrition.carbs / summary.totalCarbs) * 100) || 0
      ),
      fullMark: 100,
    },
    {
      subject: "지방",
      value: Math.min(120, Math.round((selectedMealsNutrition.fat / summary.totalFat) * 100) || 0),
      fullMark: 100,
    },
    // 예산도 추가
    {
      subject: "예산",
      value: Math.min(
        120,
        Math.round((selectedMealsNutrition.budget / summary.totalBudget) * 100) || 0
      ),
      fullMark: 100,
    },
  ];

  // 파이 차트 색상
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="nutrition-visualization-wrapper space-y-8 p-4">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">영양소 균형</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={nutritionBalanceData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="현재 섭취량"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip formatter={(value: number) => [`${value}%`, "목표 대비"]} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">영양소 구성비</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={macroPercentages}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {macroPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${Math.round(value)} kcal`, "열량"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">목표 대비 현재 섭취량</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={nutritionComparisonData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(
                value: number,
                name: "current" | "target",
                props: Payload<number, "current" | "target">
              ) => {
                const unit = (props.payload as { unit?: string })?.unit ?? "";
                return [`${value} ${unit}`, name === "current" ? "현재" : "목표"];
              }}
            />
            <Legend />
            <Bar dataKey="current" name="현재" fill="#8884d8" />
            <Bar dataKey="target" name="목표" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NutritionVisualization;
