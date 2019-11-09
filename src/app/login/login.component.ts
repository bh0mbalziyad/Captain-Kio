import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,) {
    this.form = this.fb.group({
      name: ['',[Validators.required]],
      password: ['',[Validators.required]]
    })
   }


  get name (){
    return this.form.get('name')
  }

  get password (){
    return this.form.get('password')
  }

  ngOnInit() {
     if (this.auth.authenticated) this.afterLogin()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.authState.unsubscribe();
    
  }

  afterLogin(){
    this.router.navigate(['/dashboard'])
  }

  onSubmitClicked(){
    const value = this.form.value;
    console.log(this.form.value)
    this.auth.login(value.name,value.password)
    .then(()=>this.afterLogin())
    .catch(
      err=>{
        console.log(err)
        this.snackbar.open('Invalid credentials',null,{duration:700})
      }
    )
  }
  //   this.afAuth.auth.signInWithEmailAndPassword(value.name as string, value.password as string)
  //   .then(
  //     credential => {
  //       this.router.navigate(['/dashboard'])
  //     }
  //   )
  //   .catch(
  //     err => {
  //       let errorCode = err.code;
  //       if ( errorCode === 'auth/invalid-email'){
  //         this.snackbar.open('Invalid email',null,{duration:1000})
  //       }
  //       else if ( errorCode === 'auth/wrong-password'){
  //         this.snackbar.open('Invalid password',null,{duration:1000})
  //       }
  //       else if (errorCode === 'auth/user-not-found') {
  //         this.snackbar.open('User not found',null,{duration:1000})
  //       }
  //       else{
  //         this.snackbar.open('An error occurred',null,{duration: 1000})
  //         console.log(err)
  //       }
  //     }
  //   )
  // }

}
