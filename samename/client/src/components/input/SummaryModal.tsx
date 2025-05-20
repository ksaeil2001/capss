import React from "react";
import { DietRecommendation } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Wallet,
  ChefHat,
  Medal,
  LineChart,
  ShieldCheck,
  Dumbbell,
  Salad,
  Sparkles,
} from "lucide-react";

interface SummaryModalProps {
  isVisible: boolean;
  summary: DietRecommendation["summary"] | null;
  onContinue: () => void;
}

/**
 * Modal component for showing nutrition summary before proceeding to recommendations
 */
const SummaryModal: React.FC<SummaryModalProps> = ({ isVisible, summary, onContinue }) => {
  if (!isVisible || !summary) return null;

  // 영양소 분포 계산
  const proteinPercentage = Math.round(((summary.totalProtein * 4) / summary.totalCalories) * 100);
  const carbsPercentage = Math.round(((summary.totalCarbs * 4) / summary.totalCalories) * 100);
  const fatPercentage = Math.round(((summary.totalFat * 9) / summary.totalCalories) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => {}} />

      {/* Modal content */}
      <div className="relative bg-gradient-to-br from-card/95 to-card/90 rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/10 backdrop-blur-md flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-t-lg"></div>

        {/* Modal header */}
        <div className="p-6 border-b border-border/20">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-foreground flex items-center">
              <ChefHat className="w-6 h-6 mr-2 text-purple-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                영양 요약 정보
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">
                미리보기
              </span>
            </h3>
            <div className="flex items-center space-x-1">
              <Medal className="h-5 w-5 text-amber-400" />
              <Sparkles className="h-4 w-4 text-amber-200" />
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {/* 칼로리 & 예산 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/40 to-blue-100/20 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10"></div>
              <div className="relative z-10 w-full">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1 block">
                  칼로리
                </span>
                <span className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                  {summary.totalCalories}
                </span>
                <span className="text-xs text-blue-600/70 dark:text-blue-500/70">kcal/일</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/40 to-emerald-100/20 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/30 dark:border-emerald-800/30 backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10"></div>
              <div className="relative z-10 w-full">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1 block">
                  예산
                </span>
                <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  ₩{summary.totalBudget.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600/70 dark:text-emerald-500/70">원/일</span>
              </div>
            </div>
          </div>

          {/* 체지방률 & 제지방량 정보 */}
          {summary.bodyFatPercentage !== undefined && summary.leanBodyMass !== undefined && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/40 to-amber-100/20 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200/30 dark:border-amber-800/30 backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-amber-500/5 dark:bg-amber-500/10"></div>
                <div className="relative z-10 w-full">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center">
                    <LineChart className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1 block">
                    체지방률
                  </span>
                  <span className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                    {summary.bodyFatPercentage}%
                  </span>
                  <span className="text-xs text-amber-600/70 dark:text-amber-500/70">
                    {summary.bmi !== undefined && `BMI ${summary.bmi}`}
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50/40 to-rose-100/20 dark:from-rose-950/20 dark:to-rose-900/10 border border-rose-200/30 dark:border-rose-800/30 backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/10"></div>
                <div className="relative z-10 w-full">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-xs font-medium text-rose-700 dark:text-rose-400 mb-1 block">
                    제지방량
                  </span>
                  <span className="text-2xl font-bold text-rose-800 dark:text-rose-300">
                    {summary.leanBodyMass}
                  </span>
                  <span className="text-xs text-rose-600/70 dark:text-rose-500/70">kg</span>
                </div>
              </div>
            </div>
          )}

          {/* 기초대사량 & 에너지 소모량 정보 */}
          {summary.bmr !== undefined && summary.tdee !== undefined && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50/40 to-violet-100/20 dark:from-violet-950/20 dark:to-violet-900/10 border border-violet-200/30 dark:border-violet-800/30 backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-violet-500/5 dark:bg-violet-500/10"></div>
                <div className="relative z-10 w-full">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-violet-100 dark:bg-violet-900/60 flex items-center justify-center">
                    <LineChart className="w-4 h-4 text-violet-500" />
                  </div>
                  <span className="text-xs font-medium text-violet-700 dark:text-violet-400 mb-1 block">
                    기초대사량{" "}
                    <span className="inline-block text-[9px] px-1.5 py-0.5 bg-violet-100 dark:bg-violet-800/40 text-violet-600 dark:text-violet-300 rounded-full">
                      Katch-McArdle
                    </span>
                  </span>
                  <span className="text-2xl font-bold text-violet-800 dark:text-violet-300">
                    {summary.bmr}
                  </span>
                  <span className="text-xs text-violet-600/70 dark:text-violet-500/70">kcal</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50/40 to-cyan-100/20 dark:from-cyan-950/20 dark:to-cyan-900/10 border border-cyan-200/30 dark:border-cyan-800/30 backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-cyan-500/5 dark:bg-cyan-500/10"></div>
                <div className="relative z-10 w-full">
                  <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-cyan-100 dark:bg-cyan-900/60 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-cyan-500" />
                  </div>
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 mb-1 block">
                    일일 에너지 소모량
                  </span>
                  <span className="text-2xl font-bold text-cyan-800 dark:text-cyan-300">
                    {summary.tdee}
                  </span>
                  <span className="text-xs text-cyan-600/70 dark:text-cyan-500/70">kcal</span>
                </div>
              </div>
            </div>
          )}

          {/* 영양소 분포 */}
          <div className="mb-6 space-y-3 p-4 rounded-xl bg-gradient-to-br from-purple-50/40 to-purple-100/20 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200/30 dark:border-purple-800/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-purple-500/5 dark:bg-purple-500/10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 mr-2 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center">
                  <LineChart className="w-3 h-3 text-purple-500" />
                </div>
                <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  영양소 분포
                </h4>
              </div>

              <div className="p-3 rounded-lg border border-purple-100/50 dark:border-purple-700/30 bg-white/70 dark:bg-black/20 mb-3">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium flex items-center">
                    <Dumbbell className="h-3 w-3 text-blue-500 mr-1 flex-shrink-0" />
                    단백질
                  </span>
                  <span className="text-blue-700/80 dark:text-blue-400/80 font-semibold">
                    {summary.totalProtein}g ({proteinPercentage}%)
                  </span>
                </div>
                <Progress
                  value={proteinPercentage}
                  className="h-2 bg-blue-100/50 dark:bg-blue-900/30 progress-protein"
                />
              </div>

              <div className="p-3 rounded-lg border border-purple-100/50 dark:border-purple-700/30 bg-white/70 dark:bg-black/20 mb-3">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium flex items-center">
                    <Salad className="h-3 w-3 text-amber-500 mr-1 flex-shrink-0" />
                    탄수화물
                  </span>
                  <span className="text-amber-700/80 dark:text-amber-400/80 font-semibold">
                    {summary.totalCarbs}g ({carbsPercentage}%)
                  </span>
                </div>
                <Progress
                  value={carbsPercentage}
                  className="h-2 bg-amber-100/50 dark:bg-amber-900/30 progress-carbs"
                />
              </div>

              <div className="p-3 rounded-lg border border-purple-100/50 dark:border-purple-700/30 bg-white/70 dark:bg-black/20">
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium flex items-center">
                    <Flame className="h-3 w-3 text-rose-500 mr-1 flex-shrink-0" />
                    지방
                  </span>
                  <span className="text-rose-700/80 dark:text-rose-400/80 font-semibold">
                    {summary.totalFat}g ({fatPercentage}%)
                  </span>
                </div>
                <Progress
                  value={fatPercentage}
                  className="h-2 bg-rose-100/50 dark:bg-rose-900/30 progress-fat"
                />
              </div>
            </div>
          </div>

          {/* 영양 분석 */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50/40 to-indigo-100/20 dark:from-indigo-950/20 dark:to-indigo-900/10 border border-indigo-200/30 dark:border-indigo-800/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 mr-2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center">
                  <ShieldCheck className="w-3 h-3 text-indigo-500" />
                </div>
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                  영양 분석
                </h4>
              </div>
              <div className="p-3 rounded-lg border border-indigo-100/50 dark:border-indigo-700/30 bg-white/70 dark:bg-black/20">
                <p className="text-sm text-indigo-700/80 dark:text-indigo-300/90 leading-relaxed">
                  {summary.nutritionAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* 추천 사항 */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-green-50/40 to-green-100/20 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/30 dark:border-green-800/30 backdrop-blur-sm relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-green-500/5 dark:bg-green-500/10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 mr-2 rounded-full bg-green-100 dark:bg-green-900/60 flex items-center justify-center">
                  <Medal className="w-3 h-3 text-green-500" />
                </div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                  추천 사항
                </h4>
              </div>
              <div className="p-3 rounded-lg border border-green-100/50 dark:border-green-700/30 bg-white/70 dark:bg-black/20">
                <ul className="space-y-2">
                  {summary.recommendations.map((recommendation, idx) => (
                    <li key={idx} className="flex text-sm group">
                      <div className="bg-green-100 dark:bg-green-800/30 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-700/30 transition-colors">
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-green-700 dark:text-green-300/90">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onContinue}
              className="relative overflow-hidden flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
              aria-label="확인하고 식단 추천 받기"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 group-hover:opacity-40 blur-md transition-opacity"></div>
              <span className="relative z-10 flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-purple-100" />
                <span>확인하고 식단 추천 받기</span>
              </span>
              <ArrowUpRight className="relative z-10 h-4 w-4 text-purple-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
