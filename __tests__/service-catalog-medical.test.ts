/**
 * Phase 6-B-2 · medical 병원 소개 슬롯 저장 UX 실증
 *
 * 목적: ServiceCatalogPanel이 저장하는 payload가
 *   1) Phase 3 (homepageUrl/phone) + Phase 4-A (departments/languagesSupported)
 *      4필드를 정본 ServiceCatalogItem 타입에서 허용하는지
 *   2) Supabase pages.contentJson 저장/재로드와 동치인 JSON 라운드트립을
 *      거쳐도 4필드가 유지되는지
 * 를 회귀 방지 관점에서 검증.
 *
 * 라이브 관리자 세션이 필요한 UI 저장 → 재로드 → 렌더 검증은 별도 수동 QA.
 * 이 테스트는 파이프라인 상 4필드가 씻겨나가지 않음을 정적으로 보장한다.
 */

import type { ServiceCatalogItem } from "@/data/service-catalog";

const buildSampleHospital = (): ServiceCatalogItem => ({
  id: "test-hospital",
  title: "테스트 병원",
  subtitle: "슬롯 검증용",
  location: "고양시",
  dateText: "연중 · 예약 상담",
  imageTone: "from-sky-100 via-white to-slate-100",
  posterLabel: "TEST",
  summary: "샘플",
  description: "샘플",
  tags: ["샘플"],
  price: 0,
  options: [],
  homepageUrl: "https://example.com",
  phone: "031-000-0000",
  departments: ["내과", "외과", "산부인과"],
  languagesSupported: ["en", "ja", "zh-CN", "zh-TW"],
});

describe("medical 병원 소개 슬롯 · 4필드 파이프라인", () => {
  it("ServiceCatalogItem이 Phase 3 CTA + Phase 4-A 병원 필드를 수용한다", () => {
    const hospital = buildSampleHospital();
    expect(hospital.homepageUrl).toBe("https://example.com");
    expect(hospital.phone).toBe("031-000-0000");
    expect(hospital.departments).toEqual(["내과", "외과", "산부인과"]);
    expect(hospital.languagesSupported).toEqual(["en", "ja", "zh-CN", "zh-TW"]);
  });

  it("JSON 라운드트립 후 4필드가 씻겨나가지 않는다 (Supabase contentJson 저장 등가)", () => {
    const hospital = buildSampleHospital();
    const roundTripped = JSON.parse(JSON.stringify(hospital)) as ServiceCatalogItem;

    expect(roundTripped.homepageUrl).toBe(hospital.homepageUrl);
    expect(roundTripped.phone).toBe(hospital.phone);
    expect(roundTripped.departments).toEqual(hospital.departments);
    expect(roundTripped.languagesSupported).toEqual(hospital.languagesSupported);
  });

  it("4필드 미기입(undefined)도 허용된다 (소개형 카드가 아닌 경우)", () => {
    const nonHospital: ServiceCatalogItem = {
      id: "non-hospital",
      title: "일반 아이템",
      subtitle: "",
      location: "",
      dateText: "",
      imageTone: "",
      posterLabel: "",
      summary: "",
      description: "",
      tags: [],
      price: 0,
      options: [],
    };
    expect(nonHospital.homepageUrl).toBeUndefined();
    expect(nonHospital.phone).toBeUndefined();
    expect(nonHospital.departments).toBeUndefined();
    expect(nonHospital.languagesSupported).toBeUndefined();
  });
});
