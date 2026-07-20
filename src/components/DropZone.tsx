import { useCallback } from 'react'
import { useDroppable } from '@dnd-kit/react'
import type { MenuConfig, MenuItem, SelectionState } from '../types/menu'
import type { LunchDragWindow } from '../types/dragState'
import { getCategoryLabel, getSelectedItems } from '../game/validation'

interface DropZoneProps {
  menu: MenuConfig
  selections: SelectionState
  onDropItem: (itemId: string) => void
  onIncrease: (itemId: string) => void
  onDecrease: (itemId: string) => void
  onRemove: (itemId: string) => void
}

export function DropZone({ menu, selections, onDropItem, onIncrease, onDecrease, onRemove }: DropZoneProps) {
  const selectedItems = getSelectedItems(menu, selections)
  const { ref, isDropTarget } = useDroppable({ id: 'selection-drop-area' })

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
      data-testid="selection-drop-area"
      data-empty={selectedItems.length === 0}
      data-over={isDropTarget}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(event) => {
        event.preventDefault()
        const itemId = event.dataTransfer.getData('text/plain')

        if (itemId) {
          onDropItem(itemId)
        }
      }}
      onPointerUp={() => {
        const dragWindow = window as LunchDragWindow
        const itemId = dragWindow.__lunchDragItemId

        if (itemId) {
          onDropItem(itemId)
          delete dragWindow.__lunchDragItemId
        }
      }}
      aria-label="Drop selected lunch dishes here"
    >
      {selectedItems.length > 0 ? (
        <div className="selection-list">
          {selectedItems.map(({ item, quantity }) => (
            <SelectionRow
              key={item.id}
              item={item}
              quantity={quantity}
              categoryLabel={getCategoryLabel(menu, item.categoryId)}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <p className="drop-zone__empty">Choose an item or drag it here.</p>
      )}
    </section>
  )
}

function SelectionRow({
  item,
  quantity,
  categoryLabel,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: MenuItem
  quantity: number
  categoryLabel: string
  onIncrease: (itemId: string) => void
  onDecrease: (itemId: string) => void
  onRemove: (itemId: string) => void
}) {
  const canIncrease = quantity + item.quantityStep <= item.maxQuantity
  const canDecrease = quantity - item.quantityStep >= item.minQuantity
  const unitSingular = getSingularUnit(item.unit)

  return (
    <article className="selection-card" data-testid={`selected-${item.id}`}>
      <img src={item.imageUrl} alt="" aria-hidden="true" />
      <div className="selection-card__details">
        <p>{categoryLabel}</p>
        <h3>{item.label}</h3>
        <span>
          {quantity} {item.unit}
        </span>
      </div>
      <div className="selection-card__actions" aria-label={`${item.label} selected quantity`}>
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
        <button type="button" className="button button--secondary" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </article>
  )
}

function getSingularUnit(unit: string): string {
  return unit.endsWith('s') ? unit.slice(0, -1) : unit
}
