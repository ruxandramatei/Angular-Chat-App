import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { ChatMessage } from "../models/chat-message.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  chatMessages: AngularFireList<ChatMessage>;
  private user: firebase.User;
  private email: string;
  public username: string;
  private oldPhotoUrl: string;
  private oldFilePath: string;
  public photoUrl: string;
  private data: Observable<any>;
  refStorage: AngularFireStorageReference;
  taskStorage: AngularFireUploadTask;
  private imgPath: string;
  private disabledSaveButton: boolean;

  urlImage: Observable<string>;
  @ViewChild('imageUser') inputImageUser: ElementRef;

  newPassword: string;
  confirmPassword: string;
  oldPassword: string;
  displayName: string;

  constructor(
    private afDb: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router,
    private afStorage: AngularFireStorage
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth != undefined && auth != null) {
        this.user = auth;
      }

      this.data = this.getUserData().valueChanges();
      this.data.subscribe(user => {
        this.username = user.displayName;
        this.displayName = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoUrl;
        this.oldPhotoUrl = user.photoUrl;
        this.oldFilePath = null;
      });
      this.disabledSaveButton = false;
    })
  }

  goBack() {
    if (this.oldFilePath != null) {
      this.afStorage.ref(this.oldFilePath).delete().toPromise().catch(error => console.log(error))
    }
    this.disabledSaveButton = false;
  }

  ngOnInit() {
  }


  onUpload(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.photoUrl = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
    this.afAuth.authState.subscribe(res => {
      if (res && res.uid) {
        const id = Math.random().toString(36).substring(2);
        const file = e.target.files[0];
        const filePath = `uploads/profile_${res.uid}_${id}`;
        this.oldFilePath = filePath;
        const ref = this.afStorage.ref(filePath);
        const task = this.afStorage.upload(filePath, file);
        task.percentageChanges();
        task.snapshotChanges().pipe(finalize(() => {
          this.urlImage = ref.getDownloadURL()
        })).subscribe();
      }
    });
  }

  private getUserData() {
    const userID = this.user.uid;
    const path = `/users/${userID}`;
    return this.afDb.object(path);
  }

  onKey(event: any) { // without type info
    this.displayName = event.target.value;
  }

  updateProfilePicture() {

    if (this.inputImageUser.nativeElement.value != "") {
      this.afAuth.authState.subscribe(res => {
        if (res && res.uid) {
          const path = `users/${res.uid}`;
          const data = {
            photoUrl: this.inputImageUser.nativeElement.value
          };
          this.afDb.object(path).update(data)
            .catch(error => console.log(error));

          // this.chatMessages = this.afDb.list("messages", ref => ref.orderByKey().limitToLast(25))
          // this.chatMessages.snapshotChanges().subscribe(messages => {
          //   messages.forEach(message => {
          //     this.chatMessages.update(`${message.key}`, data);
          //   })
          // })
        }
      });
    }
  }

  public saveChanges() {
    //this.validForm = false;
    if (this.newPassword == this.confirmPassword) {
      this.afAuth.auth.currentUser.reauthenticateWithCredential(
        auth.EmailAuthProvider.credential(
          this.email,
          this.oldPassword
        )
      ).then((resolve) => {
        this.updateProfilePicture();
        this.afAuth.auth.currentUser.updatePassword(this.newPassword).then((resolve) => {
          this.afAuth.authState.subscribe(res => {
            if (res && res.uid) {
              const path = `users/${res.uid}`
              const data = {
                displayName: this.displayName
              }
  
              this.afDb.object(path).update(data)
                .catch(error => console.log(error));
            }
          })
          }
        );

      });
      
    }
  }
}