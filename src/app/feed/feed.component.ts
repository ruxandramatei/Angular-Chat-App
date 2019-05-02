import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from "../services/chat.service";
import { Observable } from "rxjs";
import { ChatMessage } from "../models/chat-message.model";
import { AngularFireList } from "angularfire2/database"

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnChanges {

  feed: Observable<ChatMessage[]>;

  constructor(private chat: ChatService) { }

  ngOnInit() {
    console.log("CALLED FEED COMPONENT");
    this.feed = this.chat.getMessages().valueChanges();
    this.feed.subscribe();
  }

  ngOnChanges() {
    this.feed = this.chat.getMessages().valueChanges();
    this.feed.subscribe();
  }

}
