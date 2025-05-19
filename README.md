# Capstone-Design-Project

프로젝트 개요 및 구조, 기술 스택, 핵심 로직을 아래와 같이 정리했습니다.

---

## 1. 디렉터리 구조

```text
Capstone-Design-Project-seil/
├── README.md
├── package-lock.json
├── samename/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── drizzle.config.ts
│   ├── eslint.config.js
│   ├── vite.config.ts
│   ├── .gitignore
│   ├── .prettierrc
│   ├── .eslintrc.js
│   ├── client/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   ├── pages/
│   │   │   │   ├── MainInputPage.tsx
│   │   │   │   ├── RecommendPage.tsx
│   │   │   │   ├── MealConfigPage.tsx
│   │   │   │   └── SummaryPage.tsx
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   ├── api/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   └── public/
│   ├── server/
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── db.ts
│   │   ├── storage.ts
│   │   └── vite.ts
│   ├── shared/
│   └── attached_assets/
├── 개요도/
└── 시나리오 흐름도/
```

- **samename/**: 프론트엔드와 백엔드를 모노리포로 관리  
- **client/**: Vite + React + TypeScript 기반 UI  
- **server/**: Express + TypeScript + Drizzle ORM 기반 REST API  
- **shared/**: 클라이언트·서버 공통 모듈  
- **attached_assets/**, **개요도/**, **시나리오 흐름도/**: 디자인·다이어그램 파일  

---

## 2. 기술 스택

| 구분           | 도구·라이브러리                       | 역할 / 비고                                                    |
|---------------|--------------------------------------|----------------------------------------------------------------|
| **프론트엔드**   | React 18 + TypeScript               | 컴포넌트 기반 UI                                               |
|               | Vite                                 | 빠른 개발 서버 및 번들링                                      |
|               | Zustand                              | 글로벌 상태 관리                                              |
|               | Tailwind CSS + PostCSS               | 유틸리티 퍼스트 CSS                                           |
|               | axios                                | API 통신                                                      |
|               | React Hook Form + Resolvers          | 폼 유효성 검사                                                |
|               | ESLint, Prettier                     | 코드 정적 분석 및 포맷팅                                      |
| **백엔드**      | Node.js + Express + TypeScript       | REST API 서버                                                 |
|               | Drizzle ORM + PostgreSQL             | 타입 안전 ORM, SQL 자료 모델링                                |
|               | express-session + connect-pg-simple  | 세션 관리 (PostgreSQL 저장소)                                 |
|               | passport + passport-local            | 인증 전략                                                     |
|               | bcrypt                               | 해싱                                                         |
|               | CORS, cookie-parser                  | 보안, 쿠키 파싱                                              |
| **빌드·배포**    | GitHub Actions → Vercel/Render      | CI/CD 자동 배포                                               |
|               | drizzle-kit                          | DB 마이그레이션                                              |
| **테스트·문서**  | Postman + Newman                    | API 자동화 테스트                                            |
|               | Markdown · Mermaid · Figma           | 문서화, 다이어그램, 디자인 스펙                               |

---

## 3. 핵심 로직 분석 및 구조 설명

### 3.1 프론트엔드 상태·API 흐름

1. **정보 입력** (`MainInputPage.tsx` + `useUserInfoStore`)  
   - 성별·키·몸무게·체지방률·목표 등 사용자 정보 저장  
   - `/auth/issue` → `/recommend` 호출  

2. **추천 생성** (`RecommendPage.tsx` + `useRecommendStore`)  
   - API로부터 `meals[]`, `summary` 수신 후 상태 업데이트  
   - `FoodCardList`, `MealTabs` 렌더링  

3. **식단 구성** (`MealConfigPage.tsx` + `useMealConfigStore`)  
   - 드래그·드롭으로 음식 배치  
   - `validateMealStructure()`로 끼니 수·알러지 검사  

4. **결과 요약** (`SummaryPage.tsx` + `useSummaryStore`)  
   - `/save` 호출 후 저장 결과 및 통계 표시  
   - `NutritionChart`, `BudgetBar` 컴포넌트  

### 3.2 백엔드 핵심 알고리즘 (`server/recommend.ts`)

```ts
// BMR 계산 (Mifflin-St Jeor)
function calculateBMR(gender, weight, height, age) { … }

// 체지방률 보정
function adjustKcalByBodyFat(kcal, bodyFat, goal) { … }

// 음식 후보 필터링
const candidates = await db.select()
  .from(foods)
  .where(notOverlapAllergies)
  .and(price <= budgetPerMeal)
  .and(kcal between target*0.8 and target*1.2);

// 점수 산정
const nutritionScore = calculateNutritionScore(food, target);
const tagScore = calculateTagMatchScore(food, preferredTags);
const penalty = calculatePricePenalty(price, budgetPerMeal);
const score = 0.5 * nutritionScore + 0.3 * tagScore - 0.2 * penalty;

// 결과 반환
return { meals, summary, fallback };

/recommend: 알고리즘 수행 후 추천 결과 반환

/save: Drizzle ORM을 통해 추천·식단 데이터를 DB에 저장
