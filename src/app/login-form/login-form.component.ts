import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AutoLogoutService } from '../services/auto-logout.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  email: string;
  password: string;
  errorMsg: string;

  constructor(private authService: AuthService, private router: Router, private autoLogout: AutoLogoutService) { }

  login(){
    //console.log('login() called from login-form component');
    this.authService.login(this.email, this.password)
    .catch(error => this.errorMsg = error.message);
  }

}
