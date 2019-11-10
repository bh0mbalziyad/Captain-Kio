import { tap, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isCheckingSubject: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  isChecking$ = this.isCheckingSubject.asObservable();
  isLoginBeingChecked: boolean = false;
  
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
    this.isCheckingSubject.next(true)
     this.auth.user.pipe(
       tap(user=>{
         user ? this.router.navigate(['/dashboard']) : this.isCheckingSubject.next(false)
       }),
       finalize(()=>this.isCheckingSubject.next(false))
     ).subscribe()
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
    this.isLoginBeingChecked = true;
    const value = this.form.value;
    this.auth.login(value.name,value.password)
    .then(()=>{
      this.snackbar.open('Login successful!',null,{duration: 1200})
      this.afterLogin()
    })
    .catch(
      err=>{
        console.log(err)
        this.snackbar.open('Invalid credentials',null,{duration:700})
        this.isLoginBeingChecked = false;
      }
    )
  }

}
