import React, { useState } from "react";

interface Agreement {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface TermsAgreementProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Terms and conditions agreement checkbox
 */
const TermsAgreement: React.FC<TermsAgreementProps> = ({ checked, onChange }) => {
  // 필수 동의 항목과 선택 동의 항목 구분
  const requiredAgreements: Agreement[] = [
    {
      id: "terms",
      title: "이용약관 및 개인정보 수집 동의 (필수)",
      description: "서비스 이용약관 및 개인정보 수집·이용에 동의합니다.",
      required: true,
    },
    {
      id: "health-data",
      title: "민감정보(건강 정보) 처리 동의 (필수)",
      description: "맞춤형 식단 추천을 위한 건강 정보 처리에 동의합니다.",
      required: true,
    },
    {
      id: "third-party",
      title: "제3자 제공·처리위탁 동의 (필수)",
      description: "서비스 제공을 위한 제3자 정보 제공 및 처리 위탁에 동의합니다.",
      required: true,
    },
    {
      id: "overseas-transfer",
      title: "해외 이전 동의 (필수)",
      description: "해외 서버를 통한 정보 처리 및 이전에 동의합니다.",
      required: true,
    },
    {
      id: "minor-consent",
      title: "미성년자(만 14세 미만) 법정대리인 동의 (필수)",
      description: "만 14세 미만인 경우 법정대리인의 동의가 필요합니다.",
      required: true,
    },
    {
      id: "disclaimer",
      title: "의학적 책임 면책·자기책임 확인 (필수)",
      description: "제공되는 식단 정보는 참고용이며, 의학적 판단을 대체할 수 없습니다.",
      required: true,
    },
  ];

  const optionalAgreements: Agreement[] = [
    {
      id: "marketing",
      title: "마케팅(광고성 정보 수신) 동의 (선택)",
      description: "새로운 기능 및 이벤트 정보 등의 마케팅 정보 수신에 동의합니다.",
      required: false,
    },
    {
      id: "cookies",
      title: "쿠키·행태정보 수집 동의 (선택)",
      description: "맞춤형 서비스 제공을 위한 쿠키 및 행태정보 수집에 동의합니다.",
      required: false,
    },
    {
      id: "profiling",
      title: "자동화된 의사결정(프로파일링) 동의 (선택)",
      description: "개인 맞춤형 추천을 위한 자동화된 분석 및 의사결정에 동의합니다.",
      required: false,
    },
  ];

  // 각 약관 동의 상태 관리
  const [agreements, setAgreements] = useState<{ [key: string]: boolean }>({
    terms: checked,
    "health-data": checked,
    "third-party": checked,
    "overseas-transfer": checked,
    "minor-consent": checked,
    disclaimer: checked,
    marketing: false,
    cookies: false,
    profiling: false,
  });

  // 모든 필수 약관에 동의했는지 확인
  const allRequiredAgreed = requiredAgreements.every(item => agreements[item.id]);

  // 개별 약관 변경 처리
  const handleAgreementChange = (id: string, isChecked: boolean) => {
    const newAgreements = { ...agreements, [id]: isChecked };
    setAgreements(newAgreements);

    // 필수 약관 모두 동의 시에만 전체 동의 상태 변경
    const allRequired = requiredAgreements.every(item => newAgreements[item.id]);
    onChange(allRequired);
  };

  // 전체 동의 처리
  const handleAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const newAgreements = Object.keys(agreements).reduce(
      (acc, key) => {
        acc[key] = isChecked;
        return acc;
      },
      {} as { [key: string]: boolean }
    );

    setAgreements(newAgreements);
    onChange(isChecked);
  };

  // 모든 약관 동의 상태 (필수 + 선택)
  const allAgreed = Object.values(agreements).every(v => v);

  return (
    <div className="space-y-4">
      {/* 전체 동의 */}
      <div className="border-b pb-3 mb-3">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="all-terms"
              name="all-terms"
              type="checkbox"
              className="focus:ring-primary h-5 w-5 text-primary border-gray-300 rounded"
              checked={allAgreed}
              onChange={handleAllChange}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="all-terms" className="font-bold text-base text-gray-800">
              모든 약관에 동의합니다
            </label>
            <p className="text-sm text-gray-500">필수 및 선택 약관을 모두 포함합니다.</p>
          </div>
        </div>
      </div>

      {/* 필수 동의 항목 */}
      <div className="space-y-3">
        <p className="font-medium text-sm text-gray-700">필수 동의 항목</p>
        {requiredAgreements.map(agreement => (
          <div key={agreement.id} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={agreement.id}
                name={agreement.id}
                type="checkbox"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                checked={agreements[agreement.id]}
                onChange={e => handleAgreementChange(agreement.id, e.target.checked)}
                required={agreement.required}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={agreement.id} className="font-medium text-gray-700">
                {agreement.title}
              </label>
              <p className="text-gray-500">
                {agreement.description}{" "}
                <a href="#" className="text-primary hover:text-primary/90">
                  약관 보기
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 선택 동의 항목 */}
      <div className="space-y-3 pt-2">
        <p className="font-medium text-sm text-gray-700">선택 동의 항목</p>
        {optionalAgreements.map(agreement => (
          <div key={agreement.id} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={agreement.id}
                name={agreement.id}
                type="checkbox"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                checked={agreements[agreement.id]}
                onChange={e => handleAgreementChange(agreement.id, e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={agreement.id} className="font-medium text-gray-700">
                {agreement.title}
              </label>
              <p className="text-gray-500">
                {agreement.description}{" "}
                <a href="#" className="text-primary hover:text-primary/90">
                  약관 보기
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAgreement;
