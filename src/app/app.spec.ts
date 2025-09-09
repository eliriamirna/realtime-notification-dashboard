import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { App } from './app';
import { NotificationService } from './services/notification.service';
import { WebsocketService } from './services/websocket.service';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['sendNotification']);
    const websocketSpy = jasmine.createSpyObj('WebsocketService', ['onStatusUpdate', 'disconnect']);
    
    websocketSpy.onStatusUpdate.and.returnValue(of());

    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationSpy },
        { provide: WebsocketService, useValue: websocketSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
