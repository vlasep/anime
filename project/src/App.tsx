// src/App.tsx

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";

const tiers = ["우주명작", "명작", "재밌음", "볼만함", "쓰레기", "그냥올려놈"];

const allAnime = [
  "코드기오스", "오버로드", "도쿄구울", "이별의 아침에 약속의 꽃을 장식하자", "너의 췌장을 먹고싶어",
  "슈타인즈 게이트", "우마루", "플라스틱 메모리즈", "소아온", "카구야", "가브릴", "무직전생",
  "애완그녀", "약속의 내버렌드", "날씨의 아이", "코바야지", "마녀의 여행", "5등분",
  "노게임노라", "나에게 천사가 내려왔다", "변변치않은", "니세코이", "토라도라", "던만추",
  "에로망가선생", "블랙불릿", "마사무네", "코노스바", "극주보도", "바케모노가타리",
  "청춘돼지", "내청코", "중2병", "케이온", "주술회전", "내여귀", "여빌",
  "나만이 없는거리", "살육의 천사", "원펀맨", "너의 이름은", "목소리의 형태", "알바뛰는 마왕",
  "유녀전기", "페배인", "키스시스", "스즈메", "기생수", "데스노트", "사를로트",
  "리제로", "봇치", "스파페"
];

function App() {
  const [tierData, setTierData] = useState(
    Object.fromEntries(tiers.map(t => [t, []]))
  );
  const [unranked, setUnranked] = useState(allAnime);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const allTiers = { ...tierData, Unranked: unranked };
    let sourceTier = null;
    let targetTier = null;

    for (const tier in allTiers) {
      if (allTiers[tier].includes(active.id)) sourceTier = tier;
      if (allTiers[tier].includes(over.id)) targetTier = tier;
    }

    if (!sourceTier) sourceTier = "Unranked";
    if (!targetTier) targetTier = "Unranked";

    if (sourceTier === targetTier) {
      const updated = arrayMove(
        allTiers[sourceTier],
        allTiers[sourceTier].indexOf(active.id),
        allTiers[sourceTier].indexOf(over.id)
      );

      if (sourceTier === "Unranked") setUnranked(updated);
      else setTierData({ ...tierData, [sourceTier]: updated });
    } else {
      const sourceItems = [...allTiers[sourceTier]].filter(id => id !== active.id);
      const targetItems = [...allTiers[targetTier]];
      const overIndex = targetItems.indexOf(over.id);
      targetItems.splice(overIndex + 1, 0, active.id);

      if (sourceTier === "Unranked") setUnranked(sourceItems);
      else tierData[sourceTier] = sourceItems;

      if (targetTier === "Unranked") setUnranked(targetItems);
      else setTierData({ ...tierData, [targetTier]: targetItems });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>애니 티어표</h1>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <SortableTier title="Unranked" items={unranked} />
          {tiers.map(tier => (
            <SortableTier key={tier} title={tier} items={tierData[tier]} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function SortableTier({ title, items }) {
  return (
    <div style={{ minWidth: 200, border: "2px solid #ccc", borderRadius: 8, padding: 10, background: "#f9f9f9" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <SortableContext items={items} strategy={() => items}>
        {items.map(id => <SortableItem key={id} id={id} />)}
      </SortableContext>
    </div>
  );
}

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #aaa",
    borderRadius: 6,
    padding: "6px 10px",
    margin: "4px 0",
    background: "#fff",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

export default App;


