export function calculatePercentage(current: number, target: number): number {
  return target === 0 ? 0 : (current / target) * 100;
}

export function getNutrientColor(key: string): string {
  const colors: Record<string, string> = {
    calories: '#ffb347',
    protein: '#87ceeb',
    fat: '#ff7f7f',
    carbs: '#f9c74f',
    budget: '#90be6d',
  };
  return colors[key] || '#ccc';
}
