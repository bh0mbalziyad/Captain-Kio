import { Observable, of as observableOf } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  currentUser: firebase.User;
  user :Observable<firebase.User> = null;


  constructor(private router: Router,
    private afAuth: AngularFireAuth) { 
    this.user = this.afAuth.authState.pipe(
      switchMap(
        user => {
          if(user) return observableOf(user)
          else return observableOf(null)
        }
      ),
      tap(data=>this.currentUser = data)
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

}
