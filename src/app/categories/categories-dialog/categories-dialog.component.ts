import { AngularFirestore } from '@angular/fire/firestore';
import { InputValidators } from 'src/app/validators/sync/createForms.validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from './../../services/category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.css']
})
export class CategoriesDialogComponent implements OnInit {
  form: FormGroup
  constructor(
    public dialogRef: MatDialogRef<CategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category,
    public afs: AngularFirestore,
    public fb: FormBuilder,
  ) {
    let uid= firebase.auth().currentUser.uid
    console.log(uid);
    
    this.form = this.fb.group({
      // TODO replace here to show user's categories
      name: [data.name,[Validators.required],[InputValidators.EditFieldNameTaken(this.afs,data.name,`category`)]]
    })
   }


   
  get name(){
    return this.form.get('name');
  }

  ngOnInit() {
  }

  onSubmitClicked(data: Category){
    // console.log(data)
    data.name = (this.form.value.name as string);
    this.dialogRef.close(data)
  }

}
