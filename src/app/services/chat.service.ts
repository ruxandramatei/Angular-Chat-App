import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import * as firebase from "firebase/app";

import { ChatMessage } from "../models/chat-message.model";
import { query } from '@angular/core/src/render3';
import { User } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: firebase.User;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  username: string;
  photourl: string;
  data: Observable<any>;

  public currentUserName: string;
  public currentUserPhotoUrl;
  public currentUserEmail: string;

  constructor(
    private afDb: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth != undefined && auth != null) {
        this.user = auth;
      }

      this.data = this.getUser().valueChanges();
      this.data.subscribe(user => {
      this.username = user.displayName
      this.photourl = user.photoUrl;

      if(this.user.email == user.email){
        this.currentUserName = user.displayName;
        this.currentUserPhotoUrl = user.photoUrl;
        this.currentUserEmail = user.email;
      }
      });
    })
  }

  getUser() {
    const userID = this.user.uid;
    const path = `/users/${userID}`;
    return this.afDb.object(path);
  }

  getUsers() {
    const path = `/users`;
    return this.afDb.list(path);
  }

  sendMessage(msg: string) {
    let timeStamp;
    timeStamp = this.getTimeStamp();
    const email = this.user.email;
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      message: msg, email: email, timeSent: timeStamp,
      userName: this.username,photoUrl: this.photourl
    });
  }

  getMessages(): AngularFireList<ChatMessage> {
    return this.afDb.list("messages", ref => ref.orderByKey().limitToLast(25));
  }

  getTimeStamp(): string {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
      (now.getUTCMonth() + 1) + '/' +
      now.getUTCDate();
    const time = now.getUTCHours() + ':' +
      now.getUTCMinutes() + ':' +
      now.getUTCSeconds();
    return date + ' ' + time;
  }
}
