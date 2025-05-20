import { create } from "zustand";
import { type UserInfo } from "@shared/schema";

type UserInfoStore = {
  userInfo: Partial<UserInfo>;
  isFormValid: boolean;

  // Setters for each field
  setGender: (gender: UserInfo["gender"]) => void;
  setHeight: (height: number | undefined) => void;
  setWeight: (weight: number | undefined) => void;
  setBodyFat: (bodyFat: number) => void;
  setGoal: (goal: UserInfo["goal"]) => void;
  setActivityLevel: (activityLevel: UserInfo["activityLevel"]) => void;
  setMealsPerDay: (mealsPerDay: number) => void;
  setAllergies: (allergies: string[]) => void;
  setBudget: (budget: number | undefined) => void;
  setTermsAgreed: (termsAgreed: boolean) => void;
  setAge: (age: number | undefined) => void; // ✅ 추가

  // U.S. Navy 둘레 공식을 위한 추가 세터
  setNeckCircumference: (value: number | undefined) => void;
  setWaistCircumference: (value: number | undefined) => void;
  setHipCircumference: (value: number | undefined) => void;

  // Utility functions
  resetForm: () => void;
  validateForm: () => boolean;
};

const useUserInfoStore = create<UserInfoStore>((set, get) => ({
  userInfo: {
    bodyFat: 20,
    allergies: [],
    termsAgreed: false,
  },
  isFormValid: false,

  setGender: gender => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, gender } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setHeight: height => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, height } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setWeight: weight => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, weight } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setBodyFat: bodyFat => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, bodyFat } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setGoal: goal => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, goal } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setActivityLevel: activityLevel => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, activityLevel } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setMealsPerDay: mealsPerDay => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, mealsPerDay } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setAllergies: allergies => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, allergies } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setBudget: budget => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, budget } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setTermsAgreed: termsAgreed => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, termsAgreed } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setAge: age => {
    set(state => {
      const newState = {
        userInfo: { ...state.userInfo, age },
      };
      return {
        ...newState,
        isFormValid: validateUserInfo(newState.userInfo),
      };
    });
  },

  setNeckCircumference: value => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, neckCircumference: value } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setWaistCircumference: value => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, waistCircumference: value } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  setHipCircumference: value => {
    set(state => {
      const newState = { userInfo: { ...state.userInfo, hipCircumference: value } };
      return { ...newState, isFormValid: validateUserInfo(newState.userInfo) };
    });
  },

  resetForm: () => {
    set({
      userInfo: {
        bodyFat: 20,
        allergies: [],
        termsAgreed: false,
        age: undefined, // ✅ 추가
        neckCircumference: undefined,
        waistCircumference: undefined,
        hipCircumference: undefined,
      },
      isFormValid: false,
    });
  },

  validateForm: () => {
    const isValid = validateUserInfo(get().userInfo);
    set({ isFormValid: isValid });
    return isValid;
  },
}));

function validateUserInfo(userInfo: Partial<UserInfo>): boolean {
  const {
    gender,
    height,
    weight,
    bodyFat,
    goal,
    activityLevel,
    mealsPerDay,
    budget,
    termsAgreed,
    age, // ✅ 추가
  } = userInfo;

  if (
    !gender ||
    !height ||
    !weight ||
    bodyFat === undefined ||
    !goal ||
    !activityLevel ||
    !mealsPerDay ||
    !budget ||
    !termsAgreed ||
    age === undefined // ✅ 추가
  ) {
    return false;
  }

  if (height < 100 || height > 220) return false;
  if (weight < 30 || weight > 200) return false;
  if (bodyFat < 5 || bodyFat > 50) return false;
  if (budget < 5000 || budget > 100000) return false;
  if (age < 10 || age > 100) return false; // ✅ 추가

  return true;
}

export default useUserInfoStore;
