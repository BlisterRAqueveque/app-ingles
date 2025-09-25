import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { handleError } from '../tools/handle-error';
import { TOKEN } from '../keys/token';
import { StorageService } from './storage.service';
import { ConnectionService } from './connection.service';
import { UserService } from './user.service';

export interface CustomResponse<T> {
  ok: boolean;
  result: T;
  msg: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Login {
  password: string;
  username: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}auth/`;

  login(credenciales: Login, rememberMe: boolean, param?: Params) {
    const dir = `${this.url}login`;
    const isWeb = Capacitor.getPlatform() === 'web';
    return this.http
      .post<CustomResponse<LoginResponse>>(dir, credenciales)
      .pipe(
        catchError((err) => handleError(err)),
        map((data) => data.result),
        tap((data) => {
          if (rememberMe && !isWeb) this.saveUserFMC(data.user.id);
          this.setExpireDate(rememberMe);
          this.saveToken(data.access_token);
          this.pushNewUser(data.user);
          this.redirect(param);
        })
      );
  }
  private setExpireDate(rememberMe: boolean) {
    if (rememberMe) {
      this.storage.setStorage('expiresAt', null);
      return;
    }
    const now = Date.now();
    const expiresAt = now + 8 * 60 * 60 * 1000;

    this.storage.setStorage('expiresAt', new Date(expiresAt));
  }

  //* Inyección de el servicio de Cookies --------------------->
  private readonly storage = inject(StorageService);
  /** @description Guarda el token en las cookies */
  private async saveToken(token: string) {
    await this.storage.setToken(TOKEN, token);
  }
  /** @description Remueve el token de las cookies */
  private async removeToken() {
    await this.storage.setToken(TOKEN, '');
    await this.storage.removeStorage('expiresAt');
  }

  //* Inyección del servicio de Router para navegar ------------>
  private readonly router = inject(Router);
  async logout() {
    await this.removeToken();
    this.router.navigate(['login'], { replaceUrl: true });
  }
  /**
   * @description
   * Una vez que pasa las autenticaciones, redirigimos al usuario.
   * @param param Un param en la url para redirigir a una sección específica
   * */
  private redirect(param: any) {
    if (param ? param['redirect'] : false) {
      const ruta = param['redirect'];
      const p = { ...param };
      delete p['redirect'];
      this.router.navigate([ruta], { queryParams: p });
    } else this.router.navigate(['home']);
  }

  //* Guardamos el estado del User -------------------------->
  private usuario = new BehaviorSubject<User | null>(null);
  /** @description Guardamos el usuario en una variable tipo Behavior Subject */
  private pushNewUser(usuario: User) {
    const { ...rest } = usuario;

    this.storage.setStorage('user', JSON.stringify(rest));

    this.usuario.next(rest as User);
  }
  private readonly connection = inject(ConnectionService);
  /**
   * @description Retorna la información del usuario
   * @returns Información del usuario
   */
  async returnUserInfo(): Promise<User | null> {
    const direction = `${this.url}info`;
    const hasConnection = await firstValueFrom(this.connection.connected);

    if (!hasConnection) {
      const storedUser = await firstValueFrom(this.storage.getStorage('user'));
      return storedUser ? JSON.parse(storedUser) : null;
    }

    try {
      //* Obtener la información del usuario, ya sea desde el observable local o desde la API
      const userData = await firstValueFrom(this.getUserData(direction));
      return userData;
    } catch (error) {
      //* Manejar errores y cerrar sesión
      this.handleLogout(error);
      return null;
    }
  }
  /**
   * @description
   * Intenta obtener la información del usuario desde el observable `usuario`.
   * Si `usuario` es `null`, realiza una solicitud HTTP para obtener los datos.
   */
  private getUserData(direction: string) {
    return this.usuario.pipe(
      take(1),
      switchMap((data) =>
        data != null ? of(data) : this.fetchAndCacheUser(direction)
      )
    );
  }
  /**
   * @description
   * Realiza una solicitud HTTP para obtener los datos del usuario y
   * actualiza el observable `usuario` con el nuevo valor.
   */
  private fetchAndCacheUser(direction: string) {
    return this.http.get<CustomResponse<User>>(direction).pipe(
      map((data) => data.result),
      tap((userToken) => this.pushNewUser(userToken)),
      catchError((error) => {
        this.handleLogout(error);
        return throwError(
          () => new Error('No se pudo recuperar la información del usuario')
        );
      })
    );
  }
  /**
   * @description
   * Maneja el cierre de sesión y los errores arrojados durante la solicitud de datos.
   * Puede ampliarse para incluir más acciones de limpieza si es necesario.
   */
  private handleLogout(error?: any) {
    //! Log para más contexto del error
    console.error('Error al recuperar información de usuario:', error);
    this.logout();
  }

  //* Comprobamos el token ------------------------------------>
  checkToken(token: string) {
    const direction = `${this.url}check`;
    return this.http.post<CustomResponse<boolean>>(direction, { token }).pipe(
      catchError((e) => handleError(e)),
      map((data) => data.result)
    );
  }

  private readonly route = inject(ActivatedRoute);
  async navigateToHome() {
    //! Recordar que el parámetro para la re dirección es ?redirect=/home...
    const params = await firstValueFrom(this.route.queryParams);
    const token = await firstValueFrom(this.storage.getToken(TOKEN));
    if (token) {
      if (!params['redirect']) {
        this.router.navigate(['home']);
        return;
      }
      const ruta = params['redirect'];
      const queryParams = { ...params };
      delete queryParams['redirect'];
      this.router.navigate([ruta], { queryParams });
    }
  }

  register(data: Partial<UserService>) {
    const url = this.url + 'register';
    return this.http
      .post<CustomResponse<{ usuario: UserService; error: boolean }>>(url, data)
      .pipe(
        catchError((err) => handleError(err)),
        map((data) => {
          const d = data.result.usuario;

          return {
            error: data.result.error,
            usuario: {
              ...d,
            },
          };
        })
      );
  }

  changePassword(clave: string) {
    const url = this.url + 'changePassword';
    return this.http.put<CustomResponse<boolean>>(url, { clave }).pipe(
      catchError((err) => handleError(err)),
      map((data) => data.result)
    );
  }

  checkPass(clave: string) {
    const url = this.url + 'checkPass';
    return this.http
      .post<boolean>(url, { clave })
      .pipe(catchError((err) => handleError(err)));
  }

  private readonly usuarioService = inject(UserService);
  private async saveUserFMC(id_usuario: number) {
    const token_fcm = await firstValueFrom(
      this.storage.getStorage('push_notification_token')
    );

    this.usuarioService.update(id_usuario, { token_fcm }).subscribe((data) => {
      if (data)
        console.info('FCM_PUSH', `Token guardado correctamente ${token_fcm}`);
    });
  }
}
