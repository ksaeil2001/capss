import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styled from '@emotion/styled';
// import { ChartCard } from '@/styles/common'; // ✅ alias 적용
import { ChartCard } from '../../styles/common';

interface NutrientData {
  protein: number;
  fat: number;
  carbs: number;
}

interface Meals {
  [key: string]: NutrientData;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const COLORS = {
  protein: '#4dabf7', // 단백질 (파랑)
  fat: '#20c997',     // 지방 (초록)
  carbs: '#fcc419',   // 탄수화물 (노랑)
  total: '#ff6b6b',   // 총 칼로리 (빨강)
};

const CALORIES_PER_GRAM = {
  protein: 4,
  fat: 9,
  carbs: 4,
};

interface MealStackedBarChartProps {
  meals: Meals;
}

const MealStackedBarChart: React.FC<MealStackedBarChartProps> = ({ meals }) => {
  const mealNames: Record<string, string> = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
  };

  const data = Object.entries(meals)
    .filter(([meal]) => meal !== 'snack')
    .map(([meal, nutrients]) => {
      const proteinKcal = nutrients.protein * CALORIES_PER_GRAM.protein;
      const fatKcal = nutrients.fat * CALORIES_PER_GRAM.fat;
      const carbsKcal = nutrients.carbs * CALORIES_PER_GRAM.carbs;
      const totalKcal = proteinKcal + fatKcal + carbsKcal;
      return {
        name: mealNames[meal],
        proteinKcal,
        fatKcal,
        carbsKcal,
        totalCalories: totalKcal,
        proteinG: nutrients.protein,
        fatG: nutrients.fat,
        carbsG: nutrients.carbs,
      };
    });

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      const totalKcal = item.totalCalories || 0;

      return (
        <TooltipContainer>
          <TooltipHeader>{label}</TooltipHeader>
          <TooltipContent>
            <TooltipItem>
              <TooltipDot style={{ backgroundColor: COLORS.total }} />
              <TooltipLabel>총 칼로리:</TooltipLabel>
              <TooltipValue>{totalKcal} kcal</TooltipValue>
            </TooltipItem>
            {[
              { key: 'proteinKcal', label: '단백질', kcal: item.proteinKcal, grams: item.proteinG },
              { key: 'fatKcal', label: '지방', kcal: item.fatKcal, grams: item.fatG },
              { key: 'carbsKcal', label: '탄수화물', kcal: item.carbsKcal, grams: item.carbsG },
            ].map(({ key, label, kcal, grams }) => {
              const percent = totalKcal ? (kcal / totalKcal) * 100 : 0;
              return (
                <TooltipItem key={key}>
                  <TooltipDot style={{ backgroundColor: COLORS[key.replace('Kcal', '') as keyof typeof COLORS] }} />
                  <TooltipLabel>{label}:</TooltipLabel>
                  <TooltipValue>
                    {grams}g ({kcal} kcal, {percent.toFixed(1)}%)
                  </TooltipValue>
                </TooltipItem>
              );
            })}
          </TooltipContent>
        </TooltipContainer>
      );
    }
    return null;
  };

  return (
    <ChartCard>
      <ChartHeader>
        <ChartTitle>식사별 영양소 칼로리 분포</ChartTitle>
        <ChartSubtitle>아침, 점심, 저녁의 영양소 칼로리 기여도와 총 칼로리를 비교하세요</ChartSubtitle>
      </ChartHeader>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#444', fontSize: 14, fontWeight: 600 }}
          />
          <YAxis
            tick={{ fill: '#444', fontSize: 12 }}
            tickFormatter={(value) => `${value} kcal`}
            stroke={COLORS.total}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }} />
          <Legend
            verticalAlign="top"
            iconType="circle"
            formatter={(value) => {
              if (value === 'totalCalories') return '총 칼로리 (kcal)';
              if (value === 'proteinKcal') return '단백질 (kcal)';
              if (value === 'fatKcal') return '지방 (kcal)';
              if (value === 'carbsKcal') return '탄수화물 (kcal)';
              return value;
            }}
          />
          <Bar dataKey="proteinKcal" name="단백질 (kcal)" stackId="macro" fill={COLORS.protein} radius={[8, 8, 0, 0]} barSize={20} />
          <Bar dataKey="fatKcal" name="지방 (kcal)" stackId="macro" fill={COLORS.fat} radius={[8, 8, 0, 0]} barSize={20} />
          <Bar dataKey="carbsKcal" name="탄수화물 (kcal)" stackId="macro" fill={COLORS.carbs} radius={[8, 8, 0, 0]} barSize={20} />
          <Bar dataKey="totalCalories" name="총 칼로리 (kcal)" stackId="total" fill={COLORS.total} radius={[8, 8, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const ChartHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-weight: 700;
  font-size: 1.5rem;
  color: #222;
  margin-bottom: 0.5rem;
`;

const ChartSubtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0;
`;

const TooltipContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
`;

const TooltipHeader = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #333;
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TooltipDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;

const TooltipLabel = styled.span`
  flex: 1;
  font-size: 0.95rem;
  color: #555;
`;

const TooltipValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
`;

export default MealStackedBarChart;
