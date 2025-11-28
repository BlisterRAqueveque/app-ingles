import { AuthService } from '@/app/core';
import { Component, inject, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [ConfirmationService],
})
export class LoginPage {
  @Input() logoUrl = '/assets/img/logoRN-Min-Educacion-y-der-humanos.png';
  private readonly authService = inject(AuthService);

  private readonly confirmationService = inject(ConfirmationService);

  showPassword = false;

  username = '';
  password = '';

  login() {
    const credenciales = { username: this.username, password: this.password };
    this.authService.login(credenciales, true).subscribe({
      error: (err) => {
        console.error(err);
        const status = err.error.statusCode;
        switch (status) {
          case 400:
            this.showError();
            break;
          case 401:
            this.showError('Contraseña o usuario incorrectos.');
            break;
          default:
            this.showError();
            break;
        }
      },
    });
  }

  showError(message = 'Error desconocido') {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message,
      header: 'Error de acceso',
      closable: false,
      closeOnEscape: false,
      icon: 'pi pi-exclamation-triangle',
      rejectVisible: false,
      acceptButtonProps: {
        label: 'Aceptar',
      },
      accept: () => {},
    });
  }
}
