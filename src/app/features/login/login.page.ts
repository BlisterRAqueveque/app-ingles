import { AuthService } from '@/app/core';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private readonly authService = inject(AuthService);

  password = '';

  async ngOnInit() {}

  login() {
    //TODO Hacer la función de login
    throw new Error('Method not implemented.');
  }
}
