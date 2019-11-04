import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { InputValidators } from 'src/app/validators/sync/createForms.validators';

@Component({
  selector: 'app-dish-dialog',
  templateUrl: './dish-dialog.component.html',
  styleUrls: ['./dish-dialog.component.css']
})
export class DishDialogComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['',[Validators.required, InputValidators.containsRestricted]],
      price: ['',[Validators.required, InputValidators.containsInvalidNumber]],
      essence: ['',[Validators.required]],
      ingredients: ['',[Validators.required]]
    })
   }

  ngOnInit() {
  }


  submitDish(){}

}
