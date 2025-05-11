import React from 'react';
// import { ChartCard } from '@/styles/common';
import { ChartCard } from '../../styles/common';
import { nutrientNames } from '@/constants/nutrients';

interface NutrientData {
  current: number;
  target: number;
  unit: string;
}

interface Summary {
  [key: string]: NutrientData;
}

const NutrientRatioProgressBar: React.FC<{ summary: Summary }> = ({ summary }) => {
  const nutrients = nutrientNames.filter(n => n.key !== 'budget');

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
      <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 16 }}>영양소 섭취 Progress</h3>
      {nutrients.map((n, idx) => {
        const nutrient = summary[n.key];
        const percent = Math.round((nutrient.current / nutrient.target) * 100);
        return (
          <div key={n.key} style={{ width: '100%', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{n.label}</div>
            <div
              style={{
                background: '#eee',
                borderRadius: 4,
                overflow: 'hidden',
                height: 16,
                width: '100%',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, percent)}%`,
                  background: '#8884d8',
                  height: '100%',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {nutrient.current} / {nutrient.target} {nutrient.unit} ({percent}%)
            </div>
          </div>
        );
      })}
    </ChartCard>
  );
};

export default NutrientRatioProgressBar;
