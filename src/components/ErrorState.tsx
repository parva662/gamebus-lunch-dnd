interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <main className="state-page">
      <div className="state-page__panel" role="alert">
        <p className="state-page__eyebrow">Menu unavailable</p>
        <h1>We could not load the lunch game</h1>
        <p>{message}</p>
        <button type="button" className="button button--primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    </main>
  )
}
