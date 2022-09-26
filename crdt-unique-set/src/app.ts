import { Network } from "./network";

interface Network<Message> {
  participantId: string
  publish(message: Message): void;
  subscribe(subscribeer: (message: Message) => void): () => void
}

interface UniqueSetCRDT<T, E> {
  add(element: E): T;
  delete(tag: T): void;
}

class SetCRDT<T> implements UniqueSetCRDT<string, T> {
  private counter: number = 1;
  private storage: Map<string, T> = new Map();

  constructor(private network: Network<unknown>) {}

  add(element: T): string {
    const tag = `${this.network.participantId}-${this.counter++}`
    this.storage.set(tag, element);
    // TODO: broadcast
    return tag;
  }
  delete(tag: string): void {
    this.storage.delete(tag);
    // TODO: broadcast
  }

}

async function main() {
  const net = new Network();

  net.connect(() => {
    console.log('Connected to network')
    net.subscribe((message) => {
      switch (message.type) {
        case "hello": {
          const { text } = message.payload as { text: string };
          console.log(text);
          break;
        }
      }
    });

    net.broadcast({
      type: "hello",
      payload: { text: `Hello from ${net.clientId}` },
    });
  });
}

main().catch(console.error);