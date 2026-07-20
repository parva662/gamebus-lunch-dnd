import type { MenuItem } from '../types/menu'
import { MenuItemCard } from './MenuItemCard'

interface NoLunchOptionProps {
  item: MenuItem
  state?: 'available' | 'selected'
  onChoose: (itemId: string) => void
}

export function NoLunchOption({ item, state = 'available', onChoose }: NoLunchOptionProps) {
  return <MenuItemCard item={item} state={state} showCategory onChoose={onChoose} />
}
