// src/App.tsx

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id) => {
    if (unranked.includes(id)) return "Unranked";
    for (const tier of tiers) {
      if (tierData[tier].includes(id)) return tier;
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    setActiveId(null);

    const from = findContainer(active.id);
    const isOverItem = !tiers.includes(over.id) && over.id !== "Unranked";
    const to = isOverItem ? findContainer(over.id) : over.id;

    if (!from || !to) return;

    if (from === to) {
      const list = from === "Unranked" ? [...unranked] : [...tierData[from]];
      const oldIndex = list.indexOf(active.id);
      const newIndex = list.indexOf(over.id);
      const reordered = arrayMove(list, oldIndex, newIndex);
      if (from === "Unranked") setUnranked(reordered);
      else setTierData({ ...tierData, [from]: reordered });
    } else {
      const fromList = from === "Unranked" ? [...unranked] : [...tierData[from]];
      const toList = to === "Unranked" ? [...unranked] : [...tierData[to]];

      fromList.splice(fromList.indexOf(active.id), 1);
      const insertIndex = isOverItem ? toList.indexOf(over.id) : toList.length;
      toList.splice(insertIndex, 0, active.id);

      if (from === "Unranked") setUnranked(fromList);
      else tierData[from] = fromList;

      if (to === "Unranked") setUnranked(toList);
      else tierData[to] = toList;

      setTierData({ ...tierData });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>애니 티어표</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <Tier title="Unranked" items={unranked} />
          {tiers.map(tier => (
            <Tier key={tier} title={tier} items={tierData[tier]} />
          ))}
        </div>
        <DragOverlay>
          {activeId ? <Item id={activeId} dragOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Tier({ title, items }) {
  return (
    <div style={{ minWidth: 200, border: "2px solid #ccc", borderRadius: 8, padding: 10, background: "#f9f9f9" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <SortableContext items={items} strategy={rectSortingStrategy} id={title}>
        <div>
          {items.map(id => (
            <Item key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function Item({ id, dragOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #aaa",
    borderRadius: 6,
    padding: "6px 10px",
    margin: "4px 0",
    background: dragOverlay ? "#e0f7ff" : isDragging ? "#e0f7ff" : "#fff",
    opacity: isDragging && !dragOverlay ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

export default App;


