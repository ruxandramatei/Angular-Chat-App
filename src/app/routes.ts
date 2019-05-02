import { Routes } from "@angular/router";
import { SignupFormComponent } from "./signup-form/signup-form.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { ChatroomComponent } from "./chatroom/chatroom.component";
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {   path: "signup", component: SignupFormComponent  },
    {   path: "login", component: LoginFormComponent  },
    {   path: "chat", component: ChatroomComponent  },
    {   path: "user/:id", component: ProfileComponent},
    {   path: "", redirectTo: "/login", pathMatch: "full"  },
]
