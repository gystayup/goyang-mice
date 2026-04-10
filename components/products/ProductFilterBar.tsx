const filters = ["전체", "비즈니스 패키지", "체험 프로그램", "관광 연계 코스", "프리미엄 프로그램"];

export default function ProductFilterBar() {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((item, index) => (
        <button
          key={item}
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            index === 0
              ? "bg-slate-950 text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
