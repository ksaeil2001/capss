import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import styled from '@emotion/styled';
import { Container, Title, ChartContainer, WarningContainer, Button, ChartsGrid } from '@/styles/common';

interface NutrientData {
  current: number;
  target: number;
  percentage: number;
}

interface DietSummaryData {
  calories: NutrientData;
  protein: NutrientData;
  fat: NutrientData;
  carbs: NutrientData;
  budget: NutrientData;
  allergies: string[];
}

const COLORS = {
  normal: '#00C49F',
  warning: '#FF0000'
};

const DietSummary: React.FC = () => {
  const [dietSummary, setDietSummary] = useState<DietSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ✅ 실제 API 호출 부분
    const fetchDietSummary = async () => {
      try {
        const response = await fetch('/api/diet-summary'); // 👉 API 엔드포인트에 맞게 변경
        if (!response.ok) throw new Error('데이터 로드 실패');
        const data: DietSummaryData = await response.json();
        setDietSummary(data);
      } catch (error) {
        console.error('식단 요약 가져오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietSummary();
  }, []);

  const createChartData = (value: number) => [
    { name: '달성', value: value },
    { name: '미달성', value: 100 - value }
  ];

  const downloadSummary = () => {
    if (!dietSummary) return;

    const summaryText = `식단 요약 리포트\n
칼로리: ${dietSummary.calories.current}/${dietSummary.calories.target} kcal (${dietSummary.calories.percentage}%)\n단백질: ${dietSummary.protein.current}/${dietSummary.protein.target}g (${dietSummary.protein.percentage}%)\n지방: ${dietSummary.fat.current}/${dietSummary.fat.target}g (${dietSummary.fat.percentage}%)\n탄수화물: ${dietSummary.carbs.current}/${dietSummary.carbs.target}g (${dietSummary.carbs.percentage}%)\n예산: ${dietSummary.budget.current}/${dietSummary.budget.target}원 (${dietSummary.budget.percentage}%)\n알레르기 주의: ${dietSummary.allergies.join(', ')}`;

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '식단_요약.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderDonutChart = (value: number, title: string, hasAllergy: boolean = false) => (
    <ChartContainer>
      <h3>{title}</h3>
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={createChartData(value)}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            <Cell fill={hasAllergy ? COLORS.warning : COLORS.normal} />
            <Cell fill="#CCCCCC" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <p>{value}%</p>
    </ChartContainer>
  );

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  if (!dietSummary) {
    return <Container>데이터를 불러올 수 없습니다.</Container>;
  }

  return (
    <Container>
      <Title>오늘의 식단 요약</Title>
      <ChartsGrid>
        {renderDonutChart(dietSummary.calories.percentage, '칼로리')}
        {renderDonutChart(dietSummary.protein.percentage, '단백질')}
        {renderDonutChart(dietSummary.fat.percentage, '지방')}
        {renderDonutChart(dietSummary.carbs.percentage, '탄수화물')}
        {renderDonutChart(dietSummary.budget.percentage, '예산')}
        {renderDonutChart(100, '알레르기', dietSummary.allergies.length > 0)}
      </ChartsGrid>

      {dietSummary.allergies.length > 0 && (
        <WarningContainer>
          알레르기 주의: {dietSummary.allergies.join(', ')}
        </WarningContainer>
      )}

      <Button onClick={downloadSummary}>
        식단 요약 다운로드
      </Button>
    </Container>
  );
};

export default DietSummary;
