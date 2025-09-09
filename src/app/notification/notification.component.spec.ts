import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../services/notification.service';
import { WebsocketService } from '../services/websocket.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let websocketService: jasmine.SpyObj<WebsocketService>;

  beforeEach(async () => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['sendNotification']);
    const websocketSpy = jasmine.createSpyObj('WebsocketService', ['onStatusUpdate', 'disconnect']);

    await TestBed.configureTestingModule({
      imports: [NotificationComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: NotificationService, useValue: notificationSpy },
        { provide: WebsocketService, useValue: websocketSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    websocketService = TestBed.inject(WebsocketService) as jasmine.SpyObj<WebsocketService>;
    
    websocketService.onStatusUpdate.and.returnValue(of());
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enviarNotificacao', () => {
    beforeEach(() => {
      component.conteudoMensagem = 'Teste de mensagem';
    });

    it('should generate mensagemId and send notification', () => {
      const mockResponse = { mensagemId: 'test-id', status: 'Mensagem recebida' };
      notificationService.sendNotification.and.returnValue(of(mockResponse));

      const initialLength = component.notifications.length;
      
      component.enviarNotificacao();

      expect(component.notifications.length).toBe(initialLength + 1);
      expect(notificationService.sendNotification).toHaveBeenCalled();
      
      const sentRequest = notificationService.sendNotification.calls.mostRecent().args[0];
      expect(sentRequest.mensagemId).toBeDefined();
      expect(sentRequest.mensagemId.length).toBeGreaterThan(0);
      expect(sentRequest.conteudoMensagem).toBe('Teste de mensagem');
    });

    it('should add notification to list with AGUARDANDO PROCESSAMENTO status', () => {
      const mockResponse = { mensagemId: 'test-id', status: 'Mensagem recebida' };
      notificationService.sendNotification.and.returnValue(of(mockResponse));
      
      component.enviarNotificacao();
      
      const addedNotification = component.notifications[0];
      expect(addedNotification.status).toBe('AGUARDANDO PROCESSAMENTO');
      expect(addedNotification.conteudoMensagem).toBe('Teste de mensagem');
      expect(addedNotification.timestamp).toBeInstanceOf(Date);
    });

    it('should clear input after sending', () => {
      const mockResponse = { mensagemId: 'test-id', status: 'Mensagem recebida' };
      notificationService.sendNotification.and.returnValue(of(mockResponse));
      
      component.enviarNotificacao();
      
      expect(component.conteudoMensagem).toBe('');
    });

    it('should handle error and update notification status to FALHA_PROCESSAMENTO', () => {
      notificationService.sendNotification.and.returnValue(throwError('Erro de rede'));
      
      component.enviarNotificacao();
      
      const addedNotification = component.notifications[0];
      expect(addedNotification.status).toBe('FALHA_PROCESSAMENTO');
    });

    it('should not send if message is empty or whitespace', () => {
      component.conteudoMensagem = '   ';
      
      component.enviarNotificacao();
      
      expect(notificationService.sendNotification).not.toHaveBeenCalled();
      expect(component.notifications.length).toBe(0);
    });
  });

  describe('WebSocket status updates', () => {
    it('should update notification status when receiving WebSocket update', () => {
      const testMensagemId = 'test-123';
      const mockUpdate = { mensagemId: testMensagemId, status: 'PROCESSADO_SUCESSO' };
      
      // Adicionar notificação à lista
      component.notifications = [{
        mensagemId: testMensagemId,
        conteudoMensagem: 'Teste',
        status: 'AGUARDANDO PROCESSAMENTO',
        timestamp: new Date()
      }];
      
      websocketService.onStatusUpdate.and.returnValue(of(mockUpdate));
      
      component.ngOnInit();
      
      expect(component.notifications[0].status).toBe('PROCESSADO_SUCESSO');
    });
  });

  describe('getStatusClass', () => {
    it('should return correct CSS class for each status', () => {
      expect(component.getStatusClass('AGUARDANDO PROCESSAMENTO')).toBe('status-aguardando');
      expect(component.getStatusClass('PROCESSADO_SUCESSO')).toBe('status-sucesso');
      expect(component.getStatusClass('FALHA_PROCESSAMENTO')).toBe('status-falha');
      expect(component.getStatusClass('UNKNOWN')).toBe('');
    });
  });

  describe('getStatusText', () => {
    it('should return correct text for each status', () => {
      expect(component.getStatusText('AGUARDANDO PROCESSAMENTO')).toBe('Processando');
      expect(component.getStatusText('PROCESSADO_SUCESSO')).toBe('Sucesso');
      expect(component.getStatusText('FALHA_PROCESSAMENTO')).toBe('Falha');
      expect(component.getStatusText('UNKNOWN')).toBe('UNKNOWN');
    });
  });
});