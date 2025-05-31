import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const tiers = ["우주명작", "명작", "재밌음", "볼만함", "쓰레기", "그냥올려놈"];
const tierColors = {
  우주명작: "#ffdddd",
  명작: "#ffe5cc",
  재밌음: "#ffffcc",
  볼만함: "#ddffdd",
  쓰레기: "#e0e0e0",
  그냥올려놈: "#f0f0f0"
};

const initialAnimeList = [
  "코드기오스", "오버로드", "도쿄구울", "슈타인즈 게이트", "우마루",
  "플라스틱 메모리즈", "소아온", "카구야", "무직전생", "5등분",
  "코노스바", "케이온", "주술회전", "내여귀", "살육의 천사",
  "원펀맨", "너의 이름은", "목소리의 형태", "알바뛰는 마왕", "유녀전기",
  "페배인", "키스시스", "스즈메", "기생수", "데스노트",
  "사를로트", "리제로", "봇치", "스파페"
];

function SortableItem({ id, tier, onDragStart }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid gray",
    padding: "5px",
    margin: "5px 0",
    cursor: "grab",
    background: tierColors[tier] || "white",
    borderRadius: "4px"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDragStart={(e) => onDragStart(e, id, tier)}
    >
      {id}
    </div>
  );
}

export default function App() {
  const [tierList, setTierList] = useState(() => {
    const saved = localStorage.getItem("tierList");
    return saved ? JSON.parse(saved) : tiers.reduce((acc, t) => ({ ...acc, [t]: [] }), {});
  });

  const [unranked, setUnranked] = useState(() => {
    const saved = localStorage.getItem("unranked");
    return saved ? JSON.parse(saved) : initialAnimeList;
  });

  useEffect(() => {
    localStorage.setItem("tierList", JSON.stringify(tierList));
  }, [tierList]);

  useEffect(() => {
    localStorage.setItem("unranked", JSON.stringify(unranked));
  }, [unranked]);

  const handleDragStart = (e, anime, from) => {
    e.dataTransfer.setData("anime", anime);
    e.dataTransfer.setData("from", from);
  };

  const handleDrop = (e, to) => {
    const anime = e.dataTransfer.getData("anime");
    const from = e.dataTransfer.getData("from");
    if (!anime || from === to) return;

    if (from === "Unranked") setUnranked(prev => prev.filter(a => a !== anime));
    else setTierList(prev => ({
      ...prev,
      [from]: prev[from].filter(a => a !== anime)
    }));

    if (to === "Unranked") setUnranked(prev => [...prev, anime]);
    else setTierList(prev => ({
      ...prev,
      [to]: [...prev[to], anime]
    }));
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <DndContext collisionDetection={closestCenter}>
      <div style={{ padding: 20 }}>
        <h1>애니메이션 티어표</h1>

        {tiers.map((tier) => (
          <div
            key={tier}
            onDrop={(e) => handleDrop(e, tier)}
            onDragOver={allowDrop}
            style={{
              marginTop: 20,
              padding: 10,
              background: "#f9f9f9",
              border: "2px solid #999",
              borderRadius: 8
            }}
          >
            <h2>{tier}</h2>
            <SortableContext
              items={tierList[tier]}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {tierList[tier].map(anime => (
                  <SortableItem
                    key={anime}
                    id={anime}
                    tier={tier}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}

        <h2 style={{ marginTop: 30 }}>Unranked</h2>
        <div
          onDrop={(e) => handleDrop(e, "Unranked")}
          onDragOver={allowDrop}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            minHeight: 100,
            border: "2px dashed gray",
            padding: 10,
            background: "#f0f0f0",
            borderRadius: 8
          }}
        >
          {unranked.map(anime => (
            <div
              key={anime}
              draggable
              onDragStart={(e) => handleDragStart(e, anime, "Unranked")}
              style={{
                border: "1px solid gray",
                padding: 5,
                cursor: "grab",
                background: "white",
                borderRadius: 4
              }}
            >
              {anime}
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export default App;


