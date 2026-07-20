import type { MenuConfig, SelectionState, SubmissionResult } from '../types/menu'
import { getSelectedItems } from './validation'
import { MAX_SCORE } from './scoring'

export const GAME_VERSION = '2.0.0'

export function createSubmissionResult(
  menu: MenuConfig,
  selections: SelectionState,
  noLunchSelected: boolean,
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
    noLunch: noLunchSelected,
    selections: getSelectedItems(menu, selections).map(({ item, quantity }) => ({
      itemId: item.id,
      categoryId: item.categoryId,
      quantity,
      unit: item.unit,
    })),
  }
}
