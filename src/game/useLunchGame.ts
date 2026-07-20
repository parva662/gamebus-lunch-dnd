import { useMemo, useRef, useState } from 'react'
import type { MenuConfig, MenuItemId, SelectionState, SubmissionResult } from '../types/menu'
import { createSubmissionResult } from './result'
import { calculateScore } from './scoring'
import {
  addDefaultQuantity,
  changeItemQuantity,
  createEmptySelections,
  getItemById,
  getItemQuantity,
  getSelectedDishCount,
  getTotalQuantity,
  removeItemSelection,
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
  noLunchSelected: boolean
  feedback: GameFeedback | null
  isSubmitting: boolean
  selectedDishCount: number
  totalQuantity: number
  chooseItem: (itemId: MenuItemId) => void
  dropItem: (itemId: MenuItemId) => void
  increaseItem: (itemId: MenuItemId) => void
  decreaseItem: (itemId: MenuItemId) => void
  removeItem: (itemId: MenuItemId) => void
  toggleNoLunch: () => void
  resetGame: () => void
  submitGame: () => Promise<void>
  closeFeedback: () => void
}

export function useLunchGame(menu: MenuConfig): LunchGameState {
  const [selections, setSelections] = useState<SelectionState>(() => createEmptySelections())
  const [noLunchSelected, setNoLunchSelected] = useState(false)
  const [feedback, setFeedback] = useState<GameFeedback | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const selectedDishCount = useMemo(() => getSelectedDishCount(selections), [selections])
  const totalQuantity = useMemo(() => getTotalQuantity(selections), [selections])

  function chooseItem(itemId: MenuItemId): void {
    const item = getItemById(menu, itemId)

    if (!item) {
      return
    }

    const currentQuantity = getItemQuantity(selections, itemId)

    setNoLunchSelected(false)
    setSelections((current) => addDefaultQuantity(menu, current, itemId))
    setFeedback({
      kind: 'info',
      title: currentQuantity > 0 ? `${item.label} is already selected` : `${item.label} added`,
      messages:
        currentQuantity > 0
          ? ['Use plus and minus controls to change the quantity.']
          : [`Quantity set to ${item.defaultQuantity} ${item.unit}.`],
    })
  }

  function dropItem(itemId: MenuItemId): void {
    const item = getItemById(menu, itemId)

    if (!item) {
      return
    }

    const currentQuantity = getItemQuantity(selections, itemId)

    setNoLunchSelected(false)
    setSelections((current) => addDefaultQuantity(menu, current, itemId))
    setFeedback({
      kind: 'info',
      title: currentQuantity > 0 ? `${item.label} is already selected` : `${item.label} added`,
      messages:
        currentQuantity > 0
          ? ['Dragging it again does not increase quantity. Use plus and minus controls instead.']
          : [`Quantity set to ${item.defaultQuantity} ${item.unit}.`],
    })
  }

  function increaseItem(itemId: MenuItemId): void {
    const item = getItemById(menu, itemId)

    if (!item) {
      return
    }

    setNoLunchSelected(false)
    setSelections((current) => changeItemQuantity(menu, current, itemId, 1))
  }

  function decreaseItem(itemId: MenuItemId): void {
    setSelections((current) => changeItemQuantity(menu, current, itemId, -1))
  }

  function removeItem(itemId: MenuItemId): void {
    const item = getItemById(menu, itemId)
    setSelections((current) => removeItemSelection(current, itemId))

    if (item) {
      setFeedback({
        kind: 'info',
        title: `${item.label} removed`,
        messages: ['Choose it again if you want to add it back.'],
      })
    }
  }

  function toggleNoLunch(): void {
    if (!menu.noLunch.enabled) {
      return
    }

    setNoLunchSelected((current) => {
      const nextValue = !current

      if (nextValue) {
        setSelections(createEmptySelections())
      }

      setFeedback({
        kind: 'info',
        title: nextValue ? `${menu.noLunch.label} selected` : `${menu.noLunch.label} cleared`,
        messages: nextValue
          ? ['Food selections were cleared.']
          : ['Choose dishes when you are ready.'],
      })

      return nextValue
    })
  }

  function resetGame(): void {
    setSelections(createEmptySelections())
    setNoLunchSelected(false)
    setFeedback({
      kind: 'info',
      title: 'Lunch plan reset',
      messages: ['Choose dishes or select No lunch today.'],
    })
  }

  async function submitGame(): Promise<void> {
    if (submittingRef.current) {
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)

    try {
      const validation = validateSubmission(menu, selections, noLunchSelected)
      const score = calculateScore(validation)

      if (!validation.valid) {
        setFeedback({
          kind: 'error',
          title: 'Lunch plan is not complete',
          messages: [...validation.messages, `Score: ${score} of 20.`],
        })
        return
      }

      await new Promise((resolve) => window.setTimeout(resolve, 150))

      const result = createSubmissionResult(menu, selections, noLunchSelected, score, true)
      console.log('Lunch game submission result', result)

      setFeedback({
        kind: 'success',
        title: 'Lunch plan submitted',
        messages: [`Score: ${score} of 20.`],
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
    noLunchSelected,
    feedback,
    isSubmitting,
    selectedDishCount,
    totalQuantity,
    chooseItem,
    dropItem,
    increaseItem,
    decreaseItem,
    removeItem,
    toggleNoLunch,
    resetGame,
    submitGame,
    closeFeedback,
  }
}
