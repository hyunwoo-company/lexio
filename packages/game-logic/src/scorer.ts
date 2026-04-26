import type { Player, ChipExchange, RoundResult } from './types';

// 숫자 2 타일 개수에 따른 페널티 배율 계산 (2^n)
function getPenaltyMultiplier(twoCount: number): number {
  return Math.pow(2, twoCount);
}

// 각 플레이어의 페널티 적용 타일 수 계산
function getEffectiveTileCount(player: Player): number {
  const twoCount = player.hand.filter((t) => t.number === 2).length;
  if (twoCount === 0) return player.hand.length;
  return player.hand.length * getPenaltyMultiplier(twoCount);
}

export function calculateScoring(players: Player[]): RoundResult {
  const effectiveCounts = players.map((p) => ({
    playerId: p.id,
    tileCount: getEffectiveTileCount(p),
    penaltyMultiplier: getPenaltyMultiplier(p.hand.filter((t) => t.number === 2).length),
  }));

  const exchanges: ChipExchange[] = [];

  // 모든 플레이어 쌍에 대해 칩 교환 계산
  for (let i = 0; i < effectiveCounts.length; i++) {
    for (let j = i + 1; j < effectiveCounts.length; j++) {
      const diff = effectiveCounts[i].tileCount - effectiveCounts[j].tileCount;
      if (diff === 0) continue;

      if (diff > 0) {
        // i가 j보다 타일이 많음 → i가 j에게 diff만큼 줌
        exchanges.push({ fromId: effectiveCounts[i].playerId, toId: effectiveCounts[j].playerId, amount: diff });
      } else {
        // j가 i보다 타일이 많음 → j가 i에게 줌
        exchanges.push({ fromId: effectiveCounts[j].playerId, toId: effectiveCounts[i].playerId, amount: -diff });
      }
    }
  }

  return {
    exchanges,
    penalizedPlayers: effectiveCounts.filter((p) => p.penaltyMultiplier > 1),
  };
}

// 칩 교환을 실제 플레이어 칩에 적용
export function applyExchanges(players: Player[], exchanges: ChipExchange[]): Player[] {
  const chipMap = new Map(players.map((p) => [p.id, p.chips]));

  for (const { fromId, toId, amount } of exchanges) {
    chipMap.set(fromId, (chipMap.get(fromId) ?? 0) - amount);
    chipMap.set(toId, (chipMap.get(toId) ?? 0) + amount);
  }

  return players.map((p) => ({ ...p, chips: chipMap.get(p.id) ?? p.chips }));
}
