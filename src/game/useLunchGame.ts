import { useMemo, useRef, useState } from 'react'
import type { CategoryId, MenuConfig, MenuItemId, SelectionState, SubmissionResult } from '../types/menu'
import { createSubmissionResult } from './result'
import { calculateScore } from './scoring'
import {
  applySelection,
  createEmptySelections,
  isValidPlacement,
  removeSelection,
  validateSubmission,
} from './validation'

export type FeedbackKind = 'info' | 'error' | 'success'

export interface GameFeedback {
  kind: FeedbackKind
  title: string
  messages: string[]
  result?: SubmissionResult
}

export interface LunchGameState {
  selections: SelectionState
  feedback: GameFeedback | null
  isSubmitting: boolean
  completedCategoryCount: number
  requiredCategoryCount: number
  chooseItem: (itemId: MenuItemId) => void
  placeItem: (itemId: MenuItemId, categoryId: CategoryId) => void
  clearCategory: (categoryId: CategoryId) => void
  resetGame: () => void
  submitGame: () => Promise<void>
  closeFeedback: () => void
}

export function useLunchGame(menu: MenuConfig): LunchGameState {
  const [selections, setSelections] = useState<SelectionState>(() => createEmptySelections(menu))
  const [feedback, setFeedback] = useState<GameFeedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const requiredCategoryCount = useMemo(
    () => menu.categories.filter((category) => category.required).length,
    [menu.categories],
  )

  const completedCategoryCount = useMemo(
    () =>
      menu.categories.filter((category) => category.required && Boolean(selections[category.id])).length,
    [menu.categories, selections],
  )

  function placeItem(itemId: MenuItemId, categoryId: CategoryId): void {
    const item = menu.items.find((candidate) => candidate.id === itemId)
    const category = menu.categories.find((candidate) => candidate.id === categoryId)

    if (!item || !category || !isValidPlacement(menu, itemId, categoryId)) {
      setFeedback({
        kind: 'error',
        title: 'That item belongs somewhere else',
        messages: ['Choose an item that matches the meal category.'],
      })
      return
    }

    setSelections((current) => applySelection(menu, current, itemId, categoryId))
    setFeedback({
      kind: 'info',
      title: `${item.label} selected`,
      messages: [`${category.label} now uses ${item.label}.`],
    })
  }

  function chooseItem(itemId: MenuItemId): void {
    const item = menu.items.find((candidate) => candidate.id === itemId)

    if (!item) {
      return
    }

    placeItem(item.id, item.categoryId)
  }

  function clearCategory(categoryId: CategoryId): void {
    const category = menu.categories.find((candidate) => candidate.id === categoryId)

    setSelections((current) => removeSelection(current, categoryId))

    if (category) {
      setFeedback({
        kind: 'info',
        title: `${category.label} cleared`,
        messages: ['Choose another option when you are ready.'],
      })
    }
  }

  function resetGame(): void {
    setSelections(createEmptySelections(menu))
    setFeedback({
      kind: 'info',
      title: 'Selections reset',
      messages: ['Start again by choosing one option for each category.'],
    })
  }

  async function submitGame(): Promise<void> {
    if (submittingRef.current) {
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)

    try {
      const validation = validateSubmission(menu, selections)
      const score = calculateScore(validation)

      if (!validation.valid) {
        setFeedback({
          kind: 'error',
          title: 'Menu is not complete yet',
          messages: [...validation.messages, `Score: ${score} of 20.`],
        })
        return
      }

      await new Promise((resolve) => window.setTimeout(resolve, 150))

      const result = createSubmissionResult(menu, selections, score, true)
      console.log('Lunch game submission result', result)

      setFeedback({
        kind: 'success',
        title: 'Submission successful',
        messages: [`Score: ${score} of 20.`, 'Your completed lunch menu is ready.'],
        result,
      })
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  function closeFeedback(): void {
    setFeedback(null)
  }

  return {
    selections,
    feedback,
    isSubmitting,
    completedCategoryCount,
    requiredCategoryCount,
    chooseItem,
    placeItem,
    clearCategory,
    resetGame,
    submitGame,
    closeFeedback,
  }
}
