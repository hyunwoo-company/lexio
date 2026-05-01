'use client';

import { useMemo } from 'react';
import { Tile } from '@/components/tile/Tile';
import { useGameStore } from '@/store/gameStore';
import { NUMBER_RANK, SUIT_RANK } from '@lexio/game-logic';
import type { Tile as TileType } from '@lexio/game-logic';

interface PlayerHandProps {
  hand: TileType[];
  isMyTurn: boolean;
  sortMode?: 'number' | 'suit';
}

export function PlayerHand({ hand, isMyTurn, sortMode = 'number' }: PlayerHandProps) {
  const { selectedTileIds, toggleTile } = useGameStore();

  const sorted = useMemo(() => {
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
      <div
        style={
          {
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            gap: 4,
            padding: '8px 12px 8px',
            maxWidth: '100vw',
            boxSizing: 'border-box',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            alignItems: 'flex-end',
          } as React.CSSProperties
        }
      >
        {sorted.map((tile, i, arr) => {
          // 살짝 부채꼴: 가운데 타일이 위로 올라오는 lift 효과
          const center = (arr.length - 1) / 2;
          const offset = i - center;
          const lift = -Math.max(0, 4 - Math.abs(offset)) * 1.2;
          return (
            <div
              key={tile.id}
              style={{
                transform: `translateY(${lift}px)`,
                transition: 'transform 200ms',
              }}
            >
              <Tile
                tile={tile}
                size="sm"
                isSelected={selectedTileIds.includes(tile.id)}
                onClick={() => isMyTurn && toggleTile(tile.id)}
                disabled={!isMyTurn}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
