import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { CookieService } from 'ngx-cookie-service';
import {
  catchError,
  defaultIfEmpty,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

type Keys =
  | 'push_notification_token'
  | 'x-token'
  | 'expiresAt'
  | 'user'
  | 'avatar'
  | 'findOneUser';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private isWeb = Capacitor.getPlatform() === 'web';

  private readonly cookie = inject(CookieService);

  async setStorage(key: Keys, value: any): Promise<void> {
    if (this.isWeb) localStorage.setItem(key, value);
    else Preferences.set({ key: key, value: value });
  }

  getStorage(key: Keys): Observable<any> {
    return this.isWeb
      ? of(localStorage.getItem(key))
      : from(Preferences.get({ key: key })).pipe(
          map((result) => result.value),
          catchError(() => of(undefined)),
          defaultIfEmpty(undefined)
        );
  }

  async removeStorage(key: Keys) {
    if (this.isWeb) localStorage.removeItem(key);
    else await Preferences.remove({ key: key });
  }

  clearStorage() {
    if (this.isWeb) localStorage.clear();
    else Preferences.clear();
  }

  async setToken(key: Keys, token: any) {
    if (this.isWeb) this.cookie.set(key, token, undefined, '/');
    else await Preferences.set({ key: key, value: token });
  }

  // getToken(key: Keys): Observable<any> {
  //   const token = this.isWeb ? of(this.cookie.get(key)) : this.getStorage(key);

  //   return token.pipe(
  //     catchError(() => of(undefined)), //* Case error
  //     defaultIfEmpty(undefined) //* If empty
  //   );
  // }

  getToken(key: Keys): Observable<any> {
    return this.getStorage('expiresAt').pipe(
      switchMap((expiresAt) => {
        if (expiresAt) {
          const expirationDate = new Date(expiresAt);
          if (expirationDate <= new Date()) {
            return of(null); // Si el token expiró, devolvemos null
          }
        }

        // Si no hay expiresAt o no ha expirado, obtenemos el token
        return this.isWeb ? of(this.cookie.get(key)) : this.getStorage(key);
      }),
      catchError(() => of(undefined)), //* En caso de error
      defaultIfEmpty(undefined) //* Si está vacío
    );
  }

  async removeToken(key: Keys) {
    if (this.isWeb) this.cookie.delete(key, '/');
    else await Preferences.remove({ key: key });
  }
}
