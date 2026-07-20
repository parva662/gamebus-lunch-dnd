import type { GameFeedback } from '../game/useLunchGame'
import type { MenuConfig } from '../types/menu'
import { getCategoryLabel, getItemById } from '../game/validation'

interface FeedbackDialogProps {
  feedback: GameFeedback
  menu: MenuConfig
  onClose: () => void
}

export function FeedbackDialog({ feedback, menu, onClose }: FeedbackDialogProps) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="feedback-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        data-kind={feedback.kind}
      >
        <div>
          <p className="feedback-dialog__eyebrow">{feedback.kind}</p>
          <h2 id="feedback-title">{feedback.title}</h2>
        </div>

        <div className="feedback-dialog__messages" aria-live="assertive">
          {feedback.messages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>

        {feedback.result ? <SubmissionSummary feedback={feedback} menu={menu} /> : null}

        <button type="button" className="button button--primary" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  )
}

function SubmissionSummary({ feedback, menu }: { feedback: GameFeedback; menu: MenuConfig }) {
  if (!feedback.result) {
    return null
  }

  if (feedback.result.noLunch) {
    return (
      <div className="submission-summary">
        <h3>Selected plan</h3>
        <p>{menu.noLunch.label}</p>
      </div>
    )
  }

  return (
    <div className="submission-summary">
      <h3>Selected dishes</h3>
      <dl>
        {feedback.result.selections.map((selection) => {
          const item = getItemById(menu, selection.itemId)
          const label = item?.label ?? selection.itemId

          return (
            <div key={selection.itemId}>
              <dt>
                {label}
                <span>{getCategoryLabel(menu, selection.categoryId)}</span>
              </dt>
              <dd>
                {selection.quantity} {selection.unit}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
