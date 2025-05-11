import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Info, Plus, X, BarChart } from 'lucide-react';
import { Meal } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import FoodCard from '@/components/recommend/FoodCard';
import useRecommendStore from '@/stores/useRecommendStore';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useMealPlanStore } from '@/stores/useMealPlanStore';
import NutritionVisualization from '@/components/recommend/NutritionVisualization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedProgressBar from '@/components/ui/AnimatedProgressBar';
import StepNavigationBar from '@/components/ui/StepNavigationBar';

type MealSlot = 'breakfast' | 'lunch' | 'dinner';

const MealConfigPage: React.FC = () => {
    const [, navigate] = useLocation();
    const [activeTab, setActiveTab] = useState('meals');
    const { toast } = useToast();
    const { recommendation } = useRecommendStore();
    const { userInfo } = useUserInfoStore();

    const { meals, totals, addMeal, removeMeal, moveMeal, resetMeals } =
        useMealPlanStore();

    const mealSlots: MealSlot[] = ['breakfast', 'lunch', 'dinner'];

    useEffect(() => {
        console.log('MealConfigPage 마운트됨 또는 식단 상태 변경:', meals);
        console.log('breakfast:', meals.breakfast.length, '개 항목');
        console.log('lunch:', meals.lunch.length, '개 항목');
        console.log('dinner:', meals.dinner.length, '개 항목');
    }, [meals]);

    const activeMeals = userInfo.mealsPerDay || 3;

    const handleAddMeal = (slot: MealSlot) => {
        if (!recommendation) {
            toast({
                title: '추천 정보가 없습니다',
                description: '식단 추천 페이지로 이동합니다.',
                variant: 'destructive',
            });
            navigate('/recommendations');
            return;
        }

        if (recommendation.meals.length > 0) {
            const recommendedMeal = recommendation.meals[0];
            addMeal(slot, recommendedMeal);
        }
    };

    const handleRemoveMeal = (slot: MealSlot, index: number) => {
        removeMeal(slot, index);
    };

    const handleMoveMeal = (
        fromSlot: MealSlot,
        fromIndex: number,
        toSlot: MealSlot,
        toIndex: number
    ) => {
        moveMeal(fromSlot, fromIndex, toSlot, toIndex);
    };

    const handleSelectMeal = (meal: Meal, slot: MealSlot) => {
        addMeal(slot, meal);
    };

    const handleViewResults = () => {
        const hasEmptyActiveSlots = mealSlots
            .slice(0, activeMeals)
            .some((slot) => meals[slot].length === 0);

        if (hasEmptyActiveSlots) {
            toast({
                title: '빈 식단이 있습니다',
                description: '모든 끼니에 최소 하나의 음식을 추가해주세요.',
                variant: 'destructive',
            });
            return;
        }

        const summary = recommendation?.summary;
        if (summary) {
            const calorieRatio = totals.calories / summary.totalCalories;
            if (calorieRatio < 0.9 || calorieRatio > 1.1) {
                toast({
                    title: '칼로리 균형이 맞지 않습니다',
                    description:
                        '목표 칼로리의 90~110% 범위로 구성하는 것이 좋습니다.',
                    variant: 'destructive',
                });
                // return;
                // return 제거 → 경고는 뜨되 이동은 진행
            }

            if (totals.protein < summary.totalProtein * 0.8) {
                toast({
                    title: '단백질이 부족합니다',
                    description:
                        '단백질이 목표치의 80% 이상이 되도록 구성해주세요.',
                    variant: 'destructive',
                });
                // return;
                // return 제거 → 경고는 뜨되 이동은 진행
            }
        }

        navigate('/summary');
    };

    const targets = {
        calories: recommendation?.summary?.totalCalories || 2000,
        protein: recommendation?.summary?.totalProtein || 100,
        carbs: recommendation?.summary?.totalCarbs || 250,
        fat: recommendation?.summary?.totalFat || 70,
        budget: recommendation?.summary?.totalBudget || 20000,
    };

    const progress = {
        calories: Math.min(100, (totals.calories / targets.calories) * 100),
        protein: Math.min(100, (totals.protein / targets.protein) * 100),
        carbs: Math.min(100, (totals.carbs / targets.carbs) * 100),
        fat: Math.min(100, (totals.fat / targets.fat) * 100),
        budget: Math.min(100, (totals.budget / targets.budget) * 100),
    };

    return (
        <main className="min-h-screen pb-24 wellness-gradient-bg">
            <div className="container mx-auto max-w-7xl px-4 pt-6">
                <h1 className="text-3xl font-bold mb-8 text-foreground">
                    식단 구성하기
                </h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-grow">
                        <Tabs
                            defaultValue="meals"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="wellness-card w-full mb-6"
                        >
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-xl p-1">
                                <TabsTrigger
                                    value="meals"
                                    className="flex items-center rounded-lg text-sm"
                                >
                                    <Plus size={16} className="mr-2" />
                                    식단 구성
                                </TabsTrigger>
                                <TabsTrigger
                                    value="nutrition"
                                    className="flex items-center rounded-lg text-sm"
                                >
                                    <BarChart size={16} className="mr-2" />
                                    영양소 분석
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="meals">
                                <div className="space-y-8">
                                    {mealSlots
                                        .slice(0, activeMeals)
                                        .map((slot) => {
                                            const slotStyle =
                                                slot === 'breakfast'
                                                    ? 'bg-secondary/30 border-secondary/40'
                                                    : slot === 'lunch'
                                                    ? 'bg-accent/40 border-primary/20'
                                                    : 'bg-tertiary/30 border-tertiary/40';

                                            return (
                                                <div
                                                    key={slot}
                                                    className={`meal-slot p-6 rounded-xl ${slotStyle} border shadow-[0_3px_8px_-4px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset]`}
                                                >
                                                    <h2 className="text-xl font-semibold mb-4 capitalize text-foreground">
                                                        {slot === 'breakfast'
                                                            ? '아침'
                                                            : slot === 'lunch'
                                                            ? '점심'
                                                            : '저녁'}
                                                    </h2>

                                                    {meals[slot].length ===
                                                    0 ? (
                                                        <div
                                                            className="flex items-center justify-center h-40 border-2 border-dashed border-border/40 rounded-xl cursor-pointer bg-white/30 hover:bg-white/60 transition-all duration-150"
                                                            onClick={() =>
                                                                handleAddMeal(
                                                                    slot
                                                                )
                                                            }
                                                        >
                                                            <div className="text-center">
                                                                <Plus
                                                                    size={30}
                                                                    className="mx-auto text-primary/70 mb-2"
                                                                />
                                                                <p className="text-muted-foreground">
                                                                    음식
                                                                    추가하기
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {meals[slot].map(
                                                                (
                                                                    meal: Meal,
                                                                    index: number
                                                                ) => (
                                                                    <div
                                                                        key={`${slot}-${index}`}
                                                                        className="relative"
                                                                    >
                                                                        <button
                                                                            className="absolute top-2 right-2 z-10 bg-white/80 text-red-500 p-1.5 rounded-full hover:bg-red-50 hover:scale-105 transition-all duration-150 shadow-sm"
                                                                            onClick={() =>
                                                                                handleRemoveMeal(
                                                                                    slot,
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            <X
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>

                                                                        <FoodCard
                                                                            meal={
                                                                                meal
                                                                            }
                                                                            onSelect={(
                                                                                meal
                                                                            ) =>
                                                                                handleSelectMeal(
                                                                                    meal,
                                                                                    slot
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                )
                                                            )}

                                                            <div
                                                                className="flex items-center justify-center h-14 border-2 border-dashed border-border/40 rounded-xl cursor-pointer bg-white/30 hover:bg-white/60 transition-all duration-150"
                                                                onClick={() =>
                                                                    handleAddMeal(
                                                                        slot
                                                                    )
                                                                }
                                                            >
                                                                <Plus
                                                                    size={20}
                                                                    className="text-primary/70 mr-2"
                                                                />
                                                                <span className="text-muted-foreground text-sm">
                                                                    더 추가하기
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </TabsContent>

                            <TabsContent value="nutrition">
                                {Object.values(meals).some(
                                    (mealList) => mealList.length > 0
                                ) ? (
                                    <NutritionVisualization
                                        summary={{
                                            totalCalories: targets.calories,
                                            totalProtein: targets.protein,
                                            totalCarbs: targets.carbs,
                                            totalFat: targets.fat,
                                            totalBudget: targets.budget,
                                            nutritionAnalysis: '',
                                            recommendations: [],
                                        }}
                                        selectedMeals={Object.values(
                                            meals
                                        ).flat()}
                                    />
                                ) : (
                                    <div className="wellness-card flex items-center justify-center h-64">
                                        <div className="text-center">
                                            <p className="text-lg text-muted-foreground mb-4">
                                                식단을 추가하면 영양소 분석이
                                                표시됩니다
                                            </p>
                                            <button
                                                className="px-4 py-2 bg-primary text-white rounded-xl shadow-[0_3px_6px_-3px_rgba(0,0,0,0.15),0_-1px_2px_-1px_rgba(255,255,255,0.3)_inset] hover:brightness-105 hover:scale-[1.02] transition-all duration-150 ease-out"
                                                onClick={() =>
                                                    setActiveTab('meals')
                                                }
                                            >
                                                식단 구성하기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:w-80 flex-shrink-0">
                        <div className="wellness-card sticky top-6">
                            <h2 className="text-xl font-semibold mb-6 text-foreground">
                                영양 요약
                            </h2>

                            <div className="mb-8">
                                <AnimatedProgressBar
                                    value={totals.budget}
                                    max={targets.budget}
                                    type="calories"
                                    label="예산(원)"
                                    unit="원" // ← 새로 추가
                                />
                            </div>

                            <div className="space-y-6">
                                <AnimatedProgressBar
                                    value={totals.calories}
                                    max={targets.calories}
                                    type="calories"
                                    label="칼로리"
                                />

                                <AnimatedProgressBar
                                    value={totals.protein}
                                    max={targets.protein}
                                    type="protein"
                                    label="단백질"
                                />

                                <AnimatedProgressBar
                                    value={totals.carbs}
                                    max={targets.carbs}
                                    type="carbs"
                                    label="탄수화물"
                                />

                                <AnimatedProgressBar
                                    value={totals.fat}
                                    max={targets.fat}
                                    type="fat"
                                    label="지방"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StepNavigationBar
                currentStep={3}
                onNext={handleViewResults}
                nextButtonText="결과 확인"
            />
        </main>
    );
};

export default MealConfigPage;
