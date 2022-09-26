export class Network {
    private _clientId: string;
    private _isConnected: boolean = false;
    private reconnectTimeout?: number;
    private socket?: WebSocket;
    private subscribers: Set<Subsriber> = new Set();
  
    constructor() {
      this._clientId = this.getClientId();
    }
  
    public get isConnected(): boolean {
      return this._isConnected;
    }
  
    public get clientId(): string {
      return this._clientId;
    }
  
    connect = (onConnected?: () => void) => {
      (async () => {
        let ticket: string;
        try {
          ticket = await this.getConnectionTicket();
        } catch (error) {
          console.error("Unable to get a connection ticket:", error);
          setTimeout(() => this.connect(onConnected), 5000);
          return;
        }
  
        console.debug(
          !this.reconnectTimeout
            ? "Connecting to server"
            : "Reconnecting to server"
        );
        this.socket = new WebSocket(`ws://localhost:8080/?ticket=${ticket}`);
        const closeIfStuck = () => {
          if (
            this.socket &&
            this.socket?.readyState === this.socket?.CONNECTING
          ) {
            this.socket.close();
          }
        };
        setTimeout(closeIfStuck, 2000);
  
        this.socket.addEventListener("open", this.handleSocketOpen(onConnected));
        this.socket.addEventListener("message", this.handleSocketMessage);
        this.socket.addEventListener(
          "close",
          this.handleSocketClose(onConnected)
        );
        this.socket.addEventListener("error", this.handleSocketError);
      })();
    };
  
    broadcast = (message: Message) => {
      if (!this.isConnected || !this.socket) {
        console.error("Can't broadcast, not connected");
        return;
      }
  
      this.socket.send(json(message));
    };
  
    subscribe = (subscriber: Subsriber): (() => void) => {
      const unsubscribe = () => {
        this.subscribers.delete(subscriber);
      };
  
      this.subscribers.add(subscriber);
  
      return unsubscribe;
    };
  
    private getClientId = () => {
      let clientId = localStorage.getItem("ncid");
  
      if (!clientId) {
        const generateClientId = () => Math.random().toString(36).substr(2, 9);
        clientId = generateClientId();
        localStorage.setItem("ncid", clientId);
      }
  
      return clientId;
    };
  
    private getConnectionTicket = async (): Promise<string> => {
      const controller = new AbortController();
      const connectTimeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`http://localhost:8080/ticket`, {
        method: "post",
        body: json({ clientId: this.clientId }),
        headers: { "content-type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(connectTimeout);
  
      const body = await res.json();
      const ticket = body?.ticket;
      if (!ticket) {
        throw new Error("Server didn't return a connection ticket");
      }
  
      return ticket;
    };
  
    private handleSocketOpen = (onConnected?: () => void) => () => {
      console.debug(
        !this.reconnectTimeout
          ? "Connection successful"
          : "Reconnection successful"
      );
  
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
  
      onConnected?.();
    };
  
    private handleSocketMessage = (event: MessageEvent<any>) => {
      console.debug("Recieved message", event.data);
  
      try {
        const message: Message | any = JSON.parse(event.data);
        if (!message || typeof message.type !== "string") {
          throw new Error("Invalid message format");
        }
        this.subscribers.forEach((subscriber) => subscriber(message));
      } catch (e) {
        console.error("Unable to process incoming message:", e);
      }
    };
  
    private handleSocketClose =
      (onConnected?: () => void) => (event: CloseEvent) => {
        const { code, reason, wasClean } = event;
        console.log(
          "Disconnected from server:",
          code,
          `"${reason || "Check error code description"}"`,
          wasClean ? "clean" : "dirty"
        );
  
        this.reconnectTimeout = setTimeout(() => this.connect(onConnected), 5000);
      };
  
    private handleSocketError = (event: any) => {
      console.error("WS error", event);
    };
  }
  type Subsriber = (message: Message) => void;
  type Message = { type: string; payload: any };
  
  function json(object: any): string {
    return JSON.stringify(object);
  }
  