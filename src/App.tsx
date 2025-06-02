import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
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

const allAnime: string[] = [
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
  const [tierData, setTierData] = useState<{ [key: string]: string[] }>(
    Object.fromEntries(tiers.map(t => [t, []]))
  );
  const [unranked, setUnranked] = useState<string[]>(allAnime);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id: string): string | null => {
    if (unranked.includes(id)) return "Unranked";
    for (const tier of tiers) {
      if (tierData[tier].includes(id)) return tier;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const from = findContainer(active.id as string);
    const to = findContainer(over.id as string) || over.id;

    if (!from || !to) return;
    if (from === to) return;

    const fromList = [...(from === "Unranked" ? unranked : tierData[from])];
    const toList = [...(to === "Unranked" ? unranked : tierData[to])];

    const fromIndex = fromList.indexOf(active.id as string);
    fromList.splice(fromIndex, 1);
    toList.push(active.id as string);

    if (from === "Unranked") setUnranked(fromList);
    else setTierData(prev => ({ ...prev, [from]: fromList }));

    if (to === "Unranked") setUnranked(toList);
    else setTierData(prev => ({ ...prev, [to]: toList }));
  };

  return (
    <div style={{ padding: 20 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={["Unranked", ...tiers]} strategy={rectSortingStrategy}>
          <Tier id="Unranked" title="Unranked" items={unranked} />
          {tiers.map((tier) => (
            <Tier key={tier} id={tier} title={tier} items={tierData[tier]} />
          ))}
        </SortableContext>
        <DragOverlay>{activeId ? <Item id={activeId} dragOverlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

function Tier({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <div>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 50, background: "#f0f0f0", borderRadius: 6, padding: 10 }}>
          {items.map((id) => (
            <Item key={id} id={id} dragOverlay={false} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function Item({ id, dragOverlay }: { id: string; dragOverlay: boolean }) {
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
