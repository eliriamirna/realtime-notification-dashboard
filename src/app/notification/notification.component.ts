import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from '../services/notification.service';
import { WebsocketService } from '../services/websocket.service';
import { NotificationItem } from '../models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
  conteudoMensagem: string = '';
  notifications: NotificationItem[] = [];
  private statusSubscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  enviarNotificacao(): void {
    if (!this.conteudoMensagem.trim()) return;

    const mensagemId = uuidv4();
    const request = {
      mensagemId,
      conteudoMensagem: this.conteudoMensagem
    };

    const newNotification: NotificationItem = {
      mensagemId,
      conteudoMensagem: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO',
      timestamp: new Date()
    };
    
    this.notifications.unshift(newNotification);

    this.notificationService.sendNotification(request).subscribe({
      next: (response) => {
// Notificação enviada com sucesso
      },
      error: (error) => {
        console.error('Erro ao enviar notificação:', error);
        const notification = this.notifications.find(n => n.mensagemId === mensagemId);
        if (notification) {
          notification.status = 'FALHA_PROCESSAMENTO';
        }
      }
    });

    this.conteudoMensagem = '';
  }

  ngOnInit(): void {
    this.statusSubscription = this.websocketService.onStatusUpdate().subscribe({
      next: (update) => {
        const notification = this.notifications.find(n => n.mensagemId === update.mensagemId);
        if (notification) {
          notification.status = update.status as NotificationItem['status'];
          this.cdr.detectChanges();
        }
      },
      error: (error) => console.error('Erro Socket.IO:', error)
    });
  }

  ngOnDestroy(): void {
    this.statusSubscription?.unsubscribe();
    this.websocketService.disconnect();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'AGUARDANDO PROCESSAMENTO': return 'status-aguardando';
      case 'PROCESSADO_SUCESSO': return 'status-sucesso';
      case 'FALHA_PROCESSAMENTO': return 'status-falha';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'AGUARDANDO PROCESSAMENTO': return 'Processando';
      case 'PROCESSADO_SUCESSO': return 'Sucesso';
      case 'FALHA_PROCESSAMENTO': return 'Falha';
      default: return status;
    }
  }
}