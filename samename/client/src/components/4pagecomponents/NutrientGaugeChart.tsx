import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts';
// import { ChartCard } from '@/styles/common';
import { ChartCard } from '../../styles/common';

interface NutrientData {
  current: number;
  target: number;
}

interface Summary {
  [key: string]: NutrientData;
}

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

interface NutrientGaugeChartProps {
  summary: Summary;
}

const NutrientGaugeChart: React.FC<NutrientGaugeChartProps> = ({ summary }) => {
  const nutrients = Object.entries(summary).filter(([key]) => key !== 'budget');

  const data = nutrients.map(([key, value], index) => ({
    name: key,
    percent: Math.min(100, Math.round((value.current / value.target) * 100)),
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <ChartCard
      style={{
        width: '100%',
        maxWidth: '600px',
        minHeight: '340px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '1.5rem 1.5rem',
        gap: '1rem',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px 0 rgba(80, 120, 200, 0.08)',
      }}
    >
      <h3
        style={{
          fontWeight: 700,
          fontSize: '1.2rem',
          marginBottom: '1rem',
          textAlign: 'center',
          color: '#222',
        }}
      >
        영양소 게이지
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadialBarChart
          innerRadius="30%"
          outerRadius="90%"
          barSize={18}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            background
            dataKey="percent"
            cornerRadius={8}
          />
          <Legend
            iconSize={10}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              marginTop: '12px',
              color: '#555',
              fontSize: '14px',
              fontWeight: 500,
            }}
            formatter={(value: any) => {
              const nutrient = nutrients.find(([k]) => k === value);
              return nutrient
                ? `${nutrient[0]}: ${summary[value].current}/${summary[value].target}`
                : value;
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>


    </ChartCard>
  );
};

export default NutrientGaugeChart;
