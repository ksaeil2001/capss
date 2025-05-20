import {
  users,
  userProfiles,
  dietRecommendations,
  type User,
  type UserProfile,
  type DietRecommendationDb,
  type InsertUser,
  type InsertUserProfile,
  type InsertDietRecommendation,
  type DietRecommendation,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User profile methods
  getUserProfile(id: number): Promise<UserProfile | undefined>;
  getUserProfileByUserId(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;

  // Diet recommendation methods
  getDietRecommendation(id: number): Promise<DietRecommendationDb | undefined>;
  getDietRecommendationsByUserId(userId: number): Promise<DietRecommendationDb[]>;
  createDietRecommendation(recommendation: InsertDietRecommendation): Promise<DietRecommendationDb>;
  saveDietRecommendation(
    userId: number,
    recommendation: DietRecommendation,
    profileId?: number
  ): Promise<DietRecommendationDb>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // User profile methods
  async getUserProfile(id: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return profile || undefined;
  }

  async getUserProfileByUserId(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { termsAgreed, ...profileData } = profile;
    // allergies가 배열인지 명확히 보장 (없거나 undefined면 빈 배열)
    const fixedProfileData = {
      ...profileData,
      allergies: Array.isArray(profileData.allergies) ? profileData.allergies.map(String) : [],
    };

    const [newProfile] = await db.insert(userProfiles).values(fixedProfileData).returning();
    return newProfile;
  }

  // Diet recommendation methods
  async getDietRecommendation(id: number): Promise<DietRecommendationDb | undefined> {
    const [recommendation] = await db
      .select()
      .from(dietRecommendations)
      .where(eq(dietRecommendations.id, id));
    return recommendation || undefined;
  }

  async getDietRecommendationsByUserId(userId: number): Promise<DietRecommendationDb[]> {
    return await db
      .select()
      .from(dietRecommendations)
      .where(eq(dietRecommendations.userId, userId));
  }

  async createDietRecommendation(
    recommendation: InsertDietRecommendation
  ): Promise<DietRecommendationDb> {
    const [newRecommendation] = await db
      .insert(dietRecommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async saveDietRecommendation(
    userId: number,
    recommendation: DietRecommendation,
    profileId?: number
  ): Promise<DietRecommendationDb> {
    const insertData: InsertDietRecommendation = {
      userId,
      profileId: profileId || null,
      meals: recommendation.meals,
      summary: recommendation.summary,
    };

    return await this.createDietRecommendation(insertData);
  }
}

export const storage = new DatabaseStorage();
