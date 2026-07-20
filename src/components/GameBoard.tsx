import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react'
import type { MenuConfig } from '../types/menu'
import { getActiveItemsForCategory, getItemById, isNoLunchItem } from '../game/validation'
import type { LunchGameState } from '../game/useLunchGame'
import { ActionButtons } from './ActionButtons'
import { DropZone } from './DropZone'
import { FeedbackDialog } from './FeedbackDialog'
import { MenuItemCard } from './MenuItemCard'
import { NoLunchOption } from './NoLunchOption'

interface GameBoardProps {
  menu: MenuConfig
  game: LunchGameState
}

export function GameBoard({ menu, game }: GameBoardProps) {
  const selectedIds = new Set(Object.values(game.selections).filter(Boolean))

  function handleDragEnd(event: DragEndEvent): void {
    if (event.canceled) {
      return
    }

    const sourceId = event.operation.source?.id
    const targetId = event.operation.target?.id

    if (typeof sourceId === 'string' && typeof targetId === 'string') {
      game.placeItem(sourceId, targetId)
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <main className="app-shell">
        <header className="app-header">
          <div>
            <p className="app-header__eyebrow">University Canteen</p>
            <h1>{menu.title}</h1>
            <p>Choose one option per category.</p>
          </div>
        </header>

        <div className="game-layout">
          <section className="choices-panel" id="today-menu" aria-labelledby="choices-title">
            <div className="panel-heading">
              <h2 id="choices-title">Today&apos;s Menu</h2>
              <p>Tap Choose or drag a card into your selection.</p>
            </div>

            <div className="choice-groups">
              {menu.categories.map((category) => {
                const items = getActiveItemsForCategory(menu, category.id)

                return (
                  <section className="choice-group" key={category.id} aria-labelledby={`${category.id}-choices`}>
                    <h3 id={`${category.id}-choices`}>{category.label}</h3>
                    <div className="card-grid">
                      {items.map((item) =>
                        isNoLunchItem(item) ? (
                          <NoLunchOption
                            key={item.id}
                            item={item}
                            state={selectedIds.has(item.id) ? 'selected' : 'available'}
                            onChoose={game.chooseItem}
                          />
                        ) : (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            state={selectedIds.has(item.id) ? 'selected' : 'available'}
                            showCategory
                            onChoose={game.chooseItem}
                          />
                        ),
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          </section>

          <aside className="selection-panel" aria-labelledby="selection-title">
            <div className="panel-heading">
              <h2 id="selection-title">Your lunch menu</h2>
            </div>

            <ActionButtons
              compact
              completedCount={game.completedCategoryCount}
              requiredCount={game.requiredCategoryCount}
              isSubmitting={game.isSubmitting}
              onReset={game.resetGame}
              onSubmit={() => void game.submitGame()}
            />

            <div className="drop-zone-list">
              {menu.categories.map((category) => {
                const selectedItem = getItemById(menu, game.selections[category.id])
                const availableCount = getActiveItemsForCategory(menu, category.id).length

                return (
                  <DropZone
                    key={category.id}
                    category={category}
                    selectedItem={selectedItem}
                    availableCount={availableCount}
                    onClear={game.clearCategory}
                    onDropItem={game.placeItem}
                  />
                )
              })}
            </div>
          </aside>
        </div>

        <div className="mobile-action-bar">
          <ActionButtons
            compact
            completedCount={game.completedCategoryCount}
            requiredCount={game.requiredCategoryCount}
            isSubmitting={game.isSubmitting}
            onReset={game.resetGame}
            onSubmit={() => void game.submitGame()}
          />
        </div>

        {game.feedback?.kind === 'info' ? (
          <div className="live-status" role="status" aria-live="polite">
            <strong>{game.feedback.title}</strong>
            {game.feedback.messages.map((message) => (
              <span key={message}>{message}</span>
            ))}
          </div>
        ) : null}

        {game.feedback && game.feedback.kind !== 'info' ? (
          <FeedbackDialog feedback={game.feedback} menu={menu} onClose={game.closeFeedback} />
        ) : null}
      </main>
    </DragDropProvider>
  )
}
