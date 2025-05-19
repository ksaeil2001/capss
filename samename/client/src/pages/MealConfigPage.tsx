import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, X, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FoodCard from "@/components/recommend/FoodCard";
import useRecommendStore from "@/stores/useRecommendStore";
import useUserInfoStore from "@/stores/useUserInfoStore";
import { useMealPlanStore } from "@/stores/useMealPlanStore";
import NutritionVisualization from "@/components/recommend/NutritionVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedProgressBar from "@/components/ui/AnimatedProgressBar";
import StepNavigationBar from "@/components/ui/StepNavigationBar";

type MealSlot = "breakfast" | "lunch" | "dinner";

const MealConfigPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("meals");
  const { toast } = useToast();
  const { recommendation } = useRecommendStore();
  const { userInfo } = useUserInfoStore();
  // moveMeal 사용 안 하므로 구조분해에서 제외!
  const { meals, totals, addMeal, removeMeal } = useMealPlanStore();
  const mealSlots: MealSlot[] = ["breakfast", "lunch", "dinner"];

  useEffect(() => {
    console.log("MealConfigPage 마운트됨 또는 식단 상태 변경:", meals);
  }, [meals]);

  const activeMeals = userInfo.mealsPerDay || 3;

  const handleAddMeal = (slot: MealSlot) => {
    if (!recommendation) {
      toast({
        title: "추천 정보가 없습니다",
        description: "식단 추천 페이지로 이동합니다.",
        variant: "destructive",
      });
      navigate("/recommendations");
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

  const handleViewResults = () => {
    const hasEmptySlots = mealSlots.slice(0, activeMeals).some(slot => meals[slot].length === 0);

    if (hasEmptySlots) {
      toast({
        title: "빈 식단이 있습니다",
        description: "모든 끼니에 최소 하나의 음식을 추가해주세요.",
        variant: "destructive",
      });
    }

    navigate("/summary");
  };

  const targets = {
    calories: recommendation?.summary?.totalCalories || 2000,
    protein: recommendation?.summary?.totalProtein || 100,
    carbs: recommendation?.summary?.totalCarbs || 250,
    fat: recommendation?.summary?.totalFat || 70,
    budget: recommendation?.summary?.totalBudget || 20000,
  };

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 pt-6">
        <h1 className="text-3xl font-bold mb-8 text-foreground">식단 구성하기</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-grow">
            <Tabs
              defaultValue="meals"
              value={activeTab}
              onValueChange={setActiveTab}
              className="wellness-card w-full mb-6"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-xl p-1">
                <TabsTrigger value="meals" className="flex items-center rounded-lg text-sm">
                  <Plus size={16} className="mr-2" />
                  식단 구성
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="flex items-center rounded-lg text-sm">
                  <BarChart size={16} className="mr-2" />
                  영양소 분석
                </TabsTrigger>
              </TabsList>

              <TabsContent value="meals">
                <div className="space-y-8">
                  {mealSlots.slice(0, activeMeals).map(slot => (
                    <div key={slot} className="meal-slot p-6 rounded-xl border shadow-md">
                      <h2 className="text-xl font-semibold mb-4 capitalize text-foreground">
                        {slot === "breakfast" ? "아침" : slot === "lunch" ? "점심" : "저녁"}
                      </h2>
                      {meals[slot].length === 0 ? (
                        <div
                          className="flex items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer"
                          onClick={() => handleAddMeal(slot)}
                        >
                          <div className="text-center">
                            <Plus size={30} className="mx-auto mb-2" />
                            <p className="text-muted-foreground">음식 추가하기</p>
                          </div>
                        </div>
                      ) : (
                        meals[slot].map((meal, index) => (
                          <div key={`${slot}-${index}`} className="relative">
                            <button
                              className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full"
                              onClick={() => handleRemoveMeal(slot, index)}
                            >
                              <X size={16} />
                            </button>
                            <FoodCard
                              meal={meal}
                              onSelect={selectedMeal => addMeal(slot, selectedMeal)}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="nutrition">
                <NutritionVisualization
                  summary={{
                    totalCalories: targets.calories,
                    totalProtein: targets.protein,
                    totalCarbs: targets.carbs,
                    totalFat: targets.fat,
                    totalBudget: targets.budget,
                    nutritionAnalysis: "",
                    recommendations: [],
                  }}
                  selectedMeals={Object.values(meals).flat()}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:w-80 flex-shrink-0">
            <div className="wellness-card sticky top-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground">영양 요약</h2>
              <AnimatedProgressBar
                value={totals.budget}
                max={targets.budget}
                type="calories"
                label="예산(원)"
                unit="원"
              />
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
              <AnimatedProgressBar value={totals.fat} max={targets.fat} type="fat" label="지방" />
            </div>
          </div>
        </div>
      </div>

      <StepNavigationBar currentStep={3} onNext={handleViewResults} nextButtonText="결과 확인" />
    </main>
  );
};

export default MealConfigPage;
