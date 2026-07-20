export type CategoryId = string
export type MenuItemId = string

export type MenuItemType = 'food'

export interface MenuCategory {
  id: CategoryId
  label: string
  description?: string
  required: boolean
  order: number
}

export interface NoLunchConfig {
  enabled: boolean
  label: string
  description?: string
}

export interface MenuItem {
  id: MenuItemId
  categoryId: CategoryId
  label: string
  imagePath: string
  imageUrl: string
  altText: string
  order: number
  active: boolean
  itemType: MenuItemType
  unit: string
  minQuantity: number
  maxQuantity: number
  quantityStep: number
  defaultQuantity: number
}

export interface MenuConfig {
  id: string
  title: string
  description?: string
  noLunch: NoLunchConfig
  categories: MenuCategory[]
  items: MenuItem[]
}

export interface CurrentMenuConfig {
  activeMenu: string
}

export type SelectionState = Record<MenuItemId, number>

export interface SubmissionSelection {
  itemId: MenuItemId
  categoryId: CategoryId
  quantity: number
  unit: string
}

export interface SubmissionResult {
  gameVersion: '2.0.0'
  menuId: string
  completed: boolean
  score: number
  maxScore: number
  submittedAt: string
  noLunch: boolean
  selections: SubmissionSelection[]
}
