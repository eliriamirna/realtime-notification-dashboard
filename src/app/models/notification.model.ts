export interface NotificationRequest {
  mensagemId: string;
  conteudoMensagem: string;
}

export interface NotificationResponse {
  mensagemId: string;
  status: string;
}

export interface NotificationItem {
  mensagemId: string;
  conteudoMensagem: string;
  status: 'AGUARDANDO PROCESSAMENTO' | 'PROCESSADO_SUCESSO' | 'FALHA_PROCESSAMENTO';
  timestamp: Date;
}