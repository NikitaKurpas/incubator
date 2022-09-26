import { Network } from "./network";

async function main() {
  const net = new Network();

  net.connect(() => {
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