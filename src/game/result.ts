import type { MenuConfig, SelectionState, SubmissionResult } from '../types/menu'
import { MAX_SCORE } from './scoring'

export const GAME_VERSION = '1.0.0'

export function createSubmissionResult(
  menu: MenuConfig,
  selections: SelectionState,
  score: number,
  completed: boolean,
): SubmissionResult {
  return {
    gameVersion: GAME_VERSION,
    menuId: menu.id,
    completed,
    score,
    maxScore: MAX_SCORE,
    submittedAt: new Date().toISOString(),
    selections: Object.fromEntries(
      Object.entries(selections).filter((entry): entry is [string, string] => entry[1] !== null),
    ),
  }
}
