import { useCallback } from 'react'
import { useDroppable } from '@dnd-kit/react'
import type { MenuCategory, MenuItem } from '../types/menu'
import { isNoLunchItem } from '../game/validation'
import type { LunchDragWindow } from '../types/dragState'

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
      onPointerUp={() => {
        const dragWindow = window as LunchDragWindow
        const itemId = dragWindow.__lunchDragItemId

        if (itemId) {
          onDropItem(itemId, category.id)
          delete dragWindow.__lunchDragItemId
        }
      }}
      aria-labelledby={`${category.id}-title`}
    >
      <div className="drop-zone__header">
        <div>
          <h2 id={`${category.id}-title`}>{category.label}</h2>
        </div>
        <span className="drop-zone__status">{selectedItem ? 'Complete' : 'Required'}</span>
      </div>

      <div className="drop-zone__target">
        {selectedItem ? (
          <div className="selection-card">
            <img src={selectedItem.imageUrl} alt={selectedItem.altText} />
            <div>
              {isNoLunchItem(selectedItem) ? <span className="selection-card__badge">No Lunch</span> : null}
              <h3>{selectedItem.label}</h3>
              <p>Selected for {category.label}</p>
            </div>
            <div className="selection-card__actions">
              <a className="button button--ghost" href={`#${category.id}-choices`}>
                Replace
              </a>
              <button type="button" className="button button--secondary" onClick={() => onClear(category.id)}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <p className="drop-zone__empty">Choose from {availableCount} options.</p>
        )}
      </div>
    </section>
  )
}
