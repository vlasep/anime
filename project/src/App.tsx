// src/App.tsx

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const tiers = ["S", "A", "B", "C", "D", "E", "F"];

const allAnime = [
  "피아노", "바이올린", "기타", "가야금", "칼림바"
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
    setActiveId(null);
    if (!over) return;

    const from = findContainer(active.id);
    const to = findContainer(over.id) || over.id;

    if (!from || !to) return;

    const fromList = [...(from === "Unranked" ? unranked : tierData[from])];
    const toList = [...(to === "Unranked" ? unranked : tierData[to])];

    const fromIndex = fromList.indexOf(active.id);
    fromList.splice(fromIndex, 1);

    if (from === to) {
      const overIndex = toList.indexOf(over.id);
      const newList = arrayMove(toList, fromIndex, overIndex);
      if (to === "Unranked") setUnranked(newList);
      else setTierData(prev => ({ ...prev, [to]: newList }));
    } else {
      const overIndex = toList.indexOf(over.id);
      const insertIndex = overIndex >= 0 ? overIndex : toList.length;
      toList.splice(insertIndex, 0, active.id);

      if (from === "Unranked") setUnranked(fromList);
      else setTierData(prev => ({ ...prev, [from]: fromList }));

      if (to === "Unranked") setUnranked(toList);
      else setTierData(prev => ({ ...prev, [to]: toList }));
    }
  };

  return (
    <div style={{ padding: 20, display: "flex" }}>
      <div style={{ minWidth: 150 }}>
        {tiers.map(tier => (
          <div key={tier} style={{ height: 100, display: "flex", alignItems: "center", color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            {tier}
          </div>
        ))}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div>
          {tiers.map(tier => (
            <Tier key={tier} id={tier} title={tier} items={tierData[tier]} />
          ))}
          <Tier id="Unranked" title="" items={unranked} />
        </div>
        <DragOverlay>
          {activeId ? <Item id={activeId} dragOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Tier({ id, title, items }) {
  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div style={{ minHeight: 100, marginBottom: 8, background: "#222", borderRadius: 4, padding: 10 }}>
        <h3 style={{ textAlign: "left", color: "#fff" }}>{title}</h3>
        {items.map(id => (
          <Item key={id} id={id} />
        ))}
      </div>
    </SortableContext>
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
