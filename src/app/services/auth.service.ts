import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from "firebase/app";
import { Observable } from 'rxjs';
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<firebase.User>;
  authState: any;

  constructor(private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private router: Router) {
    this.user = afAuth.authState;
  }

  authUser() {
    return this.user;
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((resolve) => {
        const status = 'online';
        this.setUserStatus(status);
        this.router.navigate(["chat"]);
      });
  }

  logout() {
    console.log("called logout");
    const status = 'offline';
    this.setUserStatus(status);
    this.afAuth.auth.signOut();
    //this.router.navigate(['login']);
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        const status = 'online';
        const photoUrl = '';
        this.setUserData(email, displayName, status, photoUrl);
      })
      .catch(error => console.log(error));
  }

  setUserData(email: string, displayName: string, status: string, photoUrl: string): void {
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        const path = `users/${res.uid}`;
        const data = {
          email: email,
          displayName: displayName,
          status: status,
          photoUrl: photoUrl
        };

        this.afDb.object(path).update(data)
          .catch(error => console.log(error));
      }
    });
  }


  setUserStatus(status: string): void {

    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        const path = `users/${res.uid}`
        const data = {
          status: status
        }
        this.afDb.object(path).update(data)
          .catch(error => console.log(error));
      }
    });
  }
}