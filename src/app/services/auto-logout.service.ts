import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
declare var require: any

const store = require('store');
const MINUTES_UNITL_AUTO_LOGOUT = 10 // in mins
const CHECK_INTERVAL = 1000 // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {

  private doCheck: boolean;

  constructor(private afAuth: AngularFireAuth, private auth: AuthService, private router: Router) {
    this.check();
    this.doCheck = true;
    this.initListener();
    this.initInterval();
  }

  get lastAction() {
    return parseInt(store.get(STORE_KEY));
  }

  set lastAction(value) {
    store.set(STORE_KEY, value);
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
  }

  reset() {
    this.lastAction = Date.now();
  }

  initInterval() {
    if (this.doCheck == true) {
      setInterval(() => {
        this.check();
      }, CHECK_INTERVAL);
    }
  }

  check() {
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        console.log('check');
        const now = Date.now();
        const timeleft = this.lastAction + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;

        if (isTimeout) {
          this.router.navigateByUrl("/login").then(() => { 
            this.doCheck = false;
            this.auth.logout();});
        }
      }
    });
  }
}
