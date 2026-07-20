import { useCallback } from 'react'
import { useDraggable } from '@dnd-kit/react'
import type { MenuItem } from '../types/menu'
import type { LunchDragWindow } from '../types/dragState'
import { isNoLunchItem } from '../game/validation'

interface MenuItemCardProps {
  item: MenuItem
  state?: 'available' | 'selected' | 'completed'
  compact?: boolean
  draggable?: boolean
  showCategory?: boolean
  onChoose?: (itemId: string) => void
}

export function MenuItemCard({
  item,
  state = 'available',
  compact = false,
  draggable = true,
  showCategory = false,
  onChoose,
}: MenuItemCardProps) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: item.id,
    disabled: !draggable || !item.active,
  })

  const setHandleRef = useCallback(
    (element: HTMLButtonElement | null) => {
      handleRef(element)
    },
    [handleRef],
  )

  const setRootRef = useCallback(
    (element: HTMLElement | null) => {
      ref(element)
    },
    [ref],
  )

  return (
    <article
      ref={setRootRef}
      className="menu-card"
      draggable={draggable && item.active}
      onPointerDown={() => {
        if (draggable && item.active) {
          ;(window as LunchDragWindow).__lunchDragItemId = item.id
        }
      }}
      onPointerCancel={() => {
        delete (window as LunchDragWindow).__lunchDragItemId
      }}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', item.id)
      }}
      data-testid={`menu-card-${item.id}`}
      data-state={state}
      data-compact={compact}
      data-no-lunch={isNoLunchItem(item)}
      data-dragging={isDragging}
    >
      <div className="menu-card__media">
        <img src={item.imageUrl} alt={item.altText} loading="lazy" />
        {isNoLunchItem(item) ? <span className="menu-card__badge">No Lunch</span> : null}
      </div>
      <div className="menu-card__body">
        <div>
          {showCategory ? <p className="menu-card__category">{item.categoryId.replaceAll('-', ' ')}</p> : null}
          <h3>{item.label}</h3>
        </div>
        <div className="menu-card__actions">
          {draggable ? (
            <button ref={setHandleRef} type="button" className="button button--ghost">
              Drag
            </button>
          ) : null}
          {onChoose ? (
            <button
              type="button"
              className="button button--primary"
              data-testid={`choose-${item.id}`}
              onClick={() => onChoose(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onChoose(item.id)
                }
              }}
            >
              {state === 'selected' ? 'Selected' : 'Choose'}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
