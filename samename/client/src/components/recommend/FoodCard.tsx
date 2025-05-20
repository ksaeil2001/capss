import React, { useState } from "react";
import { Meal } from "@shared/schema";
import { X, ShoppingBag, Info, Plus } from "lucide-react";

interface FoodDetailProps {
  meal: Meal;
  onClose: () => void;
  onSelect: () => void;
}

const FoodDetail: React.FC<FoodDetailProps> = ({ meal, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative wellness-card max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={meal.imageUrl || "/placeholder-food.jpg"}
            alt={meal.name}
            className="w-full h-48 object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{meal.name}</h2>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap">
          {meal.tags?.map(tag => (
            <span key={tag} className="inline-block mr-2 mb-1 text-primary">
              #{tag}
            </span>
          )) || <span className="text-primary">#일반식 #건강식</span>}
        </div>

        {/* 음식 상세 설명 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">음식 설명</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {meal.description ||
              meal.recipe ||
              `${meal.name}은(는) 건강하고 맛있는 음식입니다. 영양소가 고루 배합되어 있어서 식사 대체나 건강 식단으로 적합합니다. 단백질, 탄수화물, 지방의 배합이 적절하여 식후 만족감을 주며 다양한 비타민과 미네랄을 포함하고 있습니다.`}
          </p>
        </div>

        {/* 영양소 반경 차트 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">영양소</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-3 rounded-xl shadow-[0_4px_8px_-4px_rgba(0,0,0,0.05),0_-1px_3px_-1px_rgba(255,255,255,0.6)_inset] bg-accent/30 text-center">
              <div className="text-xs text-primary/90 font-medium">칼로리</div>
              <div className="font-semibold">
                {meal.calories || meal.nutrition?.calories || 0}kcal
              </div>
            </div>
            <div className="p-3 rounded-xl shadow-[0_4px_8px_-4px_rgba(0,0,0,0.05),0_-1px_3px_-1px_rgba(255,255,255,0.6)_inset] bg-tertiary/30 text-center">
              <div className="text-xs text-tertiary-foreground font-medium">단백질</div>
              <div className="font-semibold">{meal.protein || meal.nutrition?.protein || 0}g</div>
            </div>
            <div className="p-3 rounded-xl shadow-[0_4px_8px_-4px_rgba(0,0,0,0.05),0_-1px_3px_-1px_rgba(255,255,255,0.6)_inset] bg-secondary/40 text-center">
              <div className="text-xs text-secondary-foreground font-medium">탄수화물</div>
              <div className="font-semibold">{meal.carbs || meal.nutrition?.carbs || 0}g</div>
            </div>
            <div className="p-3 rounded-xl shadow-[0_4px_8px_-4px_rgba(0,0,0,0.05),0_-1px_3px_-1px_rgba(255,255,255,0.6)_inset] bg-secondary/40 text-center">
              <div className="text-xs text-secondary-foreground font-medium">지방</div>
              <div className="font-semibold text-foreground">
                {meal.fat || meal.nutrition?.fat || 0}g
              </div>
            </div>
          </div>

          {/* 추가 영양소 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-2 rounded-xl shadow-[0_3px_6px_-3px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-muted">
              <div className="text-xs text-primary/80 font-medium">나트륨</div>
              <div className="text-sm font-medium">
                {meal.sodium || meal.nutrition?.sodium || 120}mg
              </div>
            </div>
            <div className="p-2 rounded-xl shadow-[0_3px_6px_-3px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-muted">
              <div className="text-xs text-primary/80 font-medium">당류</div>
              <div className="text-sm font-medium">{meal.sugar || meal.nutrition?.sugar || 5}g</div>
            </div>
            <div className="p-2 rounded-xl shadow-[0_3px_6px_-3px_rgba(0,0,0,0.05),0_-1px_2px_-1px_rgba(255,255,255,0.4)_inset] bg-muted">
              <div className="text-xs text-primary/80 font-medium">섬유</div>
              <div className="text-sm font-medium">{meal.fiber || meal.nutrition?.fiber || 3}g</div>
            </div>
          </div>
        </div>

        {/* 건강 혜택 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">건강 혜택</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>
                단백질 섭취량이 높아 근육 생성과 유지에 도움을 주는 것으로 알려져 있습니다.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>비타민과 미네랄을 포함하여 면역 시스템 강화에 도움을 줄 수 있습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>적당한 양의 건강한 지방을 함유하여 호르몬 균형 유지에 도움을 줍니다.</span>
            </li>
          </ul>
        </div>

        {/* 점수 및 추천 범위 */}
        <div className="mb-6 flex">
          <div className="flex-1 border-r pr-3">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">점수</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-primary">{meal.score || 85}</div>
              <div className="text-sm text-gray-500 ml-1">/100</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">개인화된 영양 기준 기반</p>
          </div>
          <div className="flex-1 pl-3">
            <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              추천 시간대
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <div>
                <span className="inline-block w-16 text-gray-500">아침</span>
                {meal.tags?.includes("아침") ? (
                  <span className="text-green-500 font-medium">추천</span>
                ) : (
                  <span className="text-gray-400">적합</span>
                )}
              </div>
              <div>
                <span className="inline-block w-16 text-gray-500">점심</span>
                {meal.tags?.includes("점심") || !meal.tags?.includes("아침") ? (
                  <span className="text-green-500 font-medium">추천</span>
                ) : (
                  <span className="text-gray-400">적합</span>
                )}
              </div>
              <div>
                <span className="inline-block w-16 text-gray-500">저녁</span>
                {meal.tags?.includes("저녁") || !meal.tags?.includes("아침") ? (
                  <span className="text-green-500 font-medium">추천</span>
                ) : (
                  <span className="text-gray-400">적합</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          className="w-full py-3 bg-primary text-white font-medium rounded-xl shadow-[0_4px_8px_-3px_rgba(0,0,0,0.15),0_-1px_3px_-1px_rgba(255,255,255,0.3)_inset] flex items-center justify-center space-x-2 hover:brightness-105 hover:scale-[1.01] transition-all duration-150 ease-out"
          onClick={onSelect}
        >
          <ShoppingBag size={18} />
          <span>담기</span>
        </button>
      </div>
    </div>
  );
};

interface FoodCardProps {
  meal: Meal;
  onSelect: (meal: Meal) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ meal, onSelect }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSelectMeal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // 이벤트 버블링 방지
    onSelect(meal);
    if (showPopup) setShowPopup(false);
  };

  return (
    <>
      <div className="food-card wellness-card flex flex-col md:flex-row md:h-44 w-full">
        <div className="relative rounded-lg overflow-hidden mb-3 md:mb-0 md:w-44 md:min-w-44 md:mr-5 flex-shrink-0">
          <img
            src={meal.imageUrl || "/placeholder-food.jpg"}
            alt={meal.name}
            className="w-full h-36 md:h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium">
            {meal.score || 85}점
          </div>
        </div>

        <div className="flex flex-col justify-between flex-grow overflow-hidden">
          <div>
            <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-gray-100 overflow-hidden text-ellipsis whitespace-nowrap">
              {meal.name}
            </h3>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex flex-wrap">
              {meal.tags?.map(tag => (
                <span key={tag} className="inline-block mr-1 mb-1 text-primary">
                  #{tag}
                </span>
              )) || <span className="text-primary">#일반식 #건강식</span>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mt-auto">
            <div className="hidden md:flex mb-2 md:mb-0 md:mr-auto flex-wrap w-full max-w-md">
              <div className="text-xs font-semibold mr-4 mb-1">
                <span className="text-blue-500">칼로리:</span> {meal.calories}kcal
              </div>
              <div className="text-xs font-semibold mr-4 mb-1">
                <span className="text-red-500">단백질:</span> {meal.protein}g
              </div>
              <div className="text-xs font-semibold mr-4 mb-1">
                <span className="text-amber-500">탄수화물:</span> {meal.carbs}g
              </div>
              <div className="text-xs font-semibold mr-4">
                <span className="text-green-500">지방:</span> {meal.fat || 0}g
              </div>
            </div>

            <div className="flex space-x-2 mt-2 md:mt-0 md:flex-shrink-0">
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-border/30 bg-white dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100 shadow-[0_3px_6px_-3px_rgba(0,0,0,0.07),0_-1px_2px_-1px_rgba(255,255,255,0.6)_inset] hover:brightness-105 hover:scale-[1.02] transition-all duration-150 ease-out flex items-center space-x-1"
                onClick={handleDetailClick}
              >
                <Info size={14} className="text-primary/80" />
                <span>상세 보기</span>
              </button>

              <button
                className="px-3 py-1.5 text-xs font-medium rounded-xl bg-primary text-white shadow-[0_3px_6px_-3px_rgba(0,0,0,0.15),0_-1px_2px_-1px_rgba(255,255,255,0.3)_inset] hover:brightness-105 hover:scale-[1.02] transition-all duration-150 ease-out flex items-center space-x-1"
                onClick={handleSelectMeal}
              >
                <Plus size={14} />
                <span>바로 담기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <FoodDetail meal={meal} onClose={handleClosePopup} onSelect={handleSelectMeal} />
      )}
    </>
  );
};

export default FoodCard;
