import React, { useState } from 'react';

interface Nutrient {
  key: string;
  label: string;
  color: string;
  unit: string;
}

interface NutrientDatum {
  current: number;
  target: number;
}

interface DataProps {
  [key: string]: NutrientDatum;
}

interface MultiDonutChartProps {
  data: DataProps;
  size?: number;
  strokeWidth?: number;
  chartTitle?: string;
  chartSubtitle?: string;
}

interface TooltipInfo {
  nutrient: Nutrient;
  value: number;
  target: number;
  percent: number;
  pos: { left: number; top: number };
}

const NUTRIENTS: Nutrient[] = [
  { key: 'calories', label: '칼로리', color: '#8884d8', unit: 'kcal' },
  { key: 'protein', label: '단백질', color: '#83a6ed', unit: 'g' },
  { key: 'fat', label: '지방', color: '#8dd1e1', unit: 'g' },
  { key: 'carbs', label: '탄수화물', color: '#82ca9d', unit: 'g' },
  { key: 'budget', label: '예산', color: '#a4de6c', unit: '원' },
];

const MultiDonutChart: React.FC<MultiDonutChartProps> = ({
  data,
  size = 420,
  strokeWidth = 28,
  chartTitle,
  chartSubtitle,
}) => {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const base = size / 2;
  const gap = 8;
  const radii = NUTRIENTS.map((_, i) => base - strokeWidth / 2 - i * (strokeWidth + gap));

  const getTooltipPos = (angle: number, i: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const r = radii[i];
    let left = base + r * Math.cos(rad);
    let top = base + r * Math.sin(rad);
    if (top < base - size * 0.25) top = base - size * 0.25;
    if (top > base + size * 0.25) top = base + size * 0.25;
    return { left, top };
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 220,
        marginTop: 56,
      }}
    >
      <div style={{ flex: 1 }}>
        {chartTitle && (
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 26, marginBottom: 24 }}>
            {chartTitle}
          </h2>
        )}
        {chartSubtitle && (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 16, marginBottom: 24 }}>
            {chartSubtitle}
          </div>
        )}
        <svg width={size} height={size} style={{ display: 'block' }}>
          {NUTRIENTS.map((nutrient, i) => {
            const datum = data?.[nutrient.key];
            if (!datum) return null;
            const { current, target } = datum;
            const percent = Math.max(0, Math.min(100, (current / target) * 100));
            const radius = radii[i];
            const circumference = 2 * Math.PI * radius;
            const offset = circumference * (1 - percent / 100);
            const angle = percent * 3.6;
            return (
              <g key={nutrient.key}>
                <circle
                  cx={base}
                  cy={base}
                  r={radius}
                  stroke="#eee"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <circle
                  cx={base}
                  cy={base}
                  r={radius}
                  stroke={nutrient.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s' }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      nutrient,
                      value: current,
                      target,
                      percent,
                      pos: { left: e.clientX, top: e.clientY + 18 },
                    })
                  }
                  onMouseMove={(e) =>
                    setTooltip({
                      nutrient,
                      value: current,
                      target,
                      percent,
                      pos: { left: e.clientX, top: e.clientY + 18 },
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  cursor="pointer"
                />
                <text
                  x={base - radius + strokeWidth / 2 + 8}
                  y={base}
                  fill="#fff"
                  fontSize="18"
                  fontWeight="bold"
                  alignmentBaseline="middle"
                >
                  {Math.round(percent)}
                </text>
              </g>
            );
          })}
        </svg>
        {tooltip && (
          <div
            style={{
              position: 'fixed',
              left: tooltip.pos.left,
              top: tooltip.pos.top,
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 10,
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              padding: '18px 22px',
              minWidth: 120,
              zIndex: 10,
              pointerEvents: 'none',
              transform: 'translate(-50%, 0)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
              {tooltip.nutrient.label}
            </div>
            <div style={{ color: '#666', marginBottom: 2 }}>
              {tooltip.value}/{tooltip.target} {tooltip.nutrient.unit}
            </div>
            <div style={{ color: '#888', fontSize: 15 }}>
              달성률: {tooltip.percent.toFixed(2)}%
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          marginLeft: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          fontSize: 17,
          fontWeight: 600,
        }}
      >
        {NUTRIENTS.map((n) => (
          <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                borderRadius: 8,
                background: n.color,
              }}
            />
            <span style={{ color: n.color }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiDonutChart;
