import { Message, Network, Observer } from "../types";

export class AsyncLocalNetwork implements Network<Message> {
  private subscribers: Set<Observer<Message>> = new Set();
  readonly participantId = "local";

  subscribe(subscriber: Observer<Message>) {
    this.subscribers.add(subscriber);

    return {
      unsubscribe: () => {
        this.subscribers.delete(subscriber);
      },
    };
  }

  publish(message: Message) {
    for (const subscriber of this.subscribers) {
      setImmediate(() => subscriber(message));
    }
  }
}

if (import.meta.vitest) {
//   const { it, expect } = import.meta.vitest;
}
