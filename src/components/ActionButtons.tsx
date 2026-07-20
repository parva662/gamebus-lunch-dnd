interface ActionButtonsProps {
  completedCount: number
  requiredCount: number
  isSubmitting: boolean
  onReset: () => void
  onSubmit: () => void
}

export function ActionButtons({
  completedCount,
  requiredCount,
  isSubmitting,
  onReset,
  onSubmit,
}: ActionButtonsProps) {
  return (
    <div className="actions" aria-label="Game actions">
      <p aria-live="polite">
        {completedCount} of {requiredCount} categories selected
      </p>
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
