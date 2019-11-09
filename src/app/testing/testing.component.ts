import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,private afAuth: AngularFireAuth) {
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
  }


  onSubmitClicked(){
    const value = this.form.value;
    console.log(this.form.value)
    this.afAuth.auth.signInWithEmailAndPassword(value.name as string, value.password as string)
    .then(
      credential => {
        console.log(credential)
      }
    )
    .catch(
      err => {
        console.log(err)
      }
    )
  }

}
