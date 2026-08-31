// components/dmc/LineDiagram.tsx
// GOYANG MOVE 노선도 SVG (오더 #A4 [3] · move-data-in.md 렌더 규칙 1·2).
//
// - 가로 라인, viewBox 반응형
// - 정거장 마커
//     endpoint : 채운 원 (마지막 세그먼트 색, 첫 정거장은 첫 세그먼트 색)
//     transit  : 흰 원 + 색 테두리 (incomingColor)
//     transfer : 흰 원 + 검정 굵은 테두리
// - 구간 색이 바뀌면 라인 색이 바뀌고, 구간 아래에 노선명(한국어 원문)을 해당 색으로 표기
// - 모바일: 부모 컨테이너가 overflow-x-auto 로 감싸 가로 스크롤 허용

import type { LineDiagramData } from "@/data/dmc-move";

/**
 * 각 정거장 x 좌표 간격 (viewBox 단위).
 * 정거장 6개까지 자연스러운 가로 배치가 되도록 여유롭게.
 */
const STEP_X = 140;
const LEFT_PAD = 60;
const RIGHT_PAD = 60;
const LINE_Y = 40;
const STATION_R = 8;
const STATION_R_TRANSFER = 10;
const LABEL_Y = 70;
const LINE_NAME_Y = 20;

export function LineDiagram({ data }: { data: LineDiagramData }) {
  const { stations } = data;
  if (stations.length === 0) return null;

  const width = LEFT_PAD + STEP_X * (stations.length - 1) + RIGHT_PAD;
  const height = 100;

  // endpoint 색: 인접 세그먼트 색을 우선 사용
  function endpointColor(i: number): string | undefined {
    if (i === 0) {
      return stations[1]?.incomingColor;
    }
    return stations[i].incomingColor;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        role="img"
        aria-label="노선도"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="block h-auto min-w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 세그먼트 라인 (정거장 사이) + 노선명 라벨 */}
        {stations.slice(1).map((s, idx) => {
          const from = LEFT_PAD + STEP_X * idx;
          const to = LEFT_PAD + STEP_X * (idx + 1);
          const midX = (from + to) / 2;
          const color = s.incomingColor ?? "#232322";
          return (
            <g key={`seg-${idx}`}>
              <line
                x1={from}
                y1={LINE_Y}
                x2={to}
                y2={LINE_Y}
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
              />
              {s.incomingLineName && (
                <text
                  x={midX}
                  y={LINE_NAME_Y}
                  fill={color}
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {s.incomingLineName}
                </text>
              )}
            </g>
          );
        })}

        {/* 정거장 마커 + 이름 라벨 */}
        {stations.map((st, i) => {
          const x = LEFT_PAD + STEP_X * i;
          const isTransfer = st.variant === "transfer";
          const isEndpoint = st.variant === "endpoint";
          const isTransit = st.variant === "transit";
          const color = endpointColor(i) ?? "#232322";

          return (
            <g key={`st-${i}-${st.name}`}>
              {isEndpoint && (
                <circle cx={x} cy={LINE_Y} r={STATION_R} fill={color} />
              )}
              {isTransit && (
                <>
                  <circle cx={x} cy={LINE_Y} r={STATION_R} fill="#FFFFFF" />
                  <circle
                    cx={x}
                    cy={LINE_Y}
                    r={STATION_R}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                  />
                </>
              )}
              {isTransfer && (
                <>
                  <circle
                    cx={x}
                    cy={LINE_Y}
                    r={STATION_R_TRANSFER}
                    fill="#FFFFFF"
                  />
                  <circle
                    cx={x}
                    cy={LINE_Y}
                    r={STATION_R_TRANSFER}
                    fill="none"
                    stroke="#232322"
                    strokeWidth="3.5"
                  />
                </>
              )}
              <text
                x={x}
                y={LABEL_Y}
                fill="#232322"
                fontSize="12"
                fontWeight={isEndpoint || isTransfer ? "700" : "600"}
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {st.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
