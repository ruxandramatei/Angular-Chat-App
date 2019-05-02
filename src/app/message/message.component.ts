import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ChatService } from "../services/chat.service";
import { AuthService } from "../services/auth.service";
import { ChatMessage } from "../models/chat-message.model";
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()
  chatMessage: ChatMessage;

  userName: string;
  userEmail: string;
  messageContent: string;
  timeStamp: string;
  isOwnMessage: boolean;
  ownEmail: string;
  photoUrl: string;

  constructor(private authService: AuthService, private chat: ChatService) {
    authService.authUser().subscribe(user => {
      this.ownEmail = user.email;
      this.isOwnMessage = this.ownEmail === this.userEmail;
    })
  }

  ngOnInit(chatMessage = this.chatMessage) {
    this.messageContent = chatMessage.message;
    this.userName = chatMessage.userName;
    this.userEmail = chatMessage.email;
    this.timeStamp = chatMessage.timeSent;
    this.photoUrl = chatMessage.photoUrl;
    if (this.chatMessage.email == this.chat.currentUserEmail) {
      this.userName = this.chat.currentUserName;
      this.photoUrl = this.chat.currentUserPhotoUrl;
    }
  }
}
