/**
 * 고양 BEST 엠블럼 컴포넌트 테스트
 * - 5 category × 4 size 렌더 성공
 * - 사이즈 축약 규칙 (S: 아크 텍스트 생략, XS: 리본 생략)
 * - 5로케일 리본 문자열 일치
 * - aria-label 조합
 * - 스냅샷 1세트
 */

import React from "react";
import { render } from "@testing-library/react";

import { Emblem } from "@/components/emblem/Emblem";
import type {
  EmblemCategory,
  EmblemLocale,
  EmblemSize,
} from "@/components/emblem/colors";

const CATEGORIES: EmblemCategory[] = [
  "walk",
  "food",
  "culture",
  "kculture",
  "history",
];
const SIZES: EmblemSize[] = ["L", "M", "S", "XS"];
const LOCALES: EmblemLocale[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

// spec 에 명시된 리본 문자열 그대로 (테스트가 실 문안 계약이 되도록 하드코딩)
const RIBBON_EXPECTED: Record<EmblemLocale, Record<EmblemCategory, string>> = {
  ko: {
    walk: "산책",
    food: "미식",
    culture: "문화",
    kculture: "K컬처",
    history: "역사",
  },
  en: {
    walk: "Walks",
    food: "Food",
    culture: "Culture",
    kculture: "K-culture",
    history: "History",
  },
  ja: {
    walk: "さんぽ",
    food: "グルメ",
    culture: "文化",
    kculture: "Kカルチャー",
    history: "歴史",
  },
  "zh-CN": {
    walk: "漫步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "历史",
  },
  "zh-TW": {
    walk: "漫步",
    food: "美食",
    culture: "文化",
    kculture: "K文化",
    history: "歷史",
  },
};

const LABEL_PREFIX: Record<EmblemLocale, string> = {
  ko: "고양 BEST",
  en: "Goyang Best",
  ja: "高陽 BEST",
  "zh-CN": "高阳 BEST",
  "zh-TW": "高陽 BEST",
};

describe("Emblem — 렌더 매트릭스", () => {
  test.each(
    CATEGORIES.flatMap((cat) => SIZES.map((size) => [cat, size] as const))
  )("category=%s size=%s 는 svg role=img 로 렌더된다", (cat, size) => {
    const { container } = render(
      <Emblem category={cat} size={size} locale="ko" />
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("role")).toBe("img");
  });
});

describe("Emblem — 사이즈 축약 규칙", () => {
  test.each(["L", "M"] as const)(
    "size=%s 는 상단 아크 텍스트 'GOYANG BEST' 를 포함한다",
    (size) => {
      const { container } = render(
        <Emblem category="walk" size={size} locale="ko" />
      );
      expect(container.textContent).toContain("GOYANG BEST");
    }
  );

  test.each(["S", "XS"] as const)(
    "size=%s 는 상단 아크 텍스트를 생략한다",
    (size) => {
      const { container } = render(
        <Emblem category="walk" size={size} locale="ko" />
      );
      expect(container.textContent).not.toContain("GOYANG BEST");
    }
  );

  test("size=XS 는 카테고리별 리본 문자열을 모두 생략한다", () => {
    for (const cat of CATEGORIES) {
      const { container } = render(
        <Emblem category={cat} size="XS" locale="ko" />
      );
      expect(container.textContent).not.toContain(
        RIBBON_EXPECTED.ko[cat]
      );
    }
  });
});

describe("Emblem — 리본 문자열 (5로케일 × 5카테고리)", () => {
  const ribbonSizes: EmblemSize[] = ["L", "M", "S"];

  test.each(
    LOCALES.flatMap((locale) =>
      CATEGORIES.flatMap((cat) =>
        ribbonSizes.map((size) => [locale, cat, size] as const)
      )
    )
  )(
    "locale=%s category=%s size=%s 는 spec 문안을 렌더한다",
    (locale, cat, size) => {
      const { container } = render(
        <Emblem category={cat} size={size} locale={locale} />
      );
      const expected = RIBBON_EXPECTED[locale][cat];
      expect(container.textContent).toContain(expected);
    }
  );
});

describe("Emblem — aria-label 접근성", () => {
  test.each(LOCALES)(
    "locale=%s 에서 label 은 '<접두사> <리본문자열>' 형태",
    (locale) => {
      const { container } = render(
        <Emblem category="food" size="L" locale={locale} />
      );
      const svg = container.querySelector("svg");
      const expected = `${LABEL_PREFIX[locale]} ${RIBBON_EXPECTED[locale].food}`;
      expect(svg?.getAttribute("aria-label")).toBe(expected);
    }
  );
});

describe("Emblem — 스냅샷", () => {
  test("walk × L × ko 는 스냅샷과 일치한다", () => {
    const { container } = render(
      <Emblem category="walk" size="L" locale="ko" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
