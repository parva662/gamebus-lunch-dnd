export function LoadingState() {
  return (
    <main className="state-page" aria-busy="true">
      <div className="state-page__panel">
        <p className="state-page__eyebrow">Loading</p>
        <h1>Preparing today&apos;s lunch menu</h1>
        <p>Checking the active menu and images.</p>
      </div>
    </main>
  )
}
