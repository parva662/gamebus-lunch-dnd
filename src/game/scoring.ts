import type { SubmissionValidation } from './validation'

export const MAX_SCORE = 20

export function calculateScore(validation: SubmissionValidation): number {
  return validation.valid && validation.completed ? MAX_SCORE : 0
}
