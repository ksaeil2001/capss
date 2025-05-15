import { pgTable, text, serial, integer, real, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const allergyList = [
  "계란",
  "우유",
  "메밀",
  "땅콩",
  "대두",
  "밀",
  "고등어",
  "게",
  "새우",
  "돼지고기",
  "복숭아",
  "토마토",
  "아황산류",
  "호두",
  "닭고기",
  "쇠고기",
  "오징어",
  "조개류",
  "잣",
  "오렌지",
  "잉어",
  "참깨",
  "고추",
  "아몬드",
  "캐슈넛",
  "브라질너트",
  "피스타치오",
  "마카다미아",
  "생선",
  "갑각류",
  "견과류",
  "기타",
] as const;

export type AllergyType = (typeof allergyList)[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  gender: text("gender").notNull(),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  bodyFat: real("body_fat").notNull(),
  goal: text("goal").notNull(),
  activityLevel: text("activity_level").notNull(),
  mealsPerDay: integer("meals_per_day").notNull(),
  allergies: jsonb("allergies").$type<string[]>(),
  budget: integer("budget").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$default(() => new Date().toISOString()),
});

export const dietRecommendations = pgTable("diet_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  profileId: integer("profile_id").references(() => userProfiles.id),
  meals: jsonb("meals").notNull(),
  summary: jsonb("summary").notNull(),
  createdAt: text("created_at")
    .notNull()
    .$default(() => new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles)
  .omit({ id: true, createdAt: true })
  .extend({
    termsAgreed: z.boolean().refine(val => val === true, {
      message: "이용약관에 동의해야 합니다.",
    }),
  });

export const insertDietRecommendationSchema = createInsertSchema(dietRecommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type DietRecommendationDb = typeof dietRecommendations.$inferSelect;

// Define relationship between tables
export const userRelations = relations(users, ({ many }) => ({
  profiles: many(userProfiles),
  recommendations: many(dietRecommendations),
}));

export const userProfileRelations = relations(userProfiles, ({ one, many }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
  recommendations: many(dietRecommendations),
}));

export const dietRecommendationRelations = relations(dietRecommendations, ({ one }) => ({
  user: one(users, { fields: [dietRecommendations.userId], references: [users.id] }),
  profile: one(userProfiles, {
    fields: [dietRecommendations.profileId],
    references: [userProfiles.id],
  }),
}));

// Diet Recommendation Schema
export const userInfoSchema = z.object({
  age: z.number().min(10).max(100), // ✅ age 속성 추가됨
  gender: z.enum(["male", "female"]),
  height: z.number().min(100).max(220),
  weight: z.number().min(30).max(200),
  bodyFat: z.number().min(5).max(50),
  goal: z.enum(["lose", "maintain", "gain", "muscle"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  mealsPerDay: z.number().min(2).max(3),
  allergies: z.array(z.enum(allergyList)).optional(),
  budget: z.number().min(5000).max(100000),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "이용약관에 동의해야 합니다.",
  }),
  neckCircumference: z.number().min(20).max(80).optional(),
  waistCircumference: z.number().min(50).max(200).optional(),
  hipCircumference: z.number().min(50).max(200).optional(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

export const mealSchema = z.object({
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
  nutrition: z
    .object({
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      sodium: z.number().optional(),
      sugar: z.number().optional(),
      fiber: z.number().optional(),
      saturatedFat: z.number().optional(),
    })
    .optional(),
});

export type Meal = z.infer<typeof mealSchema>;

export const dietRecommendationSchema = z.object({
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
    recommendations: z.array(z.string()),
  }),
});

export type DietRecommendation = z.infer<typeof dietRecommendationSchema>;

// Types for inserts
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertDietRecommendation = z.infer<typeof insertDietRecommendationSchema>;
