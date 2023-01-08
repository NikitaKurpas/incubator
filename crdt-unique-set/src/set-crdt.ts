import {
  Network,
  Message,
  Subscribable,
  Observer,
  Unsubscribable,
} from "./types";

interface SetCRDT<Tag, Element> extends Subscribable<void> {
  add(element: Element): Tag;
  delete(tag: Tag): void;
  has(tag: Tag): boolean;
  forEach(callback: (element: Element) => void): void;
  readonly size: number;
}

class NetworkSetCRDT<T> implements SetCRDT<string, T> {
  #counter: number = 1;
  #storage: Map<string, T> = new Map();
  #subscribers: Set<Observer<void>> = new Set();

  constructor(
    private network: Network<
      | { type: "add"; payload: { tag: string; element: T } }
      | { type: "delete"; payload: { tag: string } }
      | Message
    >
  ) {
    network.subscribe(this.#handleNetworkMessage);
  }

  get size() {
    return this.#storage.size;
  }

  add(element: T) {
    const tag = `${this.network.participantId}-${this.#counter++}`;
    this.network.publish({ type: "add", payload: { tag, element } });
    return tag;
  }

  delete(tag: string) {
    this.network.publish({ type: "delete", payload: { tag } });
  }

  has(tag: string) {
    return this.#storage.has(tag);
  }

  forEach(callback: (element: T) => void): void {
    for (const [, element] of this.#storage) {
      callback(element);
    }
  }

  subscribe(subscriber: Observer<void>): Unsubscribable {
    this.#subscribers.add(subscriber);
    return {
      unsubscribe: () => {
        this.#subscribers.delete(subscriber);
      },
    };
  }

  #handleNetworkMessage = (
    message:
      | { type: "add"; payload: { tag: string; element: T } }
      | { type: "delete"; payload: { tag: string } }
      | Message
  ) => {
    switch (message.type) {
      case "add":
        if (
          !("tag" in message.payload) ||
          typeof message.payload.tag !== "string" ||
          !message.payload.element
        ) {
          return;
        }

        this.#storage.set(message.payload.tag, message.payload.element);
        this.#next();
        break;
      case "delete":
        if (
          !("tag" in message.payload) ||
          typeof message.payload.tag !== "string"
        ) {
          return;
        }

        this.#storage.delete(message.payload.tag);
        this.#next();
        break;
    }
  };

  #next() {
    for (const subscriber of this.#subscribers) {
      subscriber();
    }
  }
}

if (import.meta.vitest) {
  const flushPromises = () => new Promise(setImmediate);
  
  const { it, expect } = import.meta.vitest;
  const { AsyncLocalNetwork } = await import('./__test__/local-network')

  const localNetwork = new AsyncLocalNetwork();
  const set1: SetCRDT<string, string> = new NetworkSetCRDT(localNetwork);
  const set2: SetCRDT<string, string> = new NetworkSetCRDT(localNetwork);

  it("second set should see an element added to the first set", async () => {
    // arrange
    expect.assertions(2);

    // act
    const tag = set1.add("foo");

    // assert
    set1.subscribe(() => {
      set1.forEach((elem) => console.log("2", elem));
      expect(set1.has(tag)).toBe(true);
    });
    set2.subscribe(() => {
      set2.forEach((elem) => console.log("3", elem));
      expect(set2.has(tag)).toBe(true);
    });

    await flushPromises();
  });
}
