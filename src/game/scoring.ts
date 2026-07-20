import type { SubmissionValidation } from './validation'

export const MAX_SCORE = 20

export function calculateScore(validation: SubmissionValidation): number {
  if (!validation.valid || !validation.completed) {
    return 0
  }

  if (validation.noLunch || validation.selectedItemIds.length > 0) {
    return MAX_SCORE
  }

  return 0
}
