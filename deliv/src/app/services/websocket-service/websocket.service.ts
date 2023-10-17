import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private messageSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.connect();
  }

  private connect() {

    this.socket = new WebSocket('ws://localhost:3000/websocket');

    this.socket.onopen = (event) => {
      console.log('WebSocket est ouvert.', event);
    };

    this.socket.onmessage = (event) => {
      console.log('J\'ai reçu :', event.data);
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket :', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket est fermé.', event);
    };
  }

  public send(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log('Un message a été envoyé.');
    } else {
      console.error('La connexion WebSocket n\'est pas ouverte.');
    }
  }

  public onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
