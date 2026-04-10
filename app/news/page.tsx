import type { Metadata } from "next";
import { Link } from "@/lib/navigation";
import { Newspaper, Calendar, ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "뉴스 & 소식",
  description: "고양 문화관광·MICE 연구소의 최신 뉴스와 소식을 확인하세요.",
  alternates: {
    canonical: "/ko/news",
  },
};

const newsItems = [
  {
    id: 1,
    category: "공지",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "고양문화관광마이스연구소 DMC 출범",
    date: "2026.04.06",
    excerpt: "고양시의 MICE 산업 발전을 위한 연구소와 DMC 서비스가 통합 운영을 시작합니다. 연구와 실행의 융합을 통해 글로벌 MICE 허브 실현에 앞장서겠습니다.",
    featured: true,
  },
  {
    id: 2,
    category: "이벤트",
    categoryColor: "bg-green-100 text-green-700",
    title: "킨텍스 봄 시즌 전시회 DMC 서비스 개시",
    date: "2026.04.01",
    excerpt: "봄 시즌 국제 전시회 참가자를 위한 종합 DMC 서비스를 제공합니다. 숙박, 교통, 체험 프로그램을 원스톱으로 지원합니다.",
    featured: false,
  },
  {
    id: 3,
    category: "연구",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "고양시 MICE 전략 연구 보고서 발간",
    date: "2026.03.25",
    excerpt: "KINTEX 중심의 MICE 산업 생태계 분석과 경쟁력 강화 전략을 담은 연구 보고서를 공개합니다.",
    featured: false,
  },
  {
    id: 4,
    category: "협력",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "국제관광박람회 참가 및 네트워킹 성과",
    date: "2026.03.18",
    excerpt: "서울 국제관광박람회에서 고양시 MICE 경쟁력을 알리고, 해외 바이어 및 기관과 네트워킹을 진행했습니다.",
    featured: false,
  },
  {
    id: 5,
    category: "성과",
    categoryColor: "bg-emerald-100 text-emerald-700",
    title: "2026년 상반기 DMC 운영 실적 발표",
    date: "2026.03.10",
    excerpt: "국제회의 12건, 기업행사 8건, 인센티브투어 5건 등 총 25건의 DMC 프로젝트를 성공적으로 운영했습니다.",
    featured: false,
  },
  {
    id: 6,
    category: "사업",
    categoryColor: "bg-indigo-100 text-indigo-700",
    title: "문화관광 상품 개발 사업 착수",
    date: "2026.03.01",
    excerpt: "고양의 문화자원을 활용한 체험형 관광상품 개발을 시작합니다. 지역경제 활성화와 관광객 만족도 제고를 목표로 합니다.",
    featured: false,
  },
];

const pressReleases = [
  {
    title: "고양문화관광마이스연구소, DMC 통합운영 체계 구축",
    outlet: "연합뉴스",
    date: "2026.04.06",
    link: "#",
  },
  {
    title: "킨텍스 연계 MICE 허브 조성 본격화",
    outlet: "경기일보",
    date: "2026.04.05",
    link: "#",
  },
  {
    title: "고양시, 문화관광 경쟁력 강화 전략 발표",
    outlet: "중앙일보",
    date: "2026.04.03",
    link: "#",
  },
];

export default function NewsPage() {
  const featuredNews = newsItems.find(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
      {/* 페이지 헤더 */}
      <div className="mb-12 border-b border-slate-200 pb-10">
        <div className="flex items-center gap-3 text-slate-500">
          <Newspaper className="h-5 w-5" />
          <span className="text-sm font-semibold">News & Updates</span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
          뉴스 & 소식
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          고양 문화관광·MICE 연구소의 최신 연구 성과, DMC 운영 실적,
          협력 사례 등 다양한 소식을 전해드립니다.
        </p>
      </div>

      <div className="space-y-16">
        {/* Featured News */}
        {featuredNews && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">주요 뉴스</h2>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white lg:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${featuredNews.categoryColor}`}>
                  {featuredNews.category}
                </span>
                <div className="flex items-center gap-1 text-sm text-slate-300">
                  <Calendar className="h-4 w-4" />
                  {featuredNews.date}
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                {featuredNews.title}
              </h3>
              <p className="text-lg text-slate-300 mb-6 max-w-2xl">
                {featuredNews.excerpt}
              </p>
              <Link
                href={`/news/${featuredNews.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/20 transition"
              >
                자세히 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Regular News Grid */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">최신 소식</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularNews.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.categoryColor}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  자세히 보기
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Press Releases */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">언론보도</h2>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="space-y-6">
              {pressReleases.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{item.outlet}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <Link
                    href={item.link}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="rounded-3xl bg-slate-50 p-8 lg:p-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            최신 소식을 받아보세요
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            연구소의 연구 성과, DMC 운영 소식, 협력 사례 등 다양한 정보를
            이메일로 받아보실 수 있습니다.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="이메일 주소 입력"
              className="flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
              구독하기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
