import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NativeWebsocketService {
  private ws?: WebSocket;
  private statusSubject = new Subject<{ mensagemId: string; status: string }>();

  connect(): void {
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onopen = () => {
      console.log('WebSocket nativo conectado');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensagem WebSocket recebida:', data);
        this.statusSubject.next(data);
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket nativo desconectado');
    };

    this.ws.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    };
  }

  onStatusUpdate(): Observable<{ mensagemId: string; status: string }> {
    return this.statusSubject.asObservable();
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}
