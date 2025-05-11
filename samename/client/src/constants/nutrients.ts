export interface NutrientName {
  key: string;
  label: string;
  unit: string;
}

export const nutrientNames: NutrientName[] = [
  { key: 'calories', label: '칼로리', unit: 'kcal' },
  { key: 'protein', label: '단백질', unit: 'g' },
  { key: 'fat', label: '지방', unit: 'g' },
  { key: 'carbs', label: '탄수화물', unit: 'g' },
  { key: 'budget', label: '예산', unit: '원' },
];
