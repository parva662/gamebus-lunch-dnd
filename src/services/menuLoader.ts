import type { CurrentMenuConfig, MenuCategory, MenuConfig, MenuItem } from '../types/menu'

const MENU_ROOT = `${normalizeBaseUrl(import.meta.env.BASE_URL)}content/menus`

export class MenuLoadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MenuLoadError'
  }
}

export async function loadActiveMenu(): Promise<MenuConfig> {
  try {
    const current = await fetchJson<CurrentMenuConfig>(`${MENU_ROOT}/current.json`)
    assertNonEmptyString(current.activeMenu, 'current.json activeMenu')

    const menu = await fetchJson<unknown>(`${MENU_ROOT}/${current.activeMenu}/menu.json`)
    const validatedMenu = validateMenu(menu, current.activeMenu)

    await preloadImages(validatedMenu.items)

    return validatedMenu
  } catch (error) {
    console.error('Menu loading failed', getSafeErrorDetails(error))

    if (error instanceof MenuLoadError) {
      throw error
    }

    throw new MenuLoadError('The lunch menu could not be loaded. Please try again later.')
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } })

  if (!response.ok) {
    throw new MenuLoadError(`Could not load menu file: ${url}`)
  }

  return (await response.json()) as T
}

function validateMenu(raw: unknown, activeMenu: string): MenuConfig {
  if (!isRecord(raw)) {
    throw new MenuLoadError('The active menu file is not valid JSON data.')
  }

  assertNonEmptyString(raw.id, 'menu id')
  assertNonEmptyString(raw.title, 'menu title')
  assertArray(raw.categories, 'menu categories')
  assertArray(raw.items, 'menu items')

  const menuId = raw.id
  const title = raw.title

  if (menuId !== activeMenu) {
    throw new MenuLoadError('The active menu id does not match current.json.')
  }

  const categories = raw.categories.map(validateCategory).sort(byOrder)
  const categoryIds = new Set(categories.map((category) => category.id))

  if (categoryIds.size !== categories.length) {
    throw new MenuLoadError('Menu categories must have unique ids.')
  }

  const items = raw.items.map((item) => validateItem(item, menuId)).sort(byOrder)
  const itemIds = new Set(items.map((item) => item.id))

  if (itemIds.size !== items.length) {
    throw new MenuLoadError('Menu items must have unique ids.')
  }

  for (const item of items) {
    if (!categoryIds.has(item.categoryId)) {
      throw new MenuLoadError(`Menu item "${item.id}" references an unknown category.`)
    }
  }

  for (const category of categories) {
    const activeItems = items.filter((item) => item.active && item.categoryId === category.id)

    if (category.required && activeItems.length === 0) {
      throw new MenuLoadError(`Required category "${category.label}" has no active items.`)
    }
  }

  return {
    id: menuId,
    title,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    categories,
    items,
  }
}

function validateCategory(raw: unknown): MenuCategory {
  if (!isRecord(raw)) {
    throw new MenuLoadError('A menu category is not valid.')
  }

  assertNonEmptyString(raw.id, 'category id')
  assertNonEmptyString(raw.label, 'category label')
  assertBoolean(raw.required, `category "${raw.id}" required`)
  assertNumber(raw.order, `category "${raw.id}" order`)

  return {
    id: raw.id,
    label: raw.label,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    required: raw.required,
    order: raw.order,
  }
}

function validateItem(raw: unknown, menuId: string): MenuItem {
  if (!isRecord(raw)) {
    throw new MenuLoadError('A menu item is not valid.')
  }

  assertNonEmptyString(raw.id, 'item id')
  assertNonEmptyString(raw.categoryId, `item "${raw.id}" categoryId`)
  assertNonEmptyString(raw.label, `item "${raw.id}" label`)
  assertNonEmptyString(raw.imagePath, `item "${raw.id}" imagePath`)
  assertNonEmptyString(raw.altText, `item "${raw.id}" altText`)
  assertNumber(raw.order, `item "${raw.id}" order`)
  assertBoolean(raw.active, `item "${raw.id}" active`)

  if (raw.itemType !== 'food' && raw.itemType !== 'noLunch') {
    throw new MenuLoadError(`Item "${raw.id}" has an invalid itemType.`)
  }

  return {
    id: raw.id,
    categoryId: raw.categoryId,
    label: raw.label,
    imagePath: raw.imagePath,
    imageUrl: resolveMenuAssetPath(menuId, raw.imagePath),
    altText: raw.altText,
    order: raw.order,
    active: raw.active,
    itemType: raw.itemType,
    rules: isRecord(raw.rules)
      ? {
          countsAsNoLunch:
            typeof raw.rules.countsAsNoLunch === 'boolean'
              ? raw.rules.countsAsNoLunch
              : undefined,
        }
      : undefined,
  }
}

function resolveMenuAssetPath(menuId: string, imagePath: string): string {
  if (imagePath.startsWith('/') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  return `${MENU_ROOT}/${menuId}/${imagePath.replace(/^\/+/, '')}`
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

async function preloadImages(items: MenuItem[]): Promise<void> {
  await Promise.all(
    items
      .filter((item) => item.active)
      .map(
        (item) =>
          new Promise<void>((resolve, reject) => {
            const image = new Image()
            image.onload = () => resolve()
            image.onerror = () => reject(new MenuLoadError(`Could not load image for "${item.label}".`))
            image.src = item.imageUrl
          }),
      ),
  )
}

function byOrder<T extends { order: number }>(left: T, right: T): number {
  return left.order - right.order
}

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new MenuLoadError(`Missing or invalid ${label}.`)
  }
}

function assertArray(value: unknown, label: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new MenuLoadError(`Missing or invalid ${label}.`)
  }
}

function assertBoolean(value: unknown, label: string): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new MenuLoadError(`Missing or invalid ${label}.`)
  }
}

function assertNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new MenuLoadError(`Missing or invalid ${label}.`)
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getSafeErrorDetails(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    }
  }

  return {
    name: 'UnknownError',
    message: String(error),
  }
}
