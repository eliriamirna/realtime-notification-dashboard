# Frontend - Sistema de Notificações

Interface Angular para gerenciar notificações em tempo real com WebSocket.

## Pré-requisitos

- Node.js 18+
- Angular CLI

## Configuração

### 1. Instalar Angular CLI (se não tiver)
```bash
npm install -g @angular/cli
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Executar aplicação
```bash
# Desenvolvimento
ng serve

# Produção
ng build
```

## Testes

```bash
# Testes unitários
ng test
```

## Funcionalidades

- ✅ Envio de notificações
- ✅ Lista de notificações em tempo real
- ✅ Status automático via WebSocket
- ✅ Interface moderna e responsiva

## Tecnologias

- Angular 18
- Socket.IO Client
- TypeScript
- Karma + Jasmine (Testes)
- CSS3

## Aplicação

- **Porta:** 4200
- **URL:** http://localhost:4200
- **API:** http://localhost:3000

## Como usar

1. Acesse http://localhost:4200
2. Digite uma mensagem
3. Clique em "Enviar Notificação"
4. Veja o status atualizar automaticamente atualizado via WebSocket
