import type { CategoryId, MenuConfig, MenuItem, MenuItemId, SelectionState } from '../types/menu'

export interface InvalidSelection {
  itemId: MenuItemId
  quantity: number
  reason: string
}

export interface SubmissionValidation {
  completed: boolean
  valid: boolean
  noLunch: boolean
  selectedItemIds: MenuItemId[]
  invalidSelections: InvalidSelection[]
  messages: string[]
}

export function createEmptySelections(): SelectionState {
  return {}
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

export function getCategoryLabel(menu: MenuConfig, categoryId: CategoryId): string {
  return menu.categories.find((category) => category.id === categoryId)?.label ?? categoryId
}

export function getItemQuantity(selections: SelectionState, itemId: MenuItemId): number {
  return selections[itemId] ?? 0
}

export function getSelectedItems(menu: MenuConfig, selections: SelectionState): Array<{ item: MenuItem; quantity: number }> {
  return menu.items
    .map((item) => ({ item, quantity: getItemQuantity(selections, item.id) }))
    .filter(({ item, quantity }) => item.active && quantity > 0)
    .sort((left, right) => {
      const categoryOrder =
        (menu.categories.find((category) => category.id === left.item.categoryId)?.order ?? 0) -
        (menu.categories.find((category) => category.id === right.item.categoryId)?.order ?? 0)

      return categoryOrder === 0 ? left.item.order - right.item.order : categoryOrder
    })
}

export function getSelectedDishCount(selections: SelectionState): number {
  return Object.values(selections).filter((quantity) => quantity > 0).length
}

export function getTotalQuantity(selections: SelectionState): number {
  return Object.values(selections).reduce((total, quantity) => total + Math.max(0, quantity), 0)
}

export function isSelectableFoodItem(menu: MenuConfig, itemId: MenuItemId): boolean {
  const item = getItemById(menu, itemId)

  return Boolean(item?.active && item.itemType === 'food')
}

export function addDefaultQuantity(menu: MenuConfig, selections: SelectionState, itemId: MenuItemId): SelectionState {
  const item = getItemById(menu, itemId)

  if (!item || !isSelectableFoodItem(menu, itemId)) {
    return selections
  }

  if (getItemQuantity(selections, itemId) > 0) {
    return selections
  }

  return setItemQuantity(menu, selections, itemId, item.defaultQuantity)
}

export function changeItemQuantity(
  menu: MenuConfig,
  selections: SelectionState,
  itemId: MenuItemId,
  direction: 1 | -1,
): SelectionState {
  const item = getItemById(menu, itemId)

  if (!item || !isSelectableFoodItem(menu, itemId)) {
    return selections
  }

  const nextQuantity = getItemQuantity(selections, itemId) + item.quantityStep * direction

  return setItemQuantity(menu, selections, itemId, nextQuantity)
}

export function removeItemSelection(selections: SelectionState, itemId: MenuItemId): SelectionState {
  const nextSelections = { ...selections }
  delete nextSelections[itemId]

  return nextSelections
}

export function setItemQuantity(
  menu: MenuConfig,
  selections: SelectionState,
  itemId: MenuItemId,
  quantity: number,
): SelectionState {
  const item = getItemById(menu, itemId)

  if (!item || !isSelectableFoodItem(menu, itemId)) {
    return selections
  }

  const clampedQuantity = clampQuantity(item, quantity)

  if (clampedQuantity <= item.minQuantity) {
    return removeItemSelection(selections, itemId)
  }

  return {
    ...selections,
    [itemId]: clampedQuantity,
  }
}

export function canIncreaseQuantity(item: MenuItem, quantity: number): boolean {
  return quantity + item.quantityStep <= item.maxQuantity
}

export function canDecreaseQuantity(item: MenuItem, quantity: number): boolean {
  return quantity - item.quantityStep >= item.minQuantity
}

export function validateSubmission(
  menu: MenuConfig,
  selections: SelectionState,
  noLunchSelected: boolean,
): SubmissionValidation {
  const messages: string[] = []
  const invalidSelections: InvalidSelection[] = []
  const selectedItemIds = Object.entries(selections)
    .filter(([, quantity]) => quantity > 0)
    .map(([itemId]) => itemId)

  for (const [itemId, quantity] of Object.entries(selections)) {
    if (quantity <= 0) {
      continue
    }

    const item = getItemById(menu, itemId)

    if (!item || !item.active) {
      invalidSelections.push({ itemId, quantity, reason: 'This item is not available in the active menu.' })
      continue
    }

    if (!isValidQuantity(item, quantity)) {
      invalidSelections.push({
        itemId,
        quantity,
        reason: `${item.label} quantity must be between ${item.minQuantity} and ${item.maxQuantity} ${item.unit}.`,
      })
    }
  }

  if (noLunchSelected && selectedItemIds.length > 0) {
    invalidSelections.push({
      itemId: 'noLunch',
      quantity: 1,
      reason: 'No lunch today cannot be combined with food selections.',
    })
  }

  const hasFood = selectedItemIds.length > 0
  const completed = hasFood || noLunchSelected

  if (!completed) {
    messages.push('Choose at least one dish, or select No lunch today.')
  }

  if (invalidSelections.length > 0) {
    messages.push('Check the selected quantities and try again.')
  }

  if (completed && invalidSelections.length === 0) {
    messages.push('Lunch plan complete. Thank you for helping reduce food waste.')
  }

  return {
    completed,
    valid: completed && invalidSelections.length === 0,
    noLunch: noLunchSelected,
    selectedItemIds,
    invalidSelections,
    messages,
  }
}

function clampQuantity(item: MenuItem, quantity: number): number {
  const boundedQuantity = Math.min(item.maxQuantity, Math.max(item.minQuantity, quantity))
  const stepsFromMinimum = Math.round((boundedQuantity - item.minQuantity) / item.quantityStep)

  return item.minQuantity + stepsFromMinimum * item.quantityStep
}

function isValidQuantity(item: MenuItem, quantity: number): boolean {
  if (quantity < item.minQuantity || quantity > item.maxQuantity) {
    return false
  }

  const stepsFromMinimum = (quantity - item.minQuantity) / item.quantityStep

  return Number.isInteger(Number(stepsFromMinimum.toFixed(8)))
}
