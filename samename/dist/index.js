// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { pgTable, text, serial, integer, real, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var allergyList = [
  "\uACC4\uB780",
  "\uC6B0\uC720",
  "\uBA54\uBC00",
  "\uB545\uCF69",
  "\uB300\uB450",
  "\uBC00",
  "\uACE0\uB4F1\uC5B4",
  "\uAC8C",
  "\uC0C8\uC6B0",
  "\uB3FC\uC9C0\uACE0\uAE30",
  "\uBCF5\uC22D\uC544",
  "\uD1A0\uB9C8\uD1A0",
  "\uC544\uD669\uC0B0\uB958",
  "\uD638\uB450",
  "\uB2ED\uACE0\uAE30",
  "\uC1E0\uACE0\uAE30",
  "\uC624\uC9D5\uC5B4",
  "\uC870\uAC1C\uB958",
  "\uC7A3",
  "\uC624\uB80C\uC9C0",
  "\uC789\uC5B4",
  "\uCC38\uAE68",
  "\uACE0\uCD94",
  "\uC544\uBAAC\uB4DC",
  "\uCE90\uC288\uB11B",
  "\uBE0C\uB77C\uC9C8\uB108\uD2B8",
  "\uD53C\uC2A4\uD0C0\uCE58\uC624",
  "\uB9C8\uCE74\uB2E4\uBBF8\uC544",
  "\uC0DD\uC120",
  "\uAC11\uAC01\uB958",
  "\uACAC\uACFC\uB958",
  "\uAE30\uD0C0"
];
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gender: text("gender").notNull(),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  bodyFat: real("body_fat").notNull(),
  goal: text("goal").notNull(),
  activityLevel: text("activity_level").notNull(),
  mealsPerDay: integer("meals_per_day").notNull(),
  allergies: jsonb("allergies").$type(),
  budget: integer("budget").notNull(),
  createdAt: text("created_at").notNull().$default(() => (/* @__PURE__ */ new Date()).toISOString())
});
var dietRecommendations = pgTable("diet_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  profileId: integer("profile_id").references(() => userProfiles.id),
  meals: jsonb("meals").notNull(),
  summary: jsonb("summary").notNull(),
  createdAt: text("created_at").notNull().$default(() => (/* @__PURE__ */ new Date()).toISOString())
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true }).extend({
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "\uC774\uC6A9\uC57D\uAD00\uC5D0 \uB3D9\uC758\uD574\uC57C \uD569\uB2C8\uB2E4."
  })
});
var insertDietRecommendationSchema = createInsertSchema(dietRecommendations).omit({
  id: true,
  createdAt: true
});
var userRelations = relations(users, ({ many }) => ({
  profiles: many(userProfiles),
  recommendations: many(dietRecommendations)
}));
var userProfileRelations = relations(userProfiles, ({ one, many }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
  recommendations: many(dietRecommendations)
}));
var dietRecommendationRelations = relations(dietRecommendations, ({ one }) => ({
  user: one(users, { fields: [dietRecommendations.userId], references: [users.id] }),
  profile: one(userProfiles, {
    fields: [dietRecommendations.profileId],
    references: [userProfiles.id]
  })
}));
var userInfoSchema = z.object({
  age: z.number().min(10).max(100),
  // ✅ age 속성 추가됨
  gender: z.enum(["male", "female"]),
  height: z.number().min(100).max(220),
  weight: z.number().min(30).max(200),
  bodyFat: z.number().min(5).max(50),
  goal: z.enum(["lose", "maintain", "gain", "muscle"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  mealsPerDay: z.number().min(2).max(3),
  allergies: z.array(z.enum(allergyList)).optional(),
  budget: z.number().min(5e3).max(1e5),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "\uC774\uC6A9\uC57D\uAD00\uC5D0 \uB3D9\uC758\uD574\uC57C \uD569\uB2C8\uB2E4."
  }),
  neckCircumference: z.number().min(20).max(80).optional(),
  waistCircumference: z.number().min(50).max(200).optional(),
  hipCircumference: z.number().min(50).max(200).optional()
});
var mealSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  ingredients: z.array(z.string()),
  recipe: z.string().optional(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  score: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  sodium: z.number().optional(),
  sugar: z.number().optional(),
  fiber: z.number().optional(),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    sodium: z.number().optional(),
    sugar: z.number().optional(),
    fiber: z.number().optional(),
    saturatedFat: z.number().optional()
  }).optional()
});
var dietRecommendationSchema = z.object({
  meals: z.array(mealSchema),
  summary: z.object({
    totalCalories: z.number(),
    totalProtein: z.number(),
    totalCarbs: z.number(),
    totalFat: z.number(),
    totalBudget: z.number(),
    bodyFatPercentage: z.number().optional(),
    leanBodyMass: z.number().optional(),
    bmi: z.number().optional(),
    bmr: z.number().optional(),
    tdee: z.number().optional(),
    nutritionAnalysis: z.string(),
    recommendations: z.array(z.string())
  })
});

// server/routes.ts
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
var JWT_SECRET = process.env.JWT_SECRET || "development_jwt_secret";
async function registerRoutes(app2) {
  app2.post("/api/auth/issue", async (req, res) => {
    try {
      const token = jwt.sign({ anonymous: true }, JWT_SECRET, { expiresIn: "24h" });
      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error issuing token:", error);
      return res.status(500).json({ message: "Failed to issue token" });
    }
  });
  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  app2.post("/api/summary", verifyToken, async (req, res) => {
    try {
      const rawData = req.body;
      if (typeof rawData.allergies === "string" && rawData.allergies.trim() !== "") {
        rawData.allergies = rawData.allergies.split(",").map((item) => item.trim());
      } else if (!Array.isArray(rawData.allergies)) {
        rawData.allergies = [];
      }
      const userInfo = userInfoSchema.parse(rawData);
      const recommendation = generateDietRecommendation(userInfo);
      return res.status(200).json({ summary: recommendation.summary });
    } catch (error) {
      console.error("Error generating nutrition summary:", error);
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Failed to generate nutrition summary" });
    }
  });
  app2.post("/api/recommend", verifyToken, async (req, res) => {
    try {
      const rawData = req.body;
      if (typeof rawData.allergies === "string" && rawData.allergies.trim() !== "") {
        rawData.allergies = rawData.allergies.split(",").map((item) => item.trim());
      } else if (!Array.isArray(rawData.allergies)) {
        rawData.allergies = [];
      }
      const userInfo = userInfoSchema.parse(rawData);
      const recommendation = generateDietRecommendation(userInfo);
      return res.status(200).json(recommendation);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: "Invalid input data",
          errors: error.errors
        });
      }
      return res.status(500).json({ message: "Failed to generate recommendation" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function generateDietRecommendation(userInfo) {
  const heightInMeters = userInfo.height / 100;
  const bmi = userInfo.weight / (heightInMeters * heightInMeters);
  let bodyFatPercentage;
  const heightInCm = userInfo.height;
  const assumedAge = 30;
  const canUseNavyFormula = userInfo.gender === "male" ? userInfo.neckCircumference && userInfo.waistCircumference : userInfo.neckCircumference && userInfo.waistCircumference && userInfo.hipCircumference;
  if (canUseNavyFormula) {
    if (userInfo.gender === "male") {
      const waistMinusNeck = userInfo.waistCircumference - userInfo.neckCircumference;
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistMinusNeck) + 0.15456 * Math.log10(heightInCm)) - 450;
    } else {
      const waistPlusHipMinusNeck = userInfo.waistCircumference + userInfo.hipCircumference - userInfo.neckCircumference;
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistPlusHipMinusNeck) + 0.221 * Math.log10(heightInCm)) - 450;
    }
    bodyFatPercentage = Math.max(3, Math.min(bodyFatPercentage, 50));
  } else {
    const genderMultiplier = userInfo.gender === "male" ? 1 : 0;
    bodyFatPercentage = 1.2 * bmi + 0.23 * assumedAge - 10.8 * genderMultiplier - 5.4;
  }
  const leanBodyMass = userInfo.weight * (1 - bodyFatPercentage / 100);
  let mifflinStJeorBmr;
  if (userInfo.gender === "male") {
    mifflinStJeorBmr = 10 * userInfo.weight + 6.25 * userInfo.height - 5 * assumedAge + 5;
  } else {
    mifflinStJeorBmr = 10 * userInfo.weight + 6.25 * userInfo.height - 5 * assumedAge - 161;
  }
  const katchMcArdleBmr = 370 + 21.6 * leanBodyMass;
  const bmr = katchMcArdleBmr;
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const tdee = bmr * activityMultipliers[userInfo.activityLevel];
  let targetCalories;
  switch (userInfo.goal) {
    case "lose":
      targetCalories = tdee * 0.8;
      break;
    case "gain":
      targetCalories = tdee * 1.1;
      break;
    case "muscle":
      targetCalories = tdee * 1.15;
      break;
    default:
      targetCalories = tdee;
  }
  const realFoods = [
    // 롯데리아 햄버거 데이터 추가
    {
      id: "burger-1",
      name: "\uB370\uB9AC\uBC84\uAC70",
      type: "lunch",
      calories: 348,
      protein: 12,
      carbs: 35,
      // 추정값
      fat: 15,
      // 추정값
      ingredients: ["\uC3FC\uACE0\uAE30 \uD328\uD2F0", "\uC591\uC0C1\uCD94", "\uD1A0\uB9C8\uD1A0", "\uC18C\uC2A4", "\uBCC0", "\uC3FC\uACE0\uAE30 - \uD638\uC8FC\uC0B0"],
      recipe: "\uC3FC\uACE0\uAE30 \uD328\uD2F0\uC640 \uAC08\uC544 \uB123\uC740 \uC591\uD30C\uC640 \uD1A0\uB9C8\uD1A0, \uC18C\uC2A4\uB97C \uAFC0\uC5D0 \uB123\uC5B4 \uAC74\uB124\uC8FC\uC138\uC694.",
      imageUrl: "https://images.unsplash.com/photo-1550317138-10000687a72b",
      tags: ["\uD328\uC2A4\uD2B8\uD478\uB4DC", "\uD584\uBC84\uAC70", "\uBE44\uAC1C"],
      score: 80,
      price: 4500,
      nutrition: {
        calories: 348,
        protein: 12,
        carbs: 35,
        fat: 15,
        sodium: 590,
        sugar: 10,
        saturatedFat: 4.9
      }
    },
    {
      id: "burger-2",
      name: "\uCE58\uD0A8\uBC84\uAC70",
      type: "lunch",
      calories: 355,
      protein: 15,
      carbs: 36,
      // 추정값
      fat: 16,
      // 추정값
      ingredients: ["\uB2ED\uACE0\uAE30 \uD328\uD2F0", "\uC591\uC0C1\uCD94", "\uC18C\uC2A4", "\uBCC0", "\uB2ED\uACE0\uAE30 - \uBE0C\uB77C\uC9C8\uC0B0"],
      recipe: "\uB2ED\uACE0\uAE30 \uD328\uD2F0\uC640 \uC591\uD30C, \uC18C\uC2A4\uB97C \uAFC0\uC5D0 \uB123\uC5B4 \uAC74\uB124\uC8FC\uC138\uC694.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      tags: ["\uD328\uC2A4\uD2B8\uD478\uB4DC", "\uD584\uBC84\uAC70", "\uB2ED\uACE0\uAE30"],
      score: 81,
      price: 4e3,
      nutrition: {
        calories: 355,
        protein: 15,
        carbs: 36,
        fat: 16,
        sodium: 620,
        sugar: 8,
        saturatedFat: 3.8
      }
    },
    {
      id: "burger-3",
      name: "\uD2F0\uB809\uC2A4\uBC84\uAC70",
      type: "lunch",
      calories: 463,
      protein: 26,
      carbs: 40,
      // 추정값
      fat: 22,
      // 추정값
      ingredients: ["\uD2B9\uB300 \uB2ED\uACE0\uAE30 \uD328\uD2F0", "\uC591\uC0C1\uCD94", "\uD1A0\uB9C8\uD1A0", "\uC18C\uC2A4", "\uBCC0", "\uB2ED\uACE0\uAE30 - \uBE0C\uB77C\uC9C8\uC0B0"],
      recipe: "\uD2B9\uB300 \uB2ED\uACE0\uAE30 \uD328\uD2F0\uC640 \uC591\uD30C, \uD1A0\uB9C8\uD1A0, \uC18C\uC2A4\uB97C \uAFC0\uC5D0 \uB123\uC5B4 \uAC74\uB124\uC8FC\uC138\uC694.",
      imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
      tags: ["\uD328\uC2A4\uD2B8\uD478\uB4DC", "\uD584\uBC84\uAC70", "\uB2ED\uACE0\uAE30", "\uACE0\uB2E8\uBC31"],
      score: 85,
      price: 5400,
      nutrition: {
        calories: 463,
        protein: 26,
        carbs: 40,
        fat: 22,
        sodium: 830,
        sugar: 7,
        saturatedFat: 5
      }
    },
    {
      id: "burger-4",
      name: "\uD55C\uC6B0\uBD88\uACE0\uAE30\uBC84\uAC70",
      type: "lunch",
      calories: 572,
      protein: 23,
      carbs: 45,
      // 추정값
      fat: 30,
      // 추정값
      ingredients: ["\uD55C\uC6B0 \uBD88\uACE0\uAE30 \uD328\uD2F0", "\uC591\uC0C1\uCD94", "\uD1A0\uB9C8\uD1A0", "\uC18C\uC2A4", "\uBCC0", "\uC3FC\uACE0\uAE30 - \uAD6D\uB0B4\uC0B0 \uD55C\uC6B0"],
      recipe: "\uD55C\uC6B0 \uBD88\uACE0\uAE30 \uD328\uD2F0\uC640 \uC591\uD30C, \uD1A0\uB9C8\uD1A0, \uC18C\uC2A4\uB97C \uAFC0\uC5D0 \uB123\uC5B4 \uAC74\uB124\uC8FC\uC138\uC694.",
      imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9",
      tags: ["\uD328\uC2A4\uD2B8\uD478\uB4DC", "\uD584\uBC84\uAC70", "\uD55C\uC6B0", "\uACE0\uAE09"],
      score: 93,
      price: 8500,
      nutrition: {
        calories: 572,
        protein: 23,
        carbs: 45,
        fat: 30,
        sodium: 800,
        sugar: 15,
        saturatedFat: 12
      }
    },
    {
      id: "burger-5",
      name: "\uB354\uBD88\uD55C\uC6B0\uBD88\uACE0\uAE30\uBC84\uAC70",
      type: "lunch",
      calories: 802,
      protein: 39,
      carbs: 52,
      // 추정값
      fat: 45,
      // 추정값
      ingredients: [
        "\uD55C\uC6B0 \uBD88\uACE0\uAE30 \uD328\uD2F0 2\uC7A5",
        "\uC591\uC0C1\uCD94",
        "\uD1A0\uB9C8\uD1A0",
        "\uCE58\uC988",
        "\uC18C\uC2A4",
        "\uBCC0",
        "\uC3FC\uACE0\uAE30 - \uAD6D\uB0B4\uC0B0 \uD55C\uC6B0"
      ],
      recipe: "\uD55C\uC6B0 \uBD88\uACE0\uAE30 \uD328\uD2F0 2\uC7A5\uACFC \uCE58\uC988, \uC591\uD30C, \uD1A0\uB9C8\uD1A0, \uC18C\uC2A4\uB97C \uAFC0\uC5D0 \uB123\uC5B4 \uAC74\uB124\uC8FC\uC138\uC694.",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
      tags: ["\uD328\uC2A4\uD2B8\uD478\uB4DC", "\uD584\uBC84\uAC70", "\uD55C\uC6B0", "\uACE0\uAE09", "\uACE0\uB2E8\uBC31"],
      score: 90,
      price: 12e3,
      nutrition: {
        calories: 802,
        protein: 39,
        carbs: 52,
        fat: 45,
        sodium: 1150,
        sugar: 18,
        saturatedFat: 20
      }
    },
    {
      id: "food-1",
      name: "\uADF8\uB9B4\uB4DC \uCE58\uD0A8 \uC0D0\uB7EC\uB4DC",
      type: "lunch",
      calories: 320,
      protein: 28,
      carbs: 12,
      fat: 18,
      ingredients: ["\uB2ED\uAC00\uC2B4\uC0B4 100g", "\uC591\uC0C1\uCD94", "\uBC29\uC6B8\uD1A0\uB9C8\uD1A0", "\uC62C\uB9AC\uBE0C \uC624\uC77C", "\uB808\uBAAC\uC999", "\uC544\uBCF4\uCE74\uB3C4"],
      recipe: "\uB2ED\uAC00\uC2B4\uC0B4\uC744 \uC591\uB150\uD558\uC5EC \uADF8\uB9B4\uC5D0 \uAD7D\uACE0, \uC0D0\uB7EC\uB4DC \uCC44\uC18C\uC640 \uD568\uAED8 \uC62C\uB9AC\uBE0C \uC624\uC77C\uACFC \uB808\uBAAC\uC999\uC73C\uB85C \uB4DC\uB808\uC2F1\uD569\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      tags: ["\uACE0\uB2E8\uBC31", "\uC800\uD0C4\uC218\uD654\uBB3C", "\uB2E4\uC774\uC5B4\uD2B8"],
      score: 92,
      price: 8500,
      nutrition: {
        calories: 320,
        protein: 28,
        carbs: 12,
        fat: 18
      }
    },
    {
      id: "food-2",
      name: "\uC5F0\uC5B4 \uD3EC\uCF00 \uBCF4\uC6B8",
      type: "dinner",
      calories: 420,
      protein: 24,
      carbs: 45,
      fat: 15,
      ingredients: ["\uC5F0\uC5B4 100g", "\uD604\uBBF8\uBC25", "\uC544\uBCF4\uCE74\uB3C4", "\uC624\uC774", "\uB2F9\uADFC", "\uAC04\uC7A5", "\uCC38\uAE30\uB984"],
      recipe: "\uD604\uBBF8\uBC25\uC744 \uAE54\uACE0 \uC5F0\uC5B4\uC640 \uCC44\uC18C\uB97C \uC62C\uB9B0 \uD6C4 \uAC04\uC7A5\uACFC \uCC38\uAE30\uB984\uC73C\uB85C \uAC04\uC744 \uD569\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
      tags: ["\uC624\uBA54\uAC003", "\uAC74\uAC15\uC2DD", "\uACE0\uB2E8\uBC31"],
      score: 95,
      price: 12e3,
      nutrition: {
        calories: 420,
        protein: 24,
        carbs: 45,
        fat: 15
      }
    },
    {
      id: "food-3",
      name: "\uD504\uB85C\uD2F4 \uADF8\uB9AD \uC694\uAC70\uD2B8",
      type: "breakfast",
      calories: 240,
      protein: 22,
      carbs: 16,
      fat: 8,
      ingredients: ["\uADF8\uB9AD \uC694\uAC70\uD2B8 200g", "\uD504\uB85C\uD2F4 \uD30C\uC6B0\uB354", "\uBE14\uB8E8\uBCA0\uB9AC", "\uC544\uBAAC\uB4DC", "\uAFC0"],
      recipe: "\uADF8\uB9AD \uC694\uAC70\uD2B8\uC5D0 \uD504\uB85C\uD2F4 \uD30C\uC6B0\uB354\uB97C \uC11E\uACE0 \uBE14\uB8E8\uBCA0\uB9AC\uC640 \uC544\uBAAC\uB4DC\uB97C \uD1A0\uD551\uD569\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
      tags: ["\uC544\uCE68\uC2DD\uC0AC", "\uACE0\uB2E8\uBC31", "\uAC04\uD3B8\uC2DD"],
      score: 88,
      price: 5500,
      nutrition: {
        calories: 240,
        protein: 22,
        carbs: 16,
        fat: 8
      }
    },
    {
      id: "food-4",
      name: "\uD074\uB798\uC2DD \uCE58\uC988\uBC84\uAC70",
      type: "lunch",
      calories: 650,
      protein: 35,
      carbs: 40,
      fat: 38,
      ingredients: ["\uC1E0\uACE0\uAE30 \uD328\uD2F0 150g", "\uD1B5\uBC00 \uBC88", "\uCCB4\uB2E4\uCE58\uC988", "\uC591\uC0C1\uCD94", "\uD1A0\uB9C8\uD1A0", "\uC591\uD30C", "\uD53C\uD074"],
      recipe: "\uC1E0\uACE0\uAE30 \uD328\uD2F0\uB97C \uADF8\uB9B4\uC5D0 \uAD6C\uC6CC \uD1B5\uBC00 \uBC88\uACFC \uD568\uAED8 \uBAA8\uB4E0 \uC7AC\uB8CC\uB97C \uC313\uC544\uC62C\uB9BD\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      tags: ["\uD584\uBC84\uAC70", "\uACE0\uB2E8\uBC31", "\uAC04\uD3B8\uC2DD"],
      score: 85,
      price: 9800,
      nutrition: {
        calories: 650,
        protein: 35,
        carbs: 40,
        fat: 38
      }
    },
    {
      id: "food-5",
      name: "\uCC38\uCE58 \uC544\uBCF4\uCE74\uB3C4 \uD1A0\uC2A4\uD2B8",
      type: "lunch",
      calories: 380,
      protein: 22,
      carbs: 28,
      fat: 20,
      ingredients: ["\uD1B5\uBC00 \uC2DD\uBE75", "\uCC38\uCE58\uCE94", "\uC544\uBCF4\uCE74\uB3C4", "\uB808\uBAAC\uC999", "\uC801\uC591\uD30C", "\uD1B5\uBC00 \uC2DD\uBE75"],
      recipe: "\uD1B5\uBC00 \uC2DD\uBE75\uC744 \uAD6C\uC6CC \uCC38\uCE58\uC640 \uC544\uBCF4\uCE74\uB3C4\uB97C \uC11E\uC740 \uD63C\uD569\uBB3C\uC744 \uC62C\uB9BD\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1603046891745-6239338bd6a6",
      tags: ["\uC624\uBA54\uAC003", "\uAC74\uAC15\uC2DD", "\uAC04\uD3B8\uC2DD"],
      score: 89,
      price: 7500,
      nutrition: {
        calories: 380,
        protein: 22,
        carbs: 28,
        fat: 20
      }
    },
    {
      id: "food-6",
      name: "\uBE44\uD504 \uD0C0\uCF54 \uBCF4\uC6B8",
      type: "dinner",
      calories: 550,
      protein: 30,
      carbs: 45,
      fat: 25,
      ingredients: [
        "\uC1E0\uACE0\uAE30 \uB2E4\uC9C4 \uACE0\uAE30",
        "\uAC80\uC740\uCF69",
        "\uD604\uBBF8\uBC25",
        "\uC544\uBCF4\uCE74\uB3C4",
        "\uC0B4\uC0AC \uC18C\uC2A4",
        "\uC591\uC0C1\uCD94",
        "\uB77C\uC784\uC999"
      ],
      recipe: "\uB2E4\uC9C4 \uC1E0\uACE0\uAE30\uB97C \uC591\uB150\uD574 \uBCF6\uACE0, \uD604\uBBF8\uBC25\uACFC \uD568\uAED8 \uBAA8\uB4E0 \uC7AC\uB8CC\uB97C \uADF8\uB987\uC5D0 \uB2F4\uC2B5\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9",
      tags: ["\uBA55\uC2DC\uCE78", "\uACE0\uB2E8\uBC31", "\uAC74\uAC15\uC2DD"],
      score: 91,
      price: 11e3,
      nutrition: {
        calories: 550,
        protein: 30,
        carbs: 45,
        fat: 25
      }
    },
    {
      id: "food-7",
      name: "\uCC44\uC18C \uACE4\uC57D \uD30C\uC2A4\uD0C0",
      type: "dinner",
      calories: 280,
      protein: 15,
      carbs: 18,
      fat: 16,
      ingredients: ["\uACE4\uC57D \uD30C\uC2A4\uD0C0", "\uBC29\uC6B8\uD1A0\uB9C8\uD1A0", "\uBC84\uC12F", "\uC62C\uB9AC\uBE0C \uC624\uC77C", "\uD30C\uB974\uBA54\uC0B0 \uCE58\uC988", "\uBC14\uC9C8"],
      recipe: "\uACE4\uC57D \uD30C\uC2A4\uD0C0\uB97C \uB370\uCE5C \uD6C4 \uC18C\uAE08\uBB3C\uC5D0 \uC53B\uACE0, \uC62C\uB9AC\uBE0C \uC624\uC77C\uC5D0 \uD1A0\uB9C8\uD1A0\uC640 \uBC84\uC12F\uC744 \uBCF6\uC544 \uC18C\uC2A4\uB97C \uB9CC\uB4E4\uC5B4 \uBC84\uBB34\uB9BD\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856",
      tags: ["\uD30C\uC2A4\uD0C0", "\uC800\uCE7C\uB85C\uB9AC", "\uB2E4\uC774\uC5B4\uD2B8"],
      score: 87,
      price: 8800,
      nutrition: {
        calories: 280,
        protein: 15,
        carbs: 18,
        fat: 16
      }
    },
    {
      id: "food-8",
      name: "\uBE14\uB8E8\uBCA0\uB9AC \uC624\uD2B8\uBC00",
      type: "breakfast",
      calories: 310,
      protein: 12,
      carbs: 45,
      fat: 8,
      ingredients: ["\uC624\uD2B8\uBC00", "\uC6B0\uC720", "\uBE14\uB8E8\uBCA0\uB9AC", "\uC544\uBAAC\uB4DC", "\uAFC0", "\uC2DC\uB098\uBAAC \uAC00\uB8E8"],
      recipe: "\uC624\uD2B8\uBC00\uC744 \uC6B0\uC720\uC640 \uD568\uAED8 \uB053\uC5EC \uBE14\uB8E8\uBCA0\uB9AC\uC640 \uC544\uBAAC\uB4DC, \uAFC0\uC744 \uB123\uACE0 \uC2DC\uB098\uBAAC \uAC00\uB8E8\uB85C \uB9C8\uBB34\uB9AC\uD569\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf",
      tags: ["\uC544\uCE68\uC2DD\uC0AC", "\uC2DD\uC774\uC12C\uC720", "\uAC74\uAC15\uC2DD"],
      score: 90,
      price: 6e3,
      nutrition: {
        calories: 310,
        protein: 12,
        carbs: 45,
        fat: 8
      }
    },
    {
      id: "food-9",
      name: "\uB2ED\uAC00\uC2B4\uC0B4 \uBE0C\uB9AC\uB610 \uBCF4\uC6B8",
      type: "lunch",
      calories: 480,
      protein: 35,
      carbs: 50,
      fat: 12,
      ingredients: ["\uB2ED\uAC00\uC2B4\uC0B4", "\uD604\uBBF8\uBC25", "\uAC80\uC740\uCF69", "\uC625\uC218\uC218", "\uC0AC\uC6CC\uD06C\uB9BC", "\uC0B4\uC0AC \uC18C\uC2A4", "\uC544\uBCF4\uCE74\uB3C4"],
      recipe: "\uB2ED\uAC00\uC2B4\uC0B4\uC744 \uAD6C\uC6CC \uC370\uACE0, \uD604\uBBF8\uBC25\uACFC \uCC44\uC18C, \uC18C\uC2A4\uB97C \uADF8\uB987\uC5D0 \uB2F4\uC2B5\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7",
      tags: ["\uBA55\uC2DC\uCE78", "\uACE0\uB2E8\uBC31", "\uAC74\uAC15\uC2DD"],
      score: 93,
      price: 10500,
      nutrition: {
        calories: 480,
        protein: 35,
        carbs: 50,
        fat: 12
      }
    },
    {
      id: "food-10",
      name: "\uC5F0\uC5B4 \uC544\uBCF4\uCE74\uB3C4 \uB864",
      type: "dinner",
      calories: 390,
      protein: 20,
      carbs: 40,
      fat: 18,
      ingredients: ["\uC5F0\uC5B4", "\uAE40", "\uD604\uBBF8\uBC25", "\uC544\uBCF4\uCE74\uB3C4", "\uC624\uC774", "\uAC04\uC7A5", "\uC640\uC0AC\uBE44"],
      recipe: "\uAE40 \uC704\uC5D0 \uD604\uBBF8\uBC25\uC744 \uD3B4\uACE0 \uC5F0\uC5B4\uC640 \uC544\uBCF4\uCE74\uB3C4, \uC624\uC774\uB97C \uC62C\uB824 \uB3CC\uB3CC \uB9D0\uC544 \uC790\uB985\uB2C8\uB2E4.",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      tags: ["\uC77C\uC2DD", "\uC624\uBA54\uAC003", "\uAC74\uAC15\uC2DD"],
      score: 94,
      price: 13e3,
      nutrition: {
        calories: 390,
        protein: 20,
        carbs: 40,
        fat: 18
      }
    }
  ];
  const mealTypes = ["breakfast", "lunch", "dinner"];
  const caloriesPerMeal = targetCalories / userInfo.mealsPerDay;
  let filteredFoods = [...realFoods];
  if (userInfo.goal === "lose") {
    filteredFoods.sort((a, b) => a.calories - b.calories);
  } else if (userInfo.goal === "muscle") {
    filteredFoods.sort((a, b) => b.protein - a.protein);
  } else if (userInfo.goal === "gain") {
    filteredFoods.sort((a, b) => b.calories - a.calories);
  }
  const recommendedFoods = [];
  for (let i = 0; i < 7; i++) {
    const index = i % filteredFoods.length;
    const food = { ...filteredFoods[index] };
    food.id = `food-${i + 1}`;
    recommendedFoods.push(food);
  }
  const meals = recommendedFoods;
  let allergyRecommendation = "";
  if (userInfo.allergies && userInfo.allergies.length > 0) {
    console.log(`\uD544\uD130\uB9C1\uD560 \uC54C\uB808\uB974\uAE30: ${userInfo.allergies.join(", ")}`);
    allergyRecommendation = `${userInfo.allergies.join(", ")} \uC54C\uB808\uB974\uAE30\uB97C \uACE0\uB824\uD55C \uC2DD\uB2E8\uC785\uB2C8\uB2E4.`;
  }
  const recommendation = {
    meals,
    summary: {
      totalCalories: Math.round(targetCalories),
      totalProtein: Math.round(targetCalories * 0.3 / 4),
      totalCarbs: Math.round(targetCalories * 0.4 / 4),
      totalFat: Math.round(targetCalories * 0.3 / 9),
      totalBudget: userInfo.budget,
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      // 소수점 첫째 자리까지 표시
      leanBodyMass: Math.round(leanBodyMass * 10) / 10,
      // 소수점 첫째 자리까지 표시
      bmi: Math.round(bmi * 10) / 10,
      // 소수점 첫째 자리까지 표시
      bmr: Math.round(bmr),
      // 기초대사량
      tdee: Math.round(tdee),
      // 일일 총 에너지 소모량
      nutritionAnalysis: `${canUseNavyFormula ? `U.S. Navy \uB458\uB808 \uACF5\uC2DD\uC73C\uB85C \uACC4\uC0B0\uD55C ` : ``}\uCCB4\uC9C0\uBC29\uB960\uC740 ${Math.round(bodyFatPercentage * 10) / 10}%\uC774\uBA70, \uC81C\uC9C0\uBC29\uB7C9\uC740 ${Math.round(leanBodyMass * 10) / 10}kg\uC785\uB2C8\uB2E4. Katch-McArdle \uACF5\uC2DD\uC73C\uB85C \uACC4\uC0B0\uD55C \uAE30\uCD08\uB300\uC0AC\uB7C9(BMR)\uC740 ${Math.round(bmr)}kcal\uC774\uBA70, BMI ${Math.round(bmi * 10) / 10}\uC744 \uACE0\uB824\uD558\uC5EC \uADC0\uD558\uC758 \uD65C\uB3D9\uB7C9\uACFC \uBAA9\uD45C\uC5D0 \uB9DE\uAC8C \uC77C\uC77C \uCD1D \uC5D0\uB108\uC9C0 \uC18C\uBAA8\uB7C9(TDEE) ${Math.round(tdee)}kcal\uC744 \uAE30\uC900\uC73C\uB85C \uB9DE\uCDA4\uD615 \uC2DD\uB2E8\uC744 \uC81C\uC2DC\uD569\uB2C8\uB2E4.`,
      recommendations: [
        "\uADDC\uCE59\uC801\uC778 \uC2DD\uC0AC\uC640 \uC218\uBD84 \uC12D\uCDE8\uB97C \uC720\uC9C0\uD558\uC138\uC694.",
        "\uAC00\uB2A5\uD558\uBA74 \uC2E0\uC120\uD55C \uC7AC\uB8CC\uB97C \uC120\uD0DD\uD558\uC138\uC694.",
        "\uC601\uC591\uC18C \uADE0\uD615\uC744 \uC704\uD574 \uB2E4\uC591\uD55C \uC0C9\uC0C1\uC758 \uACFC\uC77C\uACFC \uCC44\uC18C\uB97C \uC12D\uCDE8\uD558\uC138\uC694.",
        "\uC81C\uC9C0\uBC29\uB7C9 \uC720\uC9C0\uB97C \uC704\uD574 \uCDA9\uBD84\uD55C \uB2E8\uBC31\uC9C8 \uC12D\uCDE8\uAC00 \uC911\uC694\uD569\uB2C8\uB2E4.",
        ...allergyRecommendation ? [allergyRecommendation] : []
      ]
    }
  };
  return recommendation;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  root: path.resolve(__dirname, "client"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  server: {
    middlewareMode: false,
    allowedHosts: true,
    hmr: { overlay: true },
    // ← 여기에 프록시 설정을 추가!
    proxy: {
      // 클라이언트에서 /api 로 시작하는 요청은
      // http://localhost:5000 으로 프록시됩니다.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server }
    // allowedHosts: true,
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(import.meta.dirname, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
