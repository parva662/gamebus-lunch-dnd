interface ActionButtonsProps {
  completedCount: number
  requiredCount: number
  isSubmitting: boolean
  compact?: boolean
  onReset: () => void
  onSubmit: () => void
}

export function ActionButtons({
  completedCount,
  requiredCount,
  isSubmitting,
  compact = false,
  onReset,
  onSubmit,
}: ActionButtonsProps) {
  return (
    <div className="actions" data-compact={compact} aria-label="Game actions">
      <div className="actions__progress" aria-live="polite">
        <span>{completedCount}</span>
        <p>of {requiredCount} selected</p>
      </div>
      <div className="actions__buttons">
        <button type="button" className="button button--secondary" onClick={onReset}>
          Reset
        </button>
        <button type="button" className="button button--primary" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
