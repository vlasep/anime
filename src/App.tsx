import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const tiers = ['우주명작', '명작', '재밌음', '볼만함', '쓰레기', '그냥올려놈'];

const initialAnime = [
  '리제로', '스즈메', '기생수', '데스노트', '봇치', '스파페',
];

export default function App() {
  const [tierData, setTierData] = useState(() =>
    Object.fromEntries(tiers.map(t => [t, []]))
  );
  const [unranked, setUnranked] = useState(initialAnime);
  const sensors = useSensors(useSensor(PointerSensor));

  function findContainer(id: string): string | null {
    if (unranked.includes(id)) return 'Unranked';
    for (const key of tiers) {
      if (tierData[key].includes(id)) return key;
    }
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const from = findContainer(active.id as string);
    const to = findContainer(over.id as string) || over.id;

    if (!from || !to) return;

    const fromList = from === 'Unranked' ? [...unranked] : [...tierData[from]];
    const toList = to === 'Unranked' ? [...unranked] : [...tierData[to]];

    const fromIndex = fromList.indexOf(active.id as string);
    fromList.splice(fromIndex, 1);

    const overIndex = toList.indexOf(over.id as string);
    const insertIndex = overIndex >= 0 ? overIndex : toList.length;
    toList.splice(insertIndex, 0, active.id as string);

    if (from === 'Unranked') setUnranked(fromList);
    else setTierData(prev => ({ ...prev, [from]: fromList }));

    if (to === 'Unranked') setUnranked(toList);
    else setTierData(prev => ({ ...prev, [to]: toList }));
  }

  return (
    <div style={{ padding: 20 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Tier id="Unranked" title="Unranked" items={unranked} />
          <SortableContext items={tiers} strategy={rectSortingStrategy}>
            {tiers.map(t => (
              <Tier key={t} id={t} title={t} items={tierData[t]} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}

function Tier({ id, title, items }: { id: string; title: string; items: string[] }) {
  return (
    <div>
      <h3>{title}</h3>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 50, padding: 10, background: '#f0f0f0' }}>
          {items.map(item => (
            <Item key={item} id={item} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function Item({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '6px 10px',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'grab',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}
