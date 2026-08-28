type LocaleKey = "ko" | "en" | "ja" | "zh-CN" | "zh-TW";

type Item = {
  title: string;
  desc: string;
  accentColor: string;
  numberColor: string;
  num: string;
};

type Copy = {
  eyebrow: string;
  title: string;
  items: Item[];
};

const copyMap: Record<LocaleKey, Copy> = {
  ko: {
    eyebrow: "Why Goyang-Ilsan",
    title: "고양일산, 공연·전시·관광·라이프스타일이 융합된 체류형 도시",
    items: [
      { title: "공연과 전시가 체류 경험으로 이어집니다", desc: "KINTEX, 공연장, 관광특구와 로컬 거점이 가까워 방문 경험을 하나의 여정으로 설계할 수 있습니다.", accentColor: "#ffe98b", numberColor: "text-[#ffe98b]", num: "01" },
      { title: "로컬 라이프스타일이 프로그램이 됩니다", desc: "카페, 미식, 쇼핑, 가족형 체험을 묶어 고양일산만의 체류형 콘텐츠로 확장할 수 있습니다.", accentColor: "#8df0cf", numberColor: "text-[#8df0cf]", num: "02" },
      { title: "연구가 운영 구조로 이어집니다", desc: "보고서에 머무르지 않고 지역 안내, 현장 운영, 체류 프로그램으로 연결되는 실행 구조를 만듭니다.", accentColor: "#a4d8ff", numberColor: "text-[#a4d8ff]", num: "03" },
      { title: "K-컬처 감도가 있는 도시 경험을 제안합니다", desc: "공연과 전시, 로컬 장면을 연결해 오래 기억되는 방문 경험을 구성할 수 있습니다.", accentColor: "#ffb58f", numberColor: "text-[#ffb58f]", num: "04" },
    ],
  },
  en: {
    eyebrow: "Why Goyang-Ilsan",
    title: "Goyang-Ilsan — a stay-oriented city where performances, exhibitions, tourism and lifestyle converge",
    items: [
      { title: "Performances and exhibitions extend into stay experiences", desc: "KINTEX, venues, tourism districts and local neighborhoods are close enough to form one visitor journey.", accentColor: "#ffe98b", numberColor: "text-[#ffe98b]", num: "01" },
      { title: "Local lifestyle becomes part of the program", desc: "Cafés, dining, shopping and family-friendly experiences can be shaped into stay-oriented content.", accentColor: "#8df0cf", numberColor: "text-[#8df0cf]", num: "02" },
      { title: "Research becomes an operational structure", desc: "The goal is not just reports, but local guides, field operations and practical visitor programs.", accentColor: "#a4d8ff", numberColor: "text-[#a4d8ff]", num: "03" },
      { title: "K-culture energy becomes a branded city experience", desc: "Performances, exhibitions and local scenes are translated into richer, better remembered visitor journeys.", accentColor: "#ffb58f", numberColor: "text-[#ffb58f]", num: "04" },
    ],
  },
  ja: {
    eyebrow: "Why Goyang-Ilsan",
    title: "高陽・一山 — 公演・展示・観光・ライフスタイルが融合した滞在型都市",
    items: [
      { title: "公演と展示が滞在体験へとつながります", desc: "KINTEX、公演場、観光特区とローカル拠点が近接しており、訪問体験を一つの旅程として設計できます。", accentColor: "#ffe98b", numberColor: "text-[#ffe98b]", num: "01" },
      { title: "ローカルライフスタイルがプログラムになります", desc: "カフェ、グルメ、ショッピング、ファミリー体験をまとめ、高陽・一山独自の滞在型コンテンツへと拡張できます。", accentColor: "#8df0cf", numberColor: "text-[#8df0cf]", num: "02" },
      { title: "研究が運営構造へとつながります", desc: "報告書にとどまらず、地域案内・現場運営・滞在プログラムへと連結する実行構造を構築します。", accentColor: "#a4d8ff", numberColor: "text-[#a4d8ff]", num: "03" },
      { title: "K-カルチャーを感じる都市体験を提案します", desc: "公演・展示・ローカルシーンを連結し、長く記憶に残る訪問体験を作り上げます。", accentColor: "#ffb58f", numberColor: "text-[#ffb58f]", num: "04" },
    ],
  },
  "zh-CN": {
    eyebrow: "Why Goyang-Ilsan",
    title: "高阳·一山 — 演出·展览·旅游·生活方式融合的滞留型城市",
    items: [
      { title: "演出与展览延伸为滞留体验", desc: "KINTEX、演出场馆、旅游特区与本地据点紧密相邻，可将访客体验设计为完整旅程。", accentColor: "#ffe98b", numberColor: "text-[#ffe98b]", num: "01" },
      { title: "本地生活方式成为旅游项目", desc: "将咖啡馆、美食、购物和家庭体验整合，打造高阳·一山独特的滞留型内容。", accentColor: "#8df0cf", numberColor: "text-[#8df0cf]", num: "02" },
      { title: "研究成果转化为运营结构", desc: "不止于报告，而是构建连接地区指南、现场运营和滞留项目的实行结构。", accentColor: "#a4d8ff", numberColor: "text-[#a4d8ff]", num: "03" },
      { title: "提供具有K-文化感的城市体验", desc: "连结演出、展览与本地场景，打造令人久久难忘的访客体验。", accentColor: "#ffb58f", numberColor: "text-[#ffb58f]", num: "04" },
    ],
  },
  "zh-TW": {
    eyebrow: "Why Goyang-Ilsan",
    title: "高陽·一山 — 演出·展覽·旅遊·生活風格融合的滯留型城市",
    items: [
      { title: "演出與展覽延伸為滯留體驗", desc: "KINTEX、演出場館、旅遊特區與在地據點緊密相鄰，可將訪客體驗設計為完整旅程。", accentColor: "#ffe98b", numberColor: "text-[#ffe98b]", num: "01" },
      { title: "在地生活風格成為旅遊項目", desc: "整合咖啡廳、美食、購物與家庭體驗，打造高陽·一山獨特的滯留型內容。", accentColor: "#8df0cf", numberColor: "text-[#8df0cf]", num: "02" },
      { title: "研究成果轉化為運營結構", desc: "不只停留於報告，而是構建連結地區指南、現場運營與滯留計畫的執行結構。", accentColor: "#a4d8ff", numberColor: "text-[#a4d8ff]", num: "03" },
      { title: "提供具有K-文化感的城市體驗", desc: "連結演出、展覽與在地場景，打造令人久久難忘的訪客體驗。", accentColor: "#ffb58f", numberColor: "text-[#ffb58f]", num: "04" },
    ],
  },
};

const LOCALES: LocaleKey[] = ["ko", "en", "ja", "zh-CN", "zh-TW"];

export default async function WhyGoyangSection({ locale }: { locale: string }) {
  const activeLocale: LocaleKey = (LOCALES.includes(locale as LocaleKey) ? locale : "ko") as LocaleKey;
  const copy = copyMap[activeLocale];

  return (
    <section className="py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,_#080e1a_0%,_#0d1a30_40%,_#102040_70%,_#14284a_100%)] px-5 py-10 shadow-[0_32px_80px_rgba(8,14,26,0.22)] sm:rounded-[40px] sm:px-8 sm:py-12 lg:px-12 lg:py-14">

          {/* 격자 배경 */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />

          {/* 배경 글로우 오브 */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[#8df0cf]/14 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#a4d8ff]/14 blur-[90px]" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-[#ffb58f]/10 blur-[70px]" />

          {/* 헤더 */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8df0cf]/25 bg-[#8df0cf]/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8df0cf]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8df0cf]/90">
                {copy.eyebrow}
              </span>
            </div>
            <h2 className="mt-5 text-[1.8rem] font-black leading-[1.18] tracking-[-0.03em] text-white [text-wrap:balance] sm:text-[2.3rem] sm:leading-[1.15] lg:text-[2.75rem] lg:leading-[1.1]">
              {copy.title}
            </h2>
            {/* 구분선 */}
            <div className="mt-7 h-px w-full bg-gradient-to-r from-[#8df0cf]/30 via-[#ffe98b]/20 to-transparent" />
          </div>

          {/* 카드 그리드 */}
          <div className="relative mt-8 grid gap-4 lg:grid-cols-2">
            {copy.items.map((item) => (
              <article
                key={item.num}
                className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-300 hover:bg-white/[0.09] hover:border-white/18"
              >
                {/* 왼쪽 액센트 라인 */}
                <div
                  className="absolute left-0 top-6 h-10 w-[3px] rounded-r-full"
                  style={{ background: item.accentColor }}
                />
                <div className="flex items-start gap-4">
                  <span className={`shrink-0 text-[1.7rem] font-black leading-none tracking-[-0.05em] opacity-40 ${item.numberColor}`}>
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-[1.05rem] font-black leading-[1.3] tracking-[-0.025em] text-white sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-7 text-slate-400 sm:text-[15px]">{item.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
