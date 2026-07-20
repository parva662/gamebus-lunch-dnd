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
            {menu.description ? <p>{menu.description}</p> : null}
          </div>
          <ActionButtons
            completedCount={game.completedCategoryCount}
            requiredCount={game.requiredCategoryCount}
            isSubmitting={game.isSubmitting}
            onReset={game.resetGame}
            onSubmit={() => void game.submitGame()}
          />
        </header>

        <section className="instructions" aria-label="Instructions">
          <p>Choose one option for each category. Drag cards into place, or use the Choose buttons.</p>
        </section>

        <div className="game-layout">
          <section className="choices-panel" aria-labelledby="choices-title">
            <div className="panel-heading">
              <h2 id="choices-title">Menu choices</h2>
              <p>Available cards are grouped by category.</p>
            </div>

            <div className="choice-groups">
              {menu.categories.map((category) => {
                const items = getActiveItemsForCategory(menu, category.id)

                return (
                  <section className="choice-group" key={category.id} aria-labelledby={`${category.id}-choices`}>
                    <h3 id={`${category.id}-choices`}>{category.label}</h3>
                    <div className="card-grid">
                      {items.map((item) =>
                        selectedIds.has(item.id) ? null : isNoLunchItem(item) ? (
                          <NoLunchOption key={item.id} item={item} onChoose={game.chooseItem} />
                        ) : (
                          <MenuItemCard key={item.id} item={item} onChoose={game.chooseItem} />
                        ),
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          </section>

          <section className="selection-panel" aria-labelledby="selection-title">
            <div className="panel-heading">
              <h2 id="selection-title">Your lunch menu</h2>
              <p>Each required category needs exactly one option.</p>
            </div>

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
          </section>
        </div>

        {game.feedback ? <FeedbackDialog feedback={game.feedback} onClose={game.closeFeedback} /> : null}
      </main>
    </DragDropProvider>
  )
}
