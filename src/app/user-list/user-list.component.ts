import { Component } from '@angular/core';
import { User } from '../models/user.model';
import { ChatService } from '../services/chat.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  users: User[];
  temp: Observable<any>;

  constructor(chat: ChatService) {
    this.temp = chat.getUsers().valueChanges();
    this.temp.subscribe(users => {
      this.users = users
    });
  }
}
