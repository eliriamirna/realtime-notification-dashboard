import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendNotification', () => {
    it('should send POST request to correct endpoint', () => {
      const mockRequest = {
        mensagemId: 'test-123',
        conteudoMensagem: 'Teste de mensagem',
      };
      const mockResponse = {
        mensagemId: 'test-123',
        status: 'Mensagem recebida e será processada assincronamente',
      };

      service.sendNotification(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/notificar');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);

      req.flush(mockResponse);
    });

    it('should handle HTTP errors', () => {
      const mockRequest = {
        mensagemId: 'test-123',
        conteudoMensagem: 'Teste de mensagem',
      };

      service.sendNotification(mockRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/notificar');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
