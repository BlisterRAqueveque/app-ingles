import { throwError } from 'rxjs';

export const handleError = (err: any) => {
  // // Extraer información del error si está disponible
  // let errorMessage = {
  //   message: 'An unknown error occurred',
  //   status: 0,
  //   error: '',
  // };
  // let parseError;
  // try {
  //   parseError = JSON.parse(err);
  // } catch (error) {
  //   parseError = err;
  // }
  // if (parseError.error instanceof ErrorEvent) {
  //   // Error del lado del cliente
  //   errorMessage = {
  //     message: `Client-side error: ${parseError.error.message}`,
  //     status: 0,
  //     error: parseError.error.message,
  //   };
  // } else {
  //   // Error del lado del servidor
  //   errorMessage = {
  //     message: `Server-side error: ${parseError.status} - ${parseError.message}`,
  //     status: parseError.status,
  //     error: parseError.error
  //       ? parseError.error.message[0] ?? parseError.error.message
  //       : JSON.stringify(parseError),
  //   };
  // }
  // // Lanzar el error como un observable
  // return throwError(() => new Error(JSON.stringify(errorMessage)));
  return throwError(() => err);
};
