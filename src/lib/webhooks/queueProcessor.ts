import { withRetry } from './retryLogic'

interface QueueMessage {
  id: string
  type: string
  payload: any
  retries: number
}

type MessageHandler = (message: QueueMessage) => Promise<void>

class QueueProcessor {
  private handlers = new Map<string, MessageHandler>()
  private deadLetterQueue: QueueMessage[] = []

  register(type: string, handler: MessageHandler) {
    this.handlers.set(type, handler)
  }

  async process(message: QueueMessage): Promise<void> {
    const handler = this.handlers.get(message.type)
    if (!handler) {
      console.error(`No handler for message type: ${message.type}`)
      return
    }

    try {
      await withRetry(() => handler(message))
    } catch (error) {
      console.error(`Failed to process message after retries: ${message.id}`)
      this.deadLetterQueue.push(message)
    }
  }

  getDeadLetterQueue(): QueueMessage[] {
    return this.deadLetterQueue
  }

  clearDeadLetterQueue() {
    this.deadLetterQueue = []
  }
}

export const webhookQueue = new QueueProcessor()
