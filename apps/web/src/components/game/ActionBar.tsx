'use client';

import { useMemo, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { findPlayableCombinations, getMaxNumber } from '@/lib/suggestions';
import type { Tile } from '@lexio/game-logic';

interface ActionBarProps {
  isMyTurn: boolean;
  selectedCount: number;
  onPlay: () => void;
  onPass: () => void;
  onSort?: () => void;
  sortMode?: 'number' | 'suit';
}

export function ActionBar({
  isMyTurn,
  selectedCount,
  onPlay,
  onPass,
  onSort,
  sortMode = 'number',
}: ActionBarProps) {
  const { gameState, myId, selectTiles } = useGameStore();
  const hintIndexRef = useRef(0);

  const suggestions = useMemo(() => {
    if (!isMyTurn || !gameState || !myId) return [];
    const me = gameState.players.find((p) => p.id === myId);
    const hand = (me?.hand ?? []) as Tile[];
    if (hand.length === 0) return [];
    const maxNumber = getMaxNumber(gameState.players.length);
    return findPlayableCombinations(hand, gameState.lastPlay, maxNumber);
  }, [isMyTurn, gameState, myId]);

  const handleHint = () => {
    if (suggestions.length === 0) return;
    const idx = hintIndexRef.current % suggestions.length;
    const combo = suggestions[idx];
    selectTiles(combo.tiles.map((t) => t.id));
    hintIndexRef.current = idx + 1;
  };

  const canPlay = isMyTurn && selectedCount > 0 && selectedCount !== 4;
  const showInvalidWarning = selectedCount === 4;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 18px',
        background: 'linear-gradient(180deg, rgba(10,15,13,0.4) 0%, rgba(10,15,13,0.85) 100%)',
        borderTop: '1px solid var(--fgg-line)',
      }}
    >
      {/* 좌측: 정렬 + 추천 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {onSort && (
          <button
            onClick={onSort}
            style={{
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid var(--fgg-line)',
              background: 'transparent',
              color: 'var(--fgg-text-dim)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            ↕ {sortMode === 'number' ? '숫자순' : '문양순'}
          </button>
        )}

        <button
          onClick={handleHint}
          disabled={!isMyTurn || suggestions.length === 0}
          title={
            suggestions.length > 0 ? `낼 수 있는 조합 ${suggestions.length}가지` : '낼 수 있는 조합 없음'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            border: `1px dashed ${suggestions.length > 0 ? 'var(--fgg-gold)' : 'var(--fgg-line)'}`,
            borderRadius: 6,
            fontSize: 11,
            background: 'transparent',
            color: suggestions.length > 0 ? 'var(--fgg-gold-bright)' : 'var(--fgg-text-muted)',
            cursor: suggestions.length > 0 && isMyTurn ? 'pointer' : 'not-allowed',
            opacity: !isMyTurn ? 0.4 : 1,
          }}
        >
          <span style={{ fontSize: 13 }}>💡</span>
          {isMyTurn
            ? suggestions.length > 0
              ? `추천 ${suggestions.length}`
              : '낼 패 없음'
            : '추천'}
        </button>
      </div>

      {/* 우측: pass / play */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {showInvalidWarning && (
          <span style={{ fontSize: 11, color: 'var(--fgg-jujak)' }}>⚠ 4개는 낼 수 없습니다</span>
        )}
        {selectedCount > 0 && !showInvalidWarning && (
          <span style={{ fontSize: 11, color: 'var(--fgg-text-dim)' }}>{selectedCount}개 선택됨</span>
        )}

        <button
          onClick={onPass}
          disabled={!isMyTurn}
          style={{
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 8,
            border: '1px solid #8E3540',
            background: 'linear-gradient(180deg, #5A2128 0%, #2E0F14 100%)',
            color: '#FFD0D0',
            cursor: isMyTurn ? 'pointer' : 'not-allowed',
            opacity: isMyTurn ? 1 : 0.4,
          }}
        >
          패스
        </button>

        <button
          onClick={onPlay}
          disabled={!canPlay}
          style={{
            padding: '10px 22px',
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 8,
            border: '1px solid var(--fgg-gold-deep)',
            background: canPlay
              ? 'linear-gradient(180deg, var(--fgg-gold-bright) 0%, var(--fgg-gold) 50%, var(--fgg-gold-deep) 100%)'
              : 'rgba(212,166,86,0.15)',
            color: canPlay ? '#1A1408' : 'var(--fgg-text-muted)',
            boxShadow: canPlay
              ? '0 4px 12px rgba(212, 166, 86, 0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
              : 'none',
            cursor: canPlay ? 'pointer' : 'not-allowed',
            opacity: canPlay ? 1 : 0.5,
          }}
        >
          내기 ▸
        </button>
      </div>
    </div>
  );
}
