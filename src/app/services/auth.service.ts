import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState:firebase.User = null;
  constructor(private router: Router,
    private afAuth: AngularFireAuth) { 
    this.afAuth.authState.subscribe(
      auth => {
        this.authState = auth
      }
    )

  }



              
              
  async login(email: string, password: string){
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      return Promise.resolve({ loggedIn: true });
    }
    catch (error) {
      console.error(error);
      return Promise.reject({ loggedIn: false });
    }
    
  }
  
  logout(){
    this.afAuth.auth.signOut()
    this.router.navigate(['/'])
  }


  get authenticated():boolean{
    return this.authState !== null
  }


  get currentUser(): firebase.User{
    return this.authState ? this.authState : null
  }

  get currentUserId(): string{
    return this.authState ? this.authState.uid : null
  }
}
