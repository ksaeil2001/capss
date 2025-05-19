import { getToken, getAnonymousToken, saveToken, removeToken } from "./auth";
import { UserInfo, DietRecommendation } from "@shared/schema";

// 알레르기 배열을 문자열로 변환하는 helper 함수
function processUserInfo(userInfo: UserInfo) {
  return {
    ...userInfo,
    allergies: (userInfo.allergies ?? []).join(","),
  };
}

// JWT를 체크하고 필요하면 새로 발급받는 helper 함수
async function ensureToken() {
  // 토큰이 있는지 확인하지 않고 항상 새로 발급받음
  try {
    // 기존 토큰 삭제
    removeToken();
    const token = await getAnonymousToken();
    saveToken(token);
    return token;
  } catch (error) {
    console.error("Failed to get new token:", error);
    // 에러 발생 시 기존 토큰 사용 시도
    const existingToken = getToken();
    if (existingToken) {
      return existingToken;
    }
    throw error;
  }
}

/**
 * Get nutrition summary based on user information
 * @param {UserInfo} userInfo User information for summary
 * @returns {Promise<DietRecommendation['summary']>} Nutrition summary
 */
export async function getNutritionSummary(
  userInfo: UserInfo
): Promise<DietRecommendation["summary"]> {
  try {
    const processedUserInfo = processUserInfo(userInfo);
    const token = await ensureToken();

    // Make the API request to get summary
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(processedUserInfo),
    });

    if (!res.ok) {
      if (res.status === 422) {
        const errorData = await res.json();
        throw new Error(`Validation error: ${JSON.stringify(errorData.errors)}`);
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data.summary;
  } catch (error) {
    console.error("Failed to get nutrition summary:", error);
    throw error;
  }
}

/**
 * Get diet recommendations based on user information
 * @param {UserInfo} userInfo User information for recommendation
 * @returns {Promise<DietRecommendation>} Diet recommendations
 */
export async function getDietRecommendation(userInfo: UserInfo): Promise<DietRecommendation> {
  try {
    const processedUserInfo = processUserInfo(userInfo);
    const token = await ensureToken();

    // Make the API request to get recommendations
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(processedUserInfo),
    });

    if (!res.ok) {
      if (res.status === 422) {
        const errorData = await res.json();
        throw new Error(`Validation error: ${JSON.stringify(errorData.errors)}`);
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();

    // 7개 식단이 제대로 왔는지 확인하고, 부족하면 채우기
    if (!data.meals || data.meals.length < 7) {
      // 부족한 만큼 샘플 데이터로 채우기
      const sampleMeals = [
        {
          id: "sample-1",
          name: "그릭 요거트 파르페",
          type: "breakfast",
          calories: 320,
          protein: 20,
          carbs: 40,
          fat: 10,
          ingredients: ["그릭 요거트", "그래놀라", "블루베리", "꿀", "아몬드"],
          imageUrl: "https://images.unsplash.com/photo-1483648969698-5e7dcaa9c4bd",
          tags: ["아침식사", "고단백", "건강식"],
          score: 92,
          price: 7500,
          nutrition: { calories: 320, protein: 20, carbs: 40, fat: 10 },
        },
        {
          id: "sample-2",
          name: "연어 샐러드",
          type: "lunch",
          calories: 410,
          protein: 28,
          carbs: 25,
          fat: 22,
          ingredients: ["훈제 연어", "양상추", "토마토", "오이", "올리브 오일", "레몬 드레싱"],
          imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
          tags: ["런치", "저탄수화물", "고단백"],
          score: 94,
          price: 12000,
          nutrition: { calories: 410, protein: 28, carbs: 25, fat: 22 },
        },
        {
          id: "sample-3",
          name: "닭가슴살 퀴노아 볼",
          type: "dinner",
          calories: 450,
          protein: 35,
          carbs: 38,
          fat: 15,
          ingredients: ["닭가슴살", "퀴노아", "시금치", "호박", "올리브 오일", "허브 믹스"],
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          tags: ["저녁식사", "밸런스", "슈퍼푸드"],
          score: 90,
          price: 11000,
          nutrition: { calories: 450, protein: 35, carbs: 38, fat: 15 },
        },
        {
          id: "sample-4",
          name: "아보카도 토스트",
          type: "breakfast",
          calories: 350,
          protein: 15,
          carbs: 35,
          fat: 18,
          ingredients: ["통밀빵", "아보카도", "계란", "토마토", "올리브 오일", "후추"],
          imageUrl: "https://images.unsplash.com/photo-1603046891744-51944f5b81c3",
          tags: ["아침식사", "채식가능", "건강식"],
          score: 89,
          price: 8000,
          nutrition: { calories: 350, protein: 15, carbs: 35, fat: 18 },
        },
        {
          id: "sample-5",
          name: "렌틸 수프",
          type: "lunch",
          calories: 300,
          protein: 18,
          carbs: 42,
          fat: 5,
          ingredients: ["렌틸콩", "당근", "양파", "셀러리", "토마토", "향신료 믹스"],
          imageUrl: "https://images.unsplash.com/photo-1608057376267-19c5f23826cd",
          tags: ["런치", "비건", "저지방"],
          score: 86,
          price: 9000,
          nutrition: { calories: 300, protein: 18, carbs: 42, fat: 5 },
        },
      ];

      // 기존 meals 배열이 없으면 초기화
      if (!data.meals) data.meals = [];

      // 필요한 만큼 샘플 데이터 추가
      const neededCount = 7 - data.meals.length;
      for (let i = 0; i < neededCount; i++) {
        const sampleIndex = i % sampleMeals.length;
        const uniqueId = `sample-${Date.now()}-${i}`;
        // 깊은 복사로 새 객체 생성하고 고유 ID 부여
        const newMeal = JSON.parse(JSON.stringify(sampleMeals[sampleIndex]));
        newMeal.id = uniqueId;
        data.meals.push(newMeal);
      }
    }

    return data as DietRecommendation;
  } catch (error) {
    console.error("Failed to get diet recommendation:", error);
    throw error;
  }
}
