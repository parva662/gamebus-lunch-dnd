import { useCallback } from 'react'
import { useDraggable } from '@dnd-kit/react'
import type { MenuItem } from '../types/menu'
import type { LunchDragWindow } from '../types/dragState'

interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  categoryLabel: string
  draggable?: boolean
  onChoose: (itemId: string) => void
  onIncrease: (itemId: string) => void
  onDecrease: (itemId: string) => void
}

export function MenuItemCard({
  item,
  quantity,
  categoryLabel,
  draggable = true,
  onChoose,
  onIncrease,
  onDecrease,
}: MenuItemCardProps) {
  const selected = quantity > 0
  const canIncrease = quantity + item.quantityStep <= item.maxQuantity
  const canDecrease = quantity - item.quantityStep >= item.minQuantity
  const unitSingular = getSingularUnit(item.unit)
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
        event.dataTransfer.effectAllowed = 'copy'
        event.dataTransfer.setData('text/plain', item.id)
      }}
      data-testid={`menu-card-${item.id}`}
      data-state={selected ? 'selected' : 'available'}
      data-dragging={isDragging}
    >
      <div className="menu-card__media">
        <img src={item.imageUrl} alt={item.altText} loading="lazy" />
      </div>
      <div className="menu-card__body">
        <div>
          <p className="menu-card__category">{categoryLabel}</p>
          <h3>{item.label}</h3>
          <p className="menu-card__meta">
            {item.unit} · max {item.maxQuantity}
          </p>
        </div>
        <div className="menu-card__actions">
          {draggable ? (
            <button ref={setHandleRef} type="button" className="button button--ghost menu-card__drag">
              Drag
            </button>
          ) : null}
          {selected ? (
            <div className="quantity-control" aria-label={`${item.label} quantity`}>
              <button
                type="button"
                className="quantity-control__button"
                onClick={() => onDecrease(item.id)}
                disabled={!canDecrease && quantity <= item.minQuantity}
                aria-label={`Remove one ${unitSingular} of ${item.label}`}
              >
                -
              </button>
              <span className="quantity-control__value" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="quantity-control__button"
                onClick={() => onIncrease(item.id)}
                disabled={!canIncrease}
                aria-label={`Add one ${unitSingular} of ${item.label}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="button button--primary"
              data-testid={`choose-${item.id}`}
              onClick={() => onChoose(item.id)}
            >
              Choose
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function getSingularUnit(unit: string): string {
  return unit.endsWith('s') ? unit.slice(0, -1) : unit
}
