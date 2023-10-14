import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket('ws://localhost:3000/websocket');

    this.socket.onopen = (event) => {
      console.log('WebSocket est ouvert.', event);
    };

    this.socket.onmessage = (event) => {
      console.log('Message reçu :', event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket est fermé.', event);
    };
  }

  public send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log("un message a ete envoye");

    } else {
      console.error('La connexion WebSocket n\'est pas ouverte.');
    }
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
