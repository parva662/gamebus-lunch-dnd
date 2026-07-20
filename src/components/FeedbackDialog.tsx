import type { GameFeedback } from '../game/useLunchGame'
import type { MenuConfig } from '../types/menu'
import { getItemById } from '../game/validation'

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

  return (
    <div className="submission-summary">
      <h3>Selected items</h3>
      <dl>
        {menu.categories.map((category) => {
          const item = getItemById(menu, feedback.result?.selections[category.id] ?? null)

          return (
            <div key={category.id}>
              <dt>{category.label}</dt>
              <dd>{item?.label ?? 'Not selected'}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
