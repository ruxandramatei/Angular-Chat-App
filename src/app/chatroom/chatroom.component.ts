import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
  @ViewChild("scroller")
  private feedContainer: ElementRef;

  constructor(private chat: ChatService) { }

  ngOnInit() {
  }

  scrollToBottom(): void{
    this.feedContainer.nativeElement.scrollTop 
    = this.feedContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

}
