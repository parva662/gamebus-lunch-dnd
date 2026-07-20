import type { NoLunchConfig } from '../types/menu'

interface NoLunchOptionProps {
  noLunch: NoLunchConfig
  selected: boolean
  onToggle: () => void
}

export function NoLunchOption({ noLunch, selected, onToggle }: NoLunchOptionProps) {
  if (!noLunch.enabled) {
    return null
  }

  return (
    <section className="no-lunch-option" data-selected={selected} aria-labelledby="no-lunch-title">
      <div>
        <h3 id="no-lunch-title">{noLunch.label}</h3>
        {noLunch.description ? <p>{noLunch.description}</p> : null}
      </div>
      <button
        type="button"
        className={selected ? 'button button--secondary' : 'button button--ghost'}
        onClick={onToggle}
        aria-pressed={selected}
      >
        {selected ? 'Selected' : 'Choose'}
      </button>
    </section>
  )
}
