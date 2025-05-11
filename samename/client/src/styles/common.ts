import styled from '@emotion/styled';

// 공통 색상 정의
export const COLORS = {
  primary: '#00C49F',
  primaryHover: '#00A67E',
  warning: '#FF0000',
  warningBg: '#fff3f3',
  text: {
    primary: '#222',
    secondary: '#666',
    subtle: '#888',
  },
  background: {
    light: '#f5f6fa',
    white: '#ffffff',
  }
};

// 공통 스타일 믹스인
export const flexCenter = `
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const cardStyle = `
  border-radius: 10px;
  background-color: ${COLORS.background.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// 기본 레이아웃 컴포넌트
export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  text-align: center;
  color: ${COLORS.text.primary};
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
`;

export const SubTitle = styled.p`
  text-align: center;
  color: ${COLORS.text.subtle};
  font-size: 1.15rem;
  margin-bottom: 2.5rem;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${COLORS.background.light};
  margin-bottom: 1rem;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

export const WarningContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff3f3;
  border-left: 6px solid #f44336;
  border-radius: 14px;
  box-shadow: 0 2px 8px 0 rgba(244, 67, 54, 0.07);
  padding: 1.1rem 1.5rem;
  margin: 2rem auto 1.2rem auto;
  color: #d32f2f;
  font-size: 1.08rem;
  font-weight: 500;
  max-width: 520px;
  width: 100%;
  justify-content: center;
  word-break: keep-all;
  line-height: 1.6;
`;

export const WarningIcon = styled.span`
  font-size: 1.7rem;
  color: #f44336;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const Button = styled.button`
  background-color: ${COLORS.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  ${flexCenter}
  margin: 2rem auto 0;
  display: block;

  &:hover {
    background-color: ${COLORS.primaryHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TooltipContainer = styled.div`
  background: white;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  p {
    margin: 0.3rem 0;
    &.label {
      font-weight: bold;
      color: ${COLORS.text.primary};
    }
    &.value {
      color: ${COLORS.text.secondary};
    }
    &.percentage {
      color: #888;
      font-size: 0.9rem;
    }
  }
`;

export const ChartHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const ChartTitle = styled.h2`
  color: ${COLORS.text.primary};
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const ChartSubtitle = styled.p`
  color: ${COLORS.text.secondary};
  font-size: 1rem;
  margin: 0;
`;

export const CenteredButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -2.5rem 0 0 0;
`;

export const MainButton = styled.button`
  min-width: 240px;
  height: 56px;
  background: linear-gradient(90deg, #4caf50 0%, #43e97b 100%);
  color: #fff;
  border: none;
  border-radius: 30px;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7em;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;

  &:hover {
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.25);
    transform: translateY(-2px) scale(1.03);
  }
`;

export const AppBackground = styled.div`
  min-height: 100vh;
  background: #fff;
  width: 100vw;
`;

export const MainCard = styled.div`
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  padding: 3.5rem 3rem 2.5rem 3rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  box-sizing: border-box;
  @media (max-width: 900px) {
    padding: 2rem 0.5rem;
    gap: 1.5rem;
  }
`;

export const AnalysisSection = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: none;
  border-radius: 0;
  padding: 0;
`;

export const ChartCard = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 340px;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 12px 36px rgba(0,0,0,0.16);
    transform: translateY(-4px) scale(1.02);
  }
`;

export const Card = styled.div`
  background: #fcfcfe;
  border-radius: 24px;
  box-shadow: 0 6px 32px 0 rgba(80, 120, 200, 0.10);
  padding: 36px 32px 32px 32px;
  margin: 0 16px;
  min-width: 320px;
  max-width: 400px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 24px;
  text-align: center;
`;

interface NutrientValueProps {
  color?: string;
}

export const NutrientLabel = styled.span`
  font-size: 0.9rem;
  color: ${COLORS.text.secondary};
`;

export const NutrientValue = styled.span<NutrientValueProps>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ color }) => color || COLORS.text.primary};
`;

interface ProgressProps {
  color?: string;
  percent: number;
}

export const ProgressBar = styled.div`
  width: 100%;
  height: 16px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const Progress = styled.div<ProgressProps>`
  height: 100%;
  background-color: ${({ color }) => color || COLORS.primary};
  width: ${({ percent }) => percent}%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const CardGrid = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
`;
