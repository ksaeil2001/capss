import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import useRecommendStore from "@/stores/useRecommendStore";
import useSelectedMealsStore from "@/stores/useSelectedMealsStore";
import { Meal } from "@shared/schema";
import FoodCard from "@/components/recommend/FoodCard";
import LeftBox from "@/components/recommend/LeftBox";
import RightInfoBox from "@/components/recommend/RightInfoBox";
import LoadingOverlay from "@/components/input/LoadingOverlay";
import NutritionVisualization from "@/components/recommend/NutritionVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StepNavigationBar from "@/components/ui/StepNavigationBar";

/**
 * Page to display diet recommendations based on user input
 */
const RecommendPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("foods");

  // Zustand 스토어에서 상태 및 액션 가져오기
  const { recommendation, isLoading } = useRecommendStore(); // ✅ refreshMeals 제거
  const { selectedMeals, selectMeal, removeMeal } = useSelectedMealsStore();

  useEffect(() => {
    if (!recommendation && !isLoading) {
      navigate("/");
    }

    const selectedMealsStore = useSelectedMealsStore.getState();
    if (!selectedMealsStore.isInitialized) {
      selectedMealsStore.initialize();
    }
  }, [recommendation, isLoading, navigate]);

  const handleNext = () => {
    const hasAnyMealSelected = selectedMeals.some(meal => meal !== null);

    if (!hasAnyMealSelected) {
      alert("적어도 하나의 식단을 선택해주세요.");
      return;
    }

    useSelectedMealsStore.getState().transferToMealPlan();
    navigate("/configure");
  };

  const handleSelectMeal = (meal: Meal) => {
    selectMeal(meal);
  };

  const handleRemoveMeal = (index: number) => {
    removeMeal(index);
  };

  if (isLoading && (!recommendation || !recommendation.meals.length)) {
    return <LoadingOverlay isVisible={true} message="추천 식단을 가져오는 중입니다" />;
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-lg mb-4">추천 정보를 불러올 수 없습니다.</p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => navigate("/")}
          >
            입력 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20 pt-6 bg-[#f9faf9] dark:bg-[#0d0d0d] text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">추천 식단</h1>
          <p className="text-gray-700 dark:text-muted-foreground">
            당신의 목표에 맞는 식단을 선택해 보세요
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 좌측 패널 */}
          <div className="w-full md:w-1/4 bg-white dark:bg-[#181818] rounded-xl p-4 shadow max-h-[520px] overflow-y-auto">
            <LeftBox selectedMeals={selectedMeals} onRemove={handleRemoveMeal} />
          </div>

          {/* 중앙 영역 */}
          <div className="w-full md:w-2/4 bg-white dark:bg-[#1e1e1e] rounded-xl p-4 shadow">
            <Tabs defaultValue="foods" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-xl p-1">
                <TabsTrigger value="foods" className="rounded-lg text-sm">
                  추천 식단
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="rounded-lg text-sm">
                  영양소 분석
                </TabsTrigger>
              </TabsList>
              <TabsContent value="foods">
                <div className="flex flex-col space-y-4">
                  {recommendation.meals.map(meal => (
                    <FoodCard key={meal.id} meal={meal} onSelect={handleSelectMeal} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="nutrition">
                {selectedMeals.some(meal => meal !== null) ? (
                  <NutritionVisualization
                    summary={recommendation.summary}
                    selectedMeals={selectedMeals}
                  />
                ) : (
                  <div className="wellness-card flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-lg text-muted-foreground mb-4">
                        식단을 선택하면 영양소 분석이 표시됩니다
                      </p>
                      <button
                        className="px-4 py-2 bg-primary text-white rounded-xl shadow hover:brightness-105 hover:scale-[1.02] transition-all duration-150 ease-out"
                        onClick={() => setActiveTab("foods")}
                      >
                        식단 선택하기
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* 우측 패널 */}
          <div className="w-full md:w-1/4 bg-white dark:bg-[#252525] rounded-xl p-4 shadow max-h-[550px] overflow-y-auto">
            <RightInfoBox summary={recommendation?.summary} selectedMeals={selectedMeals} />
          </div>
        </div>
      </div>

      <StepNavigationBar currentStep={2} onNext={handleNext} nextButtonText="다음" />
      <LoadingOverlay isVisible={isLoading && recommendation?.meals.length > 0} />
    </main>
  );
};

export default RecommendPage;
