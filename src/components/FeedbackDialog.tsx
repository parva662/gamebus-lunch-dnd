import type { GameFeedback } from '../game/useLunchGame'

interface FeedbackDialogProps {
  feedback: GameFeedback
  onClose: () => void
}

export function FeedbackDialog({ feedback, onClose }: FeedbackDialogProps) {
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

        {feedback.result ? (
          <pre className="feedback-dialog__result">
            {JSON.stringify(feedback.result, null, 2)}
          </pre>
        ) : null}

        <button type="button" className="button button--primary" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  )
}
