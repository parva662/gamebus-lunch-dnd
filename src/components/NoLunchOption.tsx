import type { MenuItem } from '../types/menu'
import { MenuItemCard } from './MenuItemCard'

interface NoLunchOptionProps {
  item: MenuItem
  onChoose: (itemId: string) => void
}

export function NoLunchOption({ item, onChoose }: NoLunchOptionProps) {
  return <MenuItemCard item={item} onChoose={onChoose} />
}
