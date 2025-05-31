import React, { useState } from "react";

// 티어 목록
const tiers = ["우주명작", "명작", "재밌음", "볼만함", "쓰레기", "그냥"];

// 티어별 색깔
const tierColors: Record<string, string> = {
  우주명작: "#ffcccc",   // 빨간빛
  명작: "#ffd9b3",   // 주황빛
  재밌음: "#ffffcc",   // 노란빛
  볼만함: "#d9f2d9",   // 연두빛
  쓰레기: "#d9eaf7",   // 파랑빛
  그냥: "#e0e0e0",   // 회색
};

// 초기 애니 목록
const initialAnimeList = [
  "코드기오스", "오버로드", "도쿄구울", "이별의 아침에 약속의 꽃을 장식하자", "너의 췌장을 먹고싶어",
  "슈타인즈 게이트", "우마루", "플라스틱 메모리즈", "소아온", "카구야", "가브릴", "무직전생",
  "애완그녀", "약속의 내버렌드", "날씨의 아이", "코바야시", "마녀의 여행", "5등분",
  "노게임노라", "나에게 천사가 내려왔다", "변변치않은", "니세코이", "토라도라", "던만추",
  "에로망가선생", "블랙불릿", "마사무네", "코노스바", "극주보도", "바케모노가타리", "청춘돼지",
  "내청코", "중2병", "케이온", "주술회전", "내여귀", "여빌", "나만이 없는거리",
  "살육의 천사", "원펀맨", "너의 이름은", "목소리의 형태", "알바뛰는 마왕", "유녀전기","페배인","키스시스","스즈메","기생수","데스노트","사를로트","리제로","봋치","스파페"
];

function App() {
  const [unranked, setUnranked] = useState(initialAnimeList);
  const [tierList, setTierList] = useState(
    tiers.reduce((acc, tier) => ({ ...acc, [tier]: [] }), {})
  );

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, anime: string, from: string) => {
    e.dataTransfer.setData("anime", anime);
    e.dataTransfer.setData("from", from);
  };

  // 드롭 처리
  const handleDrop = (e: React.DragEvent, to: string) => {
    const anime = e.dataTransfer.getData("anime");
    const from = e.dataTransfer.getData("from");

    if (from === to) return;

    if (from === "Unranked") {
      setUnranked(prev => prev.filter(item => item !== anime));
    } else {
      setTierList(prev => ({
        ...prev,
        [from]: prev[from].filter(item => item !== anime)
      }));
    }

    if (to === "Unranked") {
      setUnranked(prev => [...prev, anime]);
    } else {
      setTierList(prev => ({
        ...prev,
        [to]: prev[to].includes(anime) ? prev[to] : [...prev[to], anime]
      }));
    }
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  // 현재 애니가 어느 티어에 속해있는지 찾기
  const getAnimeTier = (anime: string): string | null => {
    for (const tier of tiers) {
      if (tierList[tier].includes(anime)) return tier;
    }
    return null;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>애니메이션 티어표</h1>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {tiers.map((tier) => (
          <div
            key={tier}
            onDrop={(e) => handleDrop(e, tier)}
            onDragOver={allowDrop}
            style={{
              flex: "1 1 30%",
              minHeight: "120px",
              border: "2px solid #999",
              padding: "10px",
              background: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <h2>{tier} Tier</h2>
            {tierList[tier].map((anime) => (
              <div
                key={anime}
                draggable
                onDragStart={(e) => handleDragStart(e, anime, tier)}
                style={{
                  border: "1px solid gray",
                  padding: "5px",
                  margin: "5px 0",
                  cursor: "grab",
                  background: tierColors[tier] || "white", // 💡 티어 색
                  borderRadius: "4px",
                }}
              >
                {anime}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "30px" }}>Unranked</h2>
      <div
        onDrop={(e) => handleDrop(e, "Unranked")}
        onDragOver={allowDrop}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          minHeight: "100px",
          border: "2px dashed gray",
          padding: "10px",
          background: "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        {unranked.map((anime) => {
          const tier = getAnimeTier(anime); // null일 경우 unranked
          return (
            <div
              key={anime}
              draggable
              onDragStart={(e) => handleDragStart(e, anime, "Unranked")}
              style={{
                border: "1px solid gray",
                padding: "5px",
                cursor: "grab",
                background: tier ? tierColors[tier] : "white", // 💡 티어 색 or 흰색
                borderRadius: "4px",
              }}
            >
              {anime}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;


