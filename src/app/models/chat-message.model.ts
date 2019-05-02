import { User } from './user.model';

export class ChatMessage {
    $key?: string;
    email?: string;
    userName?: string;
    message?: string;
    timeSent?: string;
    photoUrl?: string;
}