import React, { useState, useRef, KeyboardEvent, useEffect } from "react";

interface TagInputProps {
  id: string;
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

/**
 * Tag input component for entering multiple items as tags
 */
const TagInput: React.FC<TagInputProps> = ({
  id,
  label,
  tags,
  onChange,
  placeholder = "태그 입력 후 Enter",
  suggestions = [],
}) => {
  const [inputValue, setInputValue] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 입력값이 변경될 때마다 자동완성 목록 필터링
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setActiveSuggestion(-1);
  }, [inputValue, suggestions, tags]);

  // 태그 추가
  const addTag = (tag: string) => {
    // 중복 및 빈 태그 처리
    const trimmedTag = tag.trim();
    if (trimmedTag === "" || tags.includes(trimmedTag)) {
      setInputValue("");
      return;
    }

    const newTags = [...tags, trimmedTag];
    onChange(newTags);
    setInputValue("");
    setShowSuggestions(false);
  };

  // 태그 삭제
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter 키: 태그 추가
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0 && activeSuggestion < filteredSuggestions.length) {
        // 자동완성 항목 선택 시
        addTag(filteredSuggestions[activeSuggestion]);
      } else if (inputValue) {
        // 직접 입력 시
        addTag(inputValue);
      }
      return;
    }

    // Backspace 키: 마지막 태그 삭제
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags);
      return;
    }

    // 화살표 키로 자동완성 목록 탐색
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions) {
        const nextActive =
          activeSuggestion < filteredSuggestions.length - 1 ? activeSuggestion + 1 : 0;
        setActiveSuggestion(nextActive);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions) {
        const prevActive =
          activeSuggestion > 0 ? activeSuggestion - 1 : filteredSuggestions.length - 1;
        setActiveSuggestion(prevActive);
      }
      return;
    }

    // Escape 키: 자동완성 숨기기
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  // 자동완성 항목 클릭
  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="main-input__label">
        {label}
      </label>

      {/* 태그 입력 필드와 태그 목록이 있는 컨테이너 */}
      <div className="flex flex-col relative">
        <div className="main-input__tag-container border border-input rounded-lg p-1 min-h-[42px] flex flex-wrap items-center gap-1">
          {/* 태그 목록 */}
          {tags.map((tag, index) => (
            <div
              key={`${tag}-${index}`}
              className="main-input__tag bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1 border border-primary/20 shadow-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-primary/70 hover:text-primary"
                aria-label={`${tag} 삭제`}
              >
                &times;
              </button>
            </div>
          ))}

          {/* 입력 필드 */}
          <input
            ref={inputRef}
            id={id}
            name={id}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            onBlur={() => {
              // 클릭 이벤트가 처리될 시간을 주기 위해 짧은 지연 후 자동완성 메뉴 숨김
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-grow min-w-[120px] px-2 py-1 border-0 focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>

        {/* 자동완성 제안 */}
        {showSuggestions && (
          <ul className="main-input__suggestions absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 shadow-lg border border-border">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`cursor-pointer px-3 py-2 text-sm text-popover-foreground hover:bg-muted ${index === activeSuggestion ? "bg-muted" : ""}`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-1">예: 땅콩, 우유, 해산물 (Enter키로 구분)</p>
    </div>
  );
};

export default TagInput;
