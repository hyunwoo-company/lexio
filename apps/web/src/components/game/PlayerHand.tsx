'use client';

import { Tile } from '@/components/tile/Tile';
import { useGameStore } from '@/store/gameStore';
import type { Tile as TileType } from '@lexio/game-logic';

interface PlayerHandProps {
  hand: TileType[];
  isMyTurn: boolean;
}

export function PlayerHand({ hand, isMyTurn }: PlayerHandProps) {
  const { selectedTileIds, toggleTile } = useGameStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 0 4px' }}>
      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>내 손패 ({hand.length}개)</p>
      <div style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        gap: 4,
        padding: '8px 16px 16px',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}>
        {hand.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            size="sm"
            isSelected={selectedTileIds.includes(tile.id)}
            onClick={() => isMyTurn && toggleTile(tile.id)}
            disabled={!isMyTurn}
          />
        ))}
      </div>
    </div>
  );
}
