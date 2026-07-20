import { useCallback } from 'react'
import { useDroppable } from '@dnd-kit/react'
import type { MenuCategory, MenuItem } from '../types/menu'
import { MenuItemCard } from './MenuItemCard'

interface DropZoneProps {
  category: MenuCategory
  selectedItem?: MenuItem
  availableCount: number
  onClear: (categoryId: string) => void
  onDropItem: (itemId: string, categoryId: string) => void
}

export function DropZone({ category, selectedItem, availableCount, onClear, onDropItem }: DropZoneProps) {
  const { ref, isDropTarget } = useDroppable({ id: category.id })

  const setRef = useCallback(
    (element: HTMLElement | null) => {
      ref(element)
    },
    [ref],
  )

  return (
    <section
      ref={setRef}
      className="drop-zone"
      data-testid={`drop-zone-${category.id}`}
      data-complete={Boolean(selectedItem)}
      data-over={isDropTarget}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(event) => {
        event.preventDefault()
        const itemId = event.dataTransfer.getData('text/plain')

        if (itemId) {
          onDropItem(itemId, category.id)
        }
      }}
      aria-labelledby={`${category.id}-title`}
    >
      <div className="drop-zone__header">
        <div>
          <h2 id={`${category.id}-title`}>{category.label}</h2>
          {category.description ? <p>{category.description}</p> : null}
        </div>
        <span className="drop-zone__status">{selectedItem ? 'Complete' : 'Required'}</span>
      </div>

      <div className="drop-zone__target">
        {selectedItem ? (
          <>
            <MenuItemCard item={selectedItem} state="completed" compact />
            <button type="button" className="button button--secondary" onClick={() => onClear(category.id)}>
              Remove
            </button>
          </>
        ) : (
          <p className="drop-zone__empty">
            Drop a matching option here, or choose from {availableCount} options.
          </p>
        )}
      </div>
    </section>
  )
}
