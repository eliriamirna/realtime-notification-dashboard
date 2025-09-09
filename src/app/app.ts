import { Component } from '@angular/core';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-root',
  imports: [NotificationComponent],
  template: '<app-notification></app-notification>',
  styleUrl: './app.css'
})
export class App {}
