import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

  user:Observable<any> = this.auth.user;

  loginWithEmailAndPassword(email:string, password:string): void{
    this.auth.signInWithEmailAndPassword(email, password);
  }

  signOut(): void{
    this.auth.signOut();
  }


 }
