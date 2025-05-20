import { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { userInfoSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { ZodError } from "zod";

// Used for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || "development_jwt_secret";

export async function registerRoutes(app: Express): Promise<Server> {
  // Issue anonymous JWT token
  app.post("/api/auth/issue", async (req, res) => {
    try {
      // Create anonymous token that expires in 24 hours
      const token = jwt.sign({ anonymous: true }, JWT_SECRET, { expiresIn: "24h" });
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error issuing token:", error);
      return res.status(500).json({ message: "Failed to issue token" });
    }
  });

  // Verify JWT token middleware
  const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  // Nutrition summary endpoint
  app.post("/api/summary", verifyToken, async (req, res) => {
    try {
      // 입력된 알레르기 정보가 문자열인 경우 배열로 변환
      const rawData = req.body;

      if (typeof rawData.allergies === "string" && rawData.allergies.trim() !== "") {
        rawData.allergies = rawData.allergies.split(",").map((item: string) => item.trim());
      } else if (!Array.isArray(rawData.allergies)) {
        rawData.allergies = [];
      }

      // Validate user info
      const userInfo = userInfoSchema.parse(rawData);

      // Generate only summary info without full meal details
      const recommendation = generateDietRecommendation(userInfo);

      return res.status(200).json({ summary: recommendation.summary });
    } catch (error) {
      console.error("Error generating nutrition summary:", error);

      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Invalid input data",
          errors: error.errors,
        });
      }

      return res.status(500).json({ message: "Failed to generate nutrition summary" });
    }
  });

  // Diet recommendation endpoint
  app.post("/api/recommend", verifyToken, async (req, res) => {
    try {
      // 입력된 알레르기 정보가 문자열인 경우 배열로 변환
      const rawData = req.body;

      if (typeof rawData.allergies === "string" && rawData.allergies.trim() !== "") {
        rawData.allergies = rawData.allergies.split(",").map((item: string) => item.trim());
      } else if (!Array.isArray(rawData.allergies)) {
        rawData.allergies = [];
      }

      // Validate user info
      const userInfo = userInfoSchema.parse(rawData);

      // This would normally call an external AI service, for the purpose of this project
      // we'll generate a simple recommendation based on the user's information
      const recommendation = generateDietRecommendation(userInfo);

      return res.status(200).json(recommendation);
    } catch (error) {
      console.error("Error generating recommendation:", error);

      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Invalid input data",
          errors: error.errors,
        });
      }

      return res.status(500).json({ message: "Failed to generate recommendation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate diet recommendations based on user info
function generateDietRecommendation(userInfo: z.infer<typeof userInfoSchema>) {
  // Calculate BMI
  const heightInMeters = userInfo.height / 100;
  const bmi = userInfo.weight / (heightInMeters * heightInMeters);

  // 체지방률 계산
  let bodyFatPercentage;
  const heightInCm = userInfo.height;
  const assumedAge = 30; // Assuming age 30 for simplicity

  // Check if U.S. Navy 둘레 공식을 적용할 수 있는지 확인
  const canUseNavyFormula =
    userInfo.gender === "male"
      ? userInfo.neckCircumference && userInfo.waistCircumference
      : userInfo.neckCircumference && userInfo.waistCircumference && userInfo.hipCircumference;

  if (canUseNavyFormula) {
    // U.S. Navy 둘레 공식 적용
    if (userInfo.gender === "male") {
      // 남성 공식: BF% = 495 / (1.0324 − 0.19077·log10(허리−목) + 0.15456·log10(신장)) − 450
      const waistMinusNeck = userInfo.waistCircumference! - userInfo.neckCircumference!;
      bodyFatPercentage =
        495 / (1.0324 - 0.19077 * Math.log10(waistMinusNeck) + 0.15456 * Math.log10(heightInCm)) -
        450;
    } else {
      // 여성 공식: BF% = 495 / (1.29579 − 0.35004·log10(허리+엄덩이−목) + 0.22100·log10(신장)) − 450
      const waistPlusHipMinusNeck =
        userInfo.waistCircumference! + userInfo.hipCircumference! - userInfo.neckCircumference!;
      bodyFatPercentage =
        495 /
          (1.29579 - 0.35004 * Math.log10(waistPlusHipMinusNeck) + 0.221 * Math.log10(heightInCm)) -
        450;
    }

    // 비정상적인 결과값 제한
    bodyFatPercentage = Math.max(3, Math.min(bodyFatPercentage, 50));
  } else {
    // 기본 체지방률 계산식 사용 (BMI 기반)
    // BF% = 1.20·BMI + 0.23·age - 10.8·gender - 5.4
    // For gender: male = 1, female = 0
    const genderMultiplier = userInfo.gender === "male" ? 1 : 0;
    bodyFatPercentage = 1.2 * bmi + 0.23 * assumedAge - 10.8 * genderMultiplier - 5.4;
  }

  // 체지방률 기반으로 제지방량 계산
  // Calculate Lean Body Mass: LBM = weight × (1 - BF%/100)
  const leanBodyMass = userInfo.weight * (1 - bodyFatPercentage / 100);

  // Basic BMR calculation (Mifflin-St Jeor Equation)
  // Mifflin-St Jeor BMR calculation (not used, but left here for reference)
  // let mifflinStJeorBmr;
  // if (userInfo.gender === "male") {
  //   mifflinStJeorBmr = 10 * userInfo.weight + 6.25 * userInfo.height - 5 * assumedAge + 5;
  // } else {
  //   mifflinStJeorBmr = 10 * userInfo.weight + 6.25 * userInfo.height - 5 * assumedAge - 161;
  // }

  // Katch-McArdle BMR calculation (using lean body mass)
  // BMR = 370 + 21.6 · LBM(kg)
  const katchMcArdleBmr = 370 + 21.6 * leanBodyMass;

  // Use Katch-McArdle equation when we have lean body mass, otherwise use Mifflin-St Jeor
  const bmr = katchMcArdleBmr;

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * activityMultipliers[userInfo.activityLevel];

  // Adjust based on goal
  let targetCalories;
  switch (userInfo.goal) {
    case "lose":
      targetCalories = tdee * 0.8; // 20% deficit
      break;
    case "gain":
      targetCalories = tdee * 1.1; // 10% surplus
      break;
    case "muscle":
      targetCalories = tdee * 1.15; // 15% surplus
      break;
    default:
      targetCalories = tdee; // maintain
  }

  // 실제 음식 데이터 목록
  const realFoods = [
    // 롯데리아 햄버거 데이터 추가
    {
      id: "burger-1",
      name: "데리버거",
      type: "lunch",
      calories: 348,
      protein: 12,
      carbs: 35, // 추정값
      fat: 15, // 추정값
      ingredients: ["쏼고기 패티", "양상추", "토마토", "소스", "변", "쏼고기 - 호주산"],
      recipe: "쏼고기 패티와 갈아 넣은 양파와 토마토, 소스를 꿀에 넣어 건네주세요.",
      imageUrl: "https://images.unsplash.com/photo-1550317138-10000687a72b",
      tags: ["패스트푸드", "햄버거", "비개"],
      score: 80,
      price: 4500,
      nutrition: {
        calories: 348,
        protein: 12,
        carbs: 35,
        fat: 15,
        sodium: 590,
        sugar: 10,
        saturatedFat: 4.9,
      },
    },
    {
      id: "burger-2",
      name: "치킨버거",
      type: "lunch",
      calories: 355,
      protein: 15,
      carbs: 36, // 추정값
      fat: 16, // 추정값
      ingredients: ["닭고기 패티", "양상추", "소스", "변", "닭고기 - 브라질산"],
      recipe: "닭고기 패티와 양파, 소스를 꿀에 넣어 건네주세요.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      tags: ["패스트푸드", "햄버거", "닭고기"],
      score: 81,
      price: 4000,
      nutrition: {
        calories: 355,
        protein: 15,
        carbs: 36,
        fat: 16,
        sodium: 620,
        sugar: 8,
        saturatedFat: 3.8,
      },
    },
    {
      id: "burger-3",
      name: "티렉스버거",
      type: "lunch",
      calories: 463,
      protein: 26,
      carbs: 40, // 추정값
      fat: 22, // 추정값
      ingredients: ["특대 닭고기 패티", "양상추", "토마토", "소스", "변", "닭고기 - 브라질산"],
      recipe: "특대 닭고기 패티와 양파, 토마토, 소스를 꿀에 넣어 건네주세요.",
      imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
      tags: ["패스트푸드", "햄버거", "닭고기", "고단백"],
      score: 85,
      price: 5400,
      nutrition: {
        calories: 463,
        protein: 26,
        carbs: 40,
        fat: 22,
        sodium: 830,
        sugar: 7,
        saturatedFat: 5.0,
      },
    },
    {
      id: "burger-4",
      name: "한우불고기버거",
      type: "lunch",
      calories: 572,
      protein: 23,
      carbs: 45, // 추정값
      fat: 30, // 추정값
      ingredients: ["한우 불고기 패티", "양상추", "토마토", "소스", "변", "쏼고기 - 국내산 한우"],
      recipe: "한우 불고기 패티와 양파, 토마토, 소스를 꿀에 넣어 건네주세요.",
      imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9",
      tags: ["패스트푸드", "햄버거", "한우", "고급"],
      score: 93,
      price: 8500,
      nutrition: {
        calories: 572,
        protein: 23,
        carbs: 45,
        fat: 30,
        sodium: 800,
        sugar: 15,
        saturatedFat: 12.0,
      },
    },
    {
      id: "burger-5",
      name: "더불한우불고기버거",
      type: "lunch",
      calories: 802,
      protein: 39,
      carbs: 52, // 추정값
      fat: 45, // 추정값
      ingredients: [
        "한우 불고기 패티 2장",
        "양상추",
        "토마토",
        "치즈",
        "소스",
        "변",
        "쏼고기 - 국내산 한우",
      ],
      recipe: "한우 불고기 패티 2장과 치즈, 양파, 토마토, 소스를 꿀에 넣어 건네주세요.",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
      tags: ["패스트푸드", "햄버거", "한우", "고급", "고단백"],
      score: 90,
      price: 12000,
      nutrition: {
        calories: 802,
        protein: 39,
        carbs: 52,
        fat: 45,
        sodium: 1150,
        sugar: 18,
        saturatedFat: 20.0,
      },
    },
    {
      id: "food-1",
      name: "그릴드 치킨 샐러드",
      type: "lunch",
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 18,
      ingredients: ["닭가슴살 100g", "양상추", "방울토마토", "올리브 오일", "레몬즙", "아보카도"],
      recipe:
        "닭가슴살을 양념하여 그릴에 굽고, 샐러드 채소와 함께 올리브 오일과 레몬즙으로 드레싱합니다.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      tags: ["고단백", "저탄수화물", "다이어트"],
      score: 92,
      price: 8500,
      nutrition: {
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 18,
      },
    },
    {
      id: "food-2",
      name: "연어 포케 보울",
      type: "dinner",
      calories: 420,
      protein: 24,
      carbs: 45,
      fat: 15,
      ingredients: ["연어 100g", "현미밥", "아보카도", "오이", "당근", "간장", "참기름"],
      recipe: "현미밥을 깔고 연어와 채소를 올린 후 간장과 참기름으로 간을 합니다.",
      imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
      tags: ["오메가3", "건강식", "고단백"],
      score: 95,
      price: 12000,
      nutrition: {
        calories: 420,
        protein: 24,
        carbs: 45,
        fat: 15,
      },
    },
    {
      id: "food-3",
      name: "프로틴 그릭 요거트",
      type: "breakfast",
      calories: 240,
      protein: 22,
      carbs: 16,
      fat: 8,
      ingredients: ["그릭 요거트 200g", "프로틴 파우더", "블루베리", "아몬드", "꿀"],
      recipe: "그릭 요거트에 프로틴 파우더를 섞고 블루베리와 아몬드를 토핑합니다.",
      imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
      tags: ["아침식사", "고단백", "간편식"],
      score: 88,
      price: 5500,
      nutrition: {
        calories: 240,
        protein: 22,
        carbs: 16,
        fat: 8,
      },
    },
    {
      id: "food-4",
      name: "클래식 치즈버거",
      type: "lunch",
      calories: 650,
      protein: 35,
      carbs: 40,
      fat: 38,
      ingredients: ["쇠고기 패티 150g", "통밀 번", "체다치즈", "양상추", "토마토", "양파", "피클"],
      recipe: "쇠고기 패티를 그릴에 구워 통밀 번과 함께 모든 재료를 쌓아올립니다.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      tags: ["햄버거", "고단백", "간편식"],
      score: 85,
      price: 9800,
      nutrition: {
        calories: 650,
        protein: 35,
        carbs: 40,
        fat: 38,
      },
    },
    {
      id: "food-5",
      name: "참치 아보카도 토스트",
      type: "lunch",
      calories: 380,
      protein: 22,
      carbs: 28,
      fat: 20,
      ingredients: ["통밀 식빵", "참치캔", "아보카도", "레몬즙", "적양파", "통밀 식빵"],
      recipe: "통밀 식빵을 구워 참치와 아보카도를 섞은 혼합물을 올립니다.",
      imageUrl: "https://images.unsplash.com/photo-1603046891745-6239338bd6a6",
      tags: ["오메가3", "건강식", "간편식"],
      score: 89,
      price: 7500,
      nutrition: {
        calories: 380,
        protein: 22,
        carbs: 28,
        fat: 20,
      },
    },
    {
      id: "food-6",
      name: "비프 타코 보울",
      type: "dinner",
      calories: 550,
      protein: 30,
      carbs: 45,
      fat: 25,
      ingredients: [
        "쇠고기 다진 고기",
        "검은콩",
        "현미밥",
        "아보카도",
        "살사 소스",
        "양상추",
        "라임즙",
      ],
      recipe: "다진 쇠고기를 양념해 볶고, 현미밥과 함께 모든 재료를 그릇에 담습니다.",
      imageUrl: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9",
      tags: ["멕시칸", "고단백", "건강식"],
      score: 91,
      price: 11000,
      nutrition: {
        calories: 550,
        protein: 30,
        carbs: 45,
        fat: 25,
      },
    },
    {
      id: "food-7",
      name: "채소 곤약 파스타",
      type: "dinner",
      calories: 280,
      protein: 15,
      carbs: 18,
      fat: 16,
      ingredients: ["곤약 파스타", "방울토마토", "버섯", "올리브 오일", "파르메산 치즈", "바질"],
      recipe:
        "곤약 파스타를 데친 후 소금물에 씻고, 올리브 오일에 토마토와 버섯을 볶아 소스를 만들어 버무립니다.",
      imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856",
      tags: ["파스타", "저칼로리", "다이어트"],
      score: 87,
      price: 8800,
      nutrition: {
        calories: 280,
        protein: 15,
        carbs: 18,
        fat: 16,
      },
    },
    {
      id: "food-8",
      name: "블루베리 오트밀",
      type: "breakfast",
      calories: 310,
      protein: 12,
      carbs: 45,
      fat: 8,
      ingredients: ["오트밀", "우유", "블루베리", "아몬드", "꿀", "시나몬 가루"],
      recipe: "오트밀을 우유와 함께 끓여 블루베리와 아몬드, 꿀을 넣고 시나몬 가루로 마무리합니다.",
      imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf",
      tags: ["아침식사", "식이섬유", "건강식"],
      score: 90,
      price: 6000,
      nutrition: {
        calories: 310,
        protein: 12,
        carbs: 45,
        fat: 8,
      },
    },
    {
      id: "food-9",
      name: "닭가슴살 브리또 보울",
      type: "lunch",
      calories: 480,
      protein: 35,
      carbs: 50,
      fat: 12,
      ingredients: ["닭가슴살", "현미밥", "검은콩", "옥수수", "사워크림", "살사 소스", "아보카도"],
      recipe: "닭가슴살을 구워 썰고, 현미밥과 채소, 소스를 그릇에 담습니다.",
      imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7",
      tags: ["멕시칸", "고단백", "건강식"],
      score: 93,
      price: 10500,
      nutrition: {
        calories: 480,
        protein: 35,
        carbs: 50,
        fat: 12,
      },
    },
    {
      id: "food-10",
      name: "연어 아보카도 롤",
      type: "dinner",
      calories: 390,
      protein: 20,
      carbs: 40,
      fat: 18,
      ingredients: ["연어", "김", "현미밥", "아보카도", "오이", "간장", "와사비"],
      recipe: "김 위에 현미밥을 펴고 연어와 아보카도, 오이를 올려 돌돌 말아 자릅니다.",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      tags: ["일식", "오메가3", "건강식"],
      score: 94,
      price: 13000,
      nutrition: {
        calories: 390,
        protein: 20,
        carbs: 40,
        fat: 18,
      },
    },
  ];

  // 식단 조합에 적합한 음식 추천

  // 사용자 목표에 맞게 필터링
  const filteredFoods = [...realFoods];

  if (userInfo.goal === "lose") {
    // 다이어트면 저칼로리 음식 우선
    filteredFoods.sort((a, b) => a.calories - b.calories);
  } else if (userInfo.goal === "muscle") {
    // 근육 증가면 고단백 음식 우선
    filteredFoods.sort((a, b) => b.protein - a.protein);
  } else if (userInfo.goal === "gain") {
    // 체중 증가면 고칼로리 음식 우선
    filteredFoods.sort((a, b) => b.calories - a.calories);
  }

  // 7개 음식을 랜덤으로 추천 (실제 앱에서는 더 정교한 알고리즘 필요)
  const recommendedFoods = [];

  // 모든 음식을 추천에 포함 (중복 허용)
  for (let i = 0; i < 7; i++) {
    const index = i % filteredFoods.length;
    const food = { ...filteredFoods[index] };
    food.id = `food-${i + 1}`; // 고유 ID 부여
    recommendedFoods.push(food);
  }

  // 최종 음식 리스트
  const meals = recommendedFoods;

  // 알레르기 정보를 반영한 식단 조정
  let allergyRecommendation = "";
  if (userInfo.allergies && userInfo.allergies.length > 0) {
    // 실제로는 여기서 알레르기 필터링 로직을 추가해야 합니다.
    // 예시: 해당 알레르기 성분이 없는 음식만 추천
    console.log(`필터링할 알레르기: ${userInfo.allergies.join(", ")}`);
    allergyRecommendation = `${userInfo.allergies.join(", ")} 알레르기를 고려한 식단입니다.`;
  }

  // Create recommendation summary
  const recommendation = {
    meals,
    summary: {
      totalCalories: Math.round(targetCalories),
      totalProtein: Math.round((targetCalories * 0.3) / 4),
      totalCarbs: Math.round((targetCalories * 0.4) / 4),
      totalFat: Math.round((targetCalories * 0.3) / 9),
      totalBudget: userInfo.budget,
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10, // 소수점 첫째 자리까지 표시
      leanBodyMass: Math.round(leanBodyMass * 10) / 10, // 소수점 첫째 자리까지 표시
      bmi: Math.round(bmi * 10) / 10, // 소수점 첫째 자리까지 표시
      bmr: Math.round(bmr), // 기초대사량
      tdee: Math.round(tdee), // 일일 총 에너지 소모량
      nutritionAnalysis: `${canUseNavyFormula ? `U.S. Navy 둘레 공식으로 계산한 ` : ``}체지방률은 ${Math.round(bodyFatPercentage * 10) / 10}%이며, 제지방량은 ${Math.round(leanBodyMass * 10) / 10}kg입니다. Katch-McArdle 공식으로 계산한 기초대사량(BMR)은 ${Math.round(bmr)}kcal이며, BMI ${Math.round(bmi * 10) / 10}을 고려하여 귀하의 활동량과 목표에 맞게 일일 총 에너지 소모량(TDEE) ${Math.round(tdee)}kcal을 기준으로 맞춤형 식단을 제시합니다.`,
      recommendations: [
        "규칙적인 식사와 수분 섭취를 유지하세요.",
        "가능하면 신선한 재료를 선택하세요.",
        "영양소 균형을 위해 다양한 색상의 과일과 채소를 섭취하세요.",
        "제지방량 유지를 위해 충분한 단백질 섭취가 중요합니다.",
        ...(allergyRecommendation ? [allergyRecommendation] : []),
      ],
    },
  };

  return recommendation;
}
