import type { CategoryId, MenuConfig, MenuItem, MenuItemId, SelectionState } from '../types/menu'

export interface InvalidSelection {
  categoryId: CategoryId
  itemId: MenuItemId
  reason: string
}

export interface SubmissionValidation {
  completed: boolean
  valid: boolean
  missingCategoryIds: CategoryId[]
  invalidSelections: InvalidSelection[]
  duplicateItemIds: MenuItemId[]
  messages: string[]
}

export function createEmptySelections(menu: MenuConfig): SelectionState {
  return Object.fromEntries(menu.categories.map((category) => [category.id, null]))
}

export function getActiveItemsForCategory(menu: MenuConfig, categoryId: CategoryId): MenuItem[] {
  return menu.items
    .filter((item) => item.active && item.categoryId === categoryId)
    .sort((left, right) => left.order - right.order)
}

export function getItemById(menu: MenuConfig, itemId: MenuItemId | null): MenuItem | undefined {
  if (itemId === null) {
    return undefined
  }

  return menu.items.find((item) => item.id === itemId)
}

export function isValidPlacement(menu: MenuConfig, itemId: MenuItemId, categoryId: CategoryId): boolean {
  const item = getItemById(menu, itemId)
  const categoryExists = menu.categories.some((category) => category.id === categoryId)

  return Boolean(item?.active && categoryExists && item.categoryId === categoryId)
}

export function applySelection(
  menu: MenuConfig,
  selections: SelectionState,
  itemId: MenuItemId,
  categoryId: CategoryId,
): SelectionState {
  if (!isValidPlacement(menu, itemId, categoryId)) {
    return selections
  }

  const nextSelections = { ...selections }

  for (const selectedCategoryId of Object.keys(nextSelections)) {
    if (nextSelections[selectedCategoryId] === itemId) {
      nextSelections[selectedCategoryId] = null
    }
  }

  nextSelections[categoryId] = itemId

  return nextSelections
}

export function removeSelection(selections: SelectionState, categoryId: CategoryId): SelectionState {
  return {
    ...selections,
    [categoryId]: null,
  }
}

export function validateSubmission(menu: MenuConfig, selections: SelectionState): SubmissionValidation {
  const messages: string[] = []
  const invalidSelections: InvalidSelection[] = []
  const missingCategoryIds = menu.categories
    .filter((category) => category.required && !selections[category.id])
    .map((category) => category.id)

  for (const [categoryId, itemId] of Object.entries(selections)) {
    if (!itemId) {
      continue
    }

    if (!isValidPlacement(menu, itemId, categoryId)) {
      invalidSelections.push({
        categoryId,
        itemId,
        reason: 'This item does not belong in that category.',
      })
    }
  }

  const selectedItemIds = Object.values(selections).filter((itemId): itemId is string => Boolean(itemId))
  const duplicateItemIds = selectedItemIds.filter(
    (itemId, index) => selectedItemIds.indexOf(itemId) !== index,
  )

  if (missingCategoryIds.length > 0) {
    const labels = missingCategoryIds.map((categoryId) => getCategoryLabel(menu, categoryId)).join(', ')
    messages.push(`Choose one option for: ${labels}.`)
  }

  if (invalidSelections.length > 0) {
    messages.push('Move each item back to its matching meal category.')
  }

  if (duplicateItemIds.length > 0) {
    messages.push('Each lunch item can only be used once.')
  }

  const completed = missingCategoryIds.length === 0
  const valid = completed && invalidSelections.length === 0 && duplicateItemIds.length === 0

  if (valid) {
    messages.push('Lunch menu complete. Thank you for helping reduce food waste.')
  }

  return {
    completed,
    valid,
    missingCategoryIds,
    invalidSelections,
    duplicateItemIds,
    messages,
  }
}

export function isNoLunchItem(item: MenuItem | undefined): boolean {
  return Boolean(item?.itemType === 'noLunch' || item?.rules?.countsAsNoLunch)
}

function getCategoryLabel(menu: MenuConfig, categoryId: CategoryId): string {
  return menu.categories.find((category) => category.id === categoryId)?.label ?? categoryId
}
