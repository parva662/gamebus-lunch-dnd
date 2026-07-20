interface ActionButtonsProps {
  selectedDishCount: number
  totalQuantity: number
  noLunchSelected: boolean
  isSubmitting: boolean
  compact?: boolean
  onReset: () => void
  onSubmit: () => void
}

export function ActionButtons({
  selectedDishCount,
  totalQuantity,
  noLunchSelected,
  isSubmitting,
  compact = false,
  onReset,
  onSubmit,
}: ActionButtonsProps) {
  const progressLabel = noLunchSelected
    ? 'No lunch today'
    : `${selectedDishCount} selected ${selectedDishCount === 1 ? 'dish' : 'dishes'} · ${totalQuantity} total units`

  return (
    <div className="actions" data-compact={compact} aria-label="Game actions">
      <div className="actions__progress" aria-live="polite">
        <span>{noLunchSelected ? '0' : selectedDishCount}</span>
        <p>{progressLabel}</p>
      </div>
      <div className="actions__buttons">
        <button type="button" className="button button--secondary" onClick={onReset}>
          Reset
        </button>
        <button type="button" className="button button--primary" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit my lunch'}
        </button>
      </div>
    </div>
  )
}
