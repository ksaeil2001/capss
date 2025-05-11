import React from 'react';
import ResponsivePie, { PieProps } from '@nivo/pie';
import { nutrientNames } from '@/constants/nutrients';
import { getNutrientColor } from '@/utils/dietUtils';
// import { ChartCard } from '@/styles/common';
import { ChartCard } from '../../styles/common';

interface NutrientData {
  current: number;
  target: number;
}

interface Summary {
  [key: string]: NutrientData;
}

interface PieData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface PieRatioChartProps {
  summary: Summary;
}

const PieRatioChart: React.FC<PieRatioChartProps> = ({ summary }) => {
  const data: PieData[] = nutrientNames.map(n => ({
    id: n.label,
    label: n.label,
    value: summary[n.key].current,
    color: getNutrientColor(n.key),
  }));

  return (
    <ChartCard>
      <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>영양소 섭취 비율</h3>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.6}
          padAngle={1}
          cornerRadius={8}
          colors={(d: { data: PieData }) => d.data.color}  // ✅ 직접 타입 지정
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLinkLabels={false}
          arcLabelsTextColor="#222"
          animate={true}
        />
      </div>
    </ChartCard>
  );
};

export default PieRatioChart;
