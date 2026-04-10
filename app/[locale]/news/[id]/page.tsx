import Shell from "@/components/layout/Shell";
import { Link } from "@/lib/navigation";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";

const articleSummaries: Record<string, { title: string; date: string; category: string }> = {
  "1": {
    title: "고양문화관광 MICE 연구소 DMC 출범",
    date: "2026.04.06",
    category: "공지",
  },
  "2": {
    title: "킨텍스 중심 전시권 DMC 서비스 개시",
    date: "2026.04.01",
    category: "이벤트",
  },
  "3": {
    title: "고양시 MICE 권역 연구 보고서 발간",
    date: "2026.03.25",
    category: "연구",
  },
  "4": {
    title: "국제관광박람회 참가 및 파트너십 성과",
    date: "2026.03.18",
    category: "협력",
  },
  "5": {
    title: "2026년 상반기 DMC 운영 실적 발표",
    date: "2026.03.10",
    category: "성과",
  },
  "6": {
    title: "문화관광 상품 개발 사업 착수",
    date: "2026.03.01",
    category: "사업",
  },
};

export default async function LocaleNewsDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await props.params;
  const article = articleSummaries[id] ?? {
    title: "고양 MICE 플랫폼 소식",
    date: "2026.04.07",
    category: "뉴스",
  };

  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Newspaper className="h-4 w-4" />
          <span>{article.category}</span>
          <span className="text-slate-300">/</span>
          <Calendar className="h-4 w-4" />
          <span>{article.date}</span>
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">
          {article.title}
        </h1>
        <p className="mt-6 text-base leading-8 text-slate-600">
          현재 뉴스 상세 페이지는 라우팅 정상화와 콘텐츠 구조 정리를 우선 적용한 상태입니다.
          실제 보도자료 원문과 이미지, 관련 링크는 원안 콘텐츠가 정리되는 대로 이어서 반영할 수 있습니다.
        </p>

        <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-sm leading-8 text-slate-600">
            고양 MICE 플랫폼의 뉴스 섹션은 연구소 소식, DMC 운영 사례, 파트너십 성과,
            프로그램 업데이트를 한 곳에서 전달하기 위한 채널입니다. 현재는 상세 라우트가
            끊기지 않도록 기본 구조를 먼저 연결해 두었으며, 향후 기사별 전문과 외부 보도 링크,
            이미지 자산, 다운로드 자료를 함께 구성할 수 있습니다.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            뉴스 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </Shell>
  );
}
