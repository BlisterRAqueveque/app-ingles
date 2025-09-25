import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { ConnectionService } from '../services/connection.service';
import { StorageService } from '../services/storage.service';
import { TOKEN } from '../keys/token';

export const authGuard: CanActivateFn = async (route, state) => {
  //? Inyección de dependencias
  const auth = inject(AuthService);
  const storage = inject(StorageService);
  const connection = inject(ConnectionService);

  //* Obtenemos el token
  const token = await firstValueFrom(storage.getToken(TOKEN));
  //! Si no existe
  if (!token) return await restrict(auth);
  //? Verificamos el token con la API y procedemos en función de la respuesta
  const isValidToken = await validateToken(auth, connection, token);
  return isValidToken ? true : await restrict(auth);
};

/** @description Valida el token llamando al servicio de autenticación. */
const validateToken = async (
  auth: AuthService,
  connection: ConnectionService,
  token: string
) => {
  const connected = await firstValueFrom(connection.connected);
  if (!connected) return true;
  try {
    //? Consultamos a nuestra API Rest
    return await firstValueFrom(auth.checkToken(token));
  } catch {
    //! En caso de error, consideramos el token como inválido
    return false;
  }
};

/** @description Pasamos el servicio, deslogeamos y retornamos false para detener la propagación de la ruta */
const restrict = async (auth: AuthService) => {
  await auth.logout();
  return false;
};
