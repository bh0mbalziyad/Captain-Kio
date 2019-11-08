import { AngularFirestore } from '@angular/fire/firestore';
import { FireDatabaseService } from '../services/fire-database.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/database';
import { InputValidators } from '../validators/sync/createForms.validators';

export interface Ingredient{
  name: string;
  key?: string;
  unit: string;
  quantity?: number; 
}
@Component({
  selector: 'create-ingredient',
  templateUrl: './create-ingredient.component.html',
  styleUrls: ['./create-ingredient.component.css']
})
export class CreateIngredientComponent implements OnInit {
  
  form: FormGroup;
  units  = [
    {name: 'KG', value: 'kg'},
    {name: 'Ltrs', value: 'ltrs'},
    {name: 'Unit', value: 'unit'}
  ]

  constructor(public snackbar: MatSnackBar, private fireService: FireDatabaseService, private afs: AngularFirestore) { 
    this.form = new FormGroup({
      'ingName': new FormControl('', [Validators.required, InputValidators.containsRestricted],[InputValidators.nameExists(this.afs,'ingredients')]),
      'ingQuantity': new FormControl('', [Validators.required, InputValidators.containsInvalidNumber]),
      'ingUnit': new FormControl('', [Validators.required]),
    });
  }

  get ingName () {
    return this.form.get('ingName');
  }

  get ingQuantity () {
    return this.form.get('ingQuantity');
  }

  ngOnInit() {
    
  }


  submit(){
    //TODO Handle ingredient submission
    let val = this.form.value;
    var ingredient: Ingredient = {
      name: val.ingName,
      quantity: val.ingQuantity,
      unit: val.ingUnit
    }
    this.fireService.create(ingredient);
    this.ingName.setValue(null)
    // this.form.reset();

    this.snackbar.open(`Ingredient ${ingredient.name} created!`,'',{duration: 2500})
      .onAction().
      subscribe(()=>
      {
        // TODO hanlde undo action
        // console.log('Undo.');
        // this.form.reset();
      }
      )
    
  }

}
