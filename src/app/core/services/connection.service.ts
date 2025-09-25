import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  connected = new BehaviorSubject<boolean>(true);

  $connected = this.connected.asObservable();
}
