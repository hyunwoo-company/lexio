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

  // 작은 vertical 버튼 공통 스타일
  const sideBtn: React.CSSProperties = {
    width: 56,
    height: 56,
    padding: 0,
    borderRadius: 12,
    border: '1px solid var(--fgg-line)',
    background: 'rgba(10,15,13,0.7)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 140ms',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 8,
        alignItems: 'stretch',
      }}
    >
      {/* 정렬 토글 (작은 ghost 버튼) */}
      {onSort && (
        <button
          onClick={onSort}
          style={{
            ...sideBtn,
            color: 'var(--fgg-text-dim)',
            fontSize: 10,
          }}
          title={`정렬: ${sortMode === 'number' ? '숫자순' : '문양순'}`}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>↕</span>
          <span style={{ letterSpacing: '0.04em' }}>
            {sortMode === 'number' ? '숫자' : '문양'}
          </span>
        </button>
      )}

      {/* 추천 (💡) */}
      <button
        onClick={handleHint}
        disabled={!isMyTurn || suggestions.length === 0}
        title={
          suggestions.length > 0
            ? `낼 수 있는 조합 ${suggestions.length}가지`
            : '낼 수 있는 조합 없음'
        }
        style={{
          ...sideBtn,
          border: `1px dashed ${
            suggestions.length > 0 && isMyTurn ? 'var(--fgg-gold)' : 'var(--fgg-line)'
          }`,
          color:
            suggestions.length > 0 && isMyTurn
              ? 'var(--fgg-gold-bright)'
              : 'var(--fgg-text-muted)',
          cursor: suggestions.length > 0 && isMyTurn ? 'pointer' : 'not-allowed',
          opacity: !isMyTurn ? 0.4 : 1,
          fontSize: 10,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>💡</span>
        <span>{isMyTurn && suggestions.length > 0 ? suggestions.length : '추천'}</span>
      </button>

      {/* 4개 경고 또는 선택 카운트 */}
      {showInvalidWarning && (
        <div
          style={{
            fontSize: 10,
            color: 'var(--fgg-jujak)',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          ⚠ 4개<br />불가
        </div>
      )}
      {selectedCount > 0 && !showInvalidWarning && (
        <div
          style={{
            fontSize: 10,
            color: 'var(--fgg-text-dim)',
            textAlign: 'center',
            fontFamily: 'var(--fgg-font-num)',
          }}
        >
          {selectedCount}개
        </div>
      )}

      {/* 패스 (큰 빨강 버튼) */}
      <button
        onClick={onPass}
        disabled={!isMyTurn}
        style={{
          ...sideBtn,
          height: 60,
          border: '1px solid #8E3540',
          background: 'linear-gradient(180deg, #5A2128 0%, #2E0F14 100%)',
          color: '#FFD0D0',
          cursor: isMyTurn ? 'pointer' : 'not-allowed',
          opacity: isMyTurn ? 1 : 0.4,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        패스
      </button>

      {/* 내기 (체크 ✓ 골드 primary) */}
      <button
        onClick={onPlay}
        disabled={!canPlay}
        title="내기"
        aria-label="내기"
        style={{
          ...sideBtn,
          height: 72,
          border: '1px solid var(--fgg-gold-deep)',
          background: canPlay
            ? 'linear-gradient(180deg, var(--fgg-gold-bright) 0%, var(--fgg-gold) 50%, var(--fgg-gold-deep) 100%)'
            : 'rgba(212,166,86,0.15)',
          color: canPlay ? '#1A1408' : 'var(--fgg-text-muted)',
          boxShadow: canPlay
            ? '0 4px 14px rgba(212, 166, 86, 0.45), inset 0 1px 0 rgba(255,255,255,0.3)'
            : 'none',
          cursor: canPlay ? 'pointer' : 'not-allowed',
          opacity: canPlay ? 1 : 0.5,
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1,
        }}
      >
        ✓
      </button>
    </div>
  );
}
