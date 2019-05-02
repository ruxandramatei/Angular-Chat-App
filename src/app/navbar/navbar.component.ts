import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import * as firebase from "firebase/app";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public userTemp: Observable<firebase.User>

  private user: firebase.User;
  private data: Observable<any>;
  private username: string;
  private userPhotoUrl: string;

  constructor(private authService: AuthService, private afDb: AngularFireDatabase,
    private afAuth: AngularFireAuth) {
    this.userTemp = this.authService.authUser();
    this.userTemp.subscribe(user => {
      if (user) {
        this.afAuth.authState.subscribe(auth => {
          if (auth != undefined && auth != null) {
            this.user = auth;
          }
          this.data = this.getUserData().valueChanges();
          this.data.subscribe(user => {
            this.username = user.displayName;
            this.userPhotoUrl = user.photoUrl;
          }
          );
        })
      }
    })
  }

  ngOnInit() {
    this.userTemp = this.authService.authUser();
    this.userTemp.subscribe(user => {
      if (user) {
        this.afAuth.authState.subscribe(auth => {
          if (auth != undefined && auth != null) {
            this.user = auth;
          }
          this.data = this.getUserData().valueChanges();
          this.data.subscribe(user => {
            this.username = user.displayName;
            this.userPhotoUrl = user.photoUrl;
          });
        })
      }
    })
  }

  private getUserData() {
    const userID = this.user.uid;
    const path = `/users/${userID}`;
    return this.afDb.object(path);
  }
}

