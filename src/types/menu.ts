export type CategoryId = string
export type MenuItemId = string

export type MenuItemType = 'food' | 'noLunch'

export interface MenuCategory {
  id: CategoryId
  label: string
  description?: string
  required: boolean
  order: number
}

export interface MenuItemRules {
  countsAsNoLunch?: boolean
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
  rules?: MenuItemRules
}

export interface MenuConfig {
  id: string
  title: string
  description?: string
  categories: MenuCategory[]
  items: MenuItem[]
}

export interface CurrentMenuConfig {
  activeMenu: string
}

export type SelectionState = Record<CategoryId, MenuItemId | null>

export interface SubmissionResult {
  gameVersion: '1.0.0'
  menuId: string
  completed: boolean
  score: number
  maxScore: number
  submittedAt: string
  selections: Record<CategoryId, MenuItemId>
}
