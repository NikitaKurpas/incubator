export interface Subscribable<T> {
  subscribe(subscriber: Observer<T>): Unsubscribable;
}

export interface Observer<T> {
  (value: T): void;
  // next: (value: T) => void
  // error: (err: any) => void
  // complete: () => void
}

export interface Unsubscribable {
  unsubscribe(): void;
}

export interface Publisher<T> {
  publish(message: T): void;
}

export interface Network<T extends Message>
  extends Subscribable<T>,
    Publisher<T> {
  /**
   * The current participant's ID
   */
  participantId: string;
}

export type Message = { type: string; payload: object };
