'use client';

import { useEffect, useMemo } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tile } from '@/components/tile/Tile';
import { useGameStore } from '@/store/gameStore';
import { NUMBER_RANK, SUIT_RANK } from '@lexio/game-logic';
import type { Tile as TileType } from '@lexio/game-logic';

interface PlayerHandProps {
  hand: TileType[];
  isMyTurn: boolean;
  sortMode?: 'number' | 'suit';
}

function SortableTile({
  tile,
  isSelected,
  onToggle,
  disabled,
}: {
  tile: TileType;
  isSelected: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tile.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' as const,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Tile
        tile={tile}
        size="sm"
        isSelected={isSelected}
        onClick={onToggle}
        disabled={disabled}
      />
    </div>
  );
}

export function PlayerHand({ hand, isMyTurn, sortMode = 'number' }: PlayerHandProps) {
  const { selectedTileIds, toggleTile, customHandOrder, setCustomHandOrder } = useGameStore();

  // 자동 정렬 (sortMode 기준)
  const autoSorted = useMemo(() => {
    const arr = [...hand];
    if (sortMode === 'number') {
      arr.sort(
        (a, b) =>
          NUMBER_RANK[a.number] - NUMBER_RANK[b.number] || SUIT_RANK[a.suit] - SUIT_RANK[b.suit]
      );
    } else {
      arr.sort(
        (a, b) =>
          SUIT_RANK[b.suit] - SUIT_RANK[a.suit] || NUMBER_RANK[a.number] - NUMBER_RANK[b.number]
      );
    }
    return arr;
  }, [hand, sortMode]);

  // customHandOrder가 hand과 mismatch면 자동 reset (게임 진행으로 패가 변하면 reset)
  useEffect(() => {
    if (customHandOrder.length === 0) return;
    const handIds = new Set(hand.map((t) => t.id));
    const orderIds = new Set(customHandOrder);
    if (handIds.size !== orderIds.size || !customHandOrder.every((id) => handIds.has(id))) {
      setCustomHandOrder([]); // 손패 변경 → 자동 정렬로 복귀
    }
  }, [hand, customHandOrder, setCustomHandOrder]);

  // 렌더 순서: customHandOrder가 있으면 그것대로, 없으면 자동 정렬
  const display = useMemo(() => {
    if (customHandOrder.length === hand.length) {
      const byId = new Map(hand.map((t) => [t.id, t]));
      return customHandOrder.map((id) => byId.get(id)).filter(Boolean) as TileType[];
    }
    return autoSorted;
  }, [autoSorted, customHandOrder, hand]);

  // 정렬 모드 변경 시 customHandOrder 비우기 (자동 정렬 복귀)
  useEffect(() => {
    if (customHandOrder.length > 0) {
      setCustomHandOrder([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = display.map((t) => t.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(ids, oldIndex, newIndex);
    setCustomHandOrder(next);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        padding: '0',
      }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={display.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
          <div
            style={
              {
                display: 'flex',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                overflowY: 'visible',
                gap: 4,
                // 위쪽 padding 충분히 → 선택/추천 lift(-10~-12px) 시 잘림 방지
                padding: '18px 12px 6px',
                maxWidth: '100vw',
                boxSizing: 'border-box',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                alignItems: 'flex-end',
              } as React.CSSProperties
            }
          >
            {display.map((tile) => (
              <SortableTile
                key={tile.id}
                tile={tile}
                isSelected={selectedTileIds.includes(tile.id)}
                onToggle={() => isMyTurn && toggleTile(tile.id)}
                disabled={!isMyTurn}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
