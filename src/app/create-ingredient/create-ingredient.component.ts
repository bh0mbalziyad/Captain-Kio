import { FireDatabaseService } from './../fire-database.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/database';

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

  constructor(private fb: FormBuilder, public snackbar: MatSnackBar, private fireService: FireDatabaseService) { 
  }

  ngOnInit() {
    this.form = this.fb.group({
      ingName: ['', [Validators.required]],
      ingUnit: ['', [Validators.required]],
      ingQuantity: ['',[Validators.required]]
    });
  }


  submit(form: FormGroup){
    //TODO Handle ingredient submission
    let val = form.value;
    var ingredient: Ingredient = {
      name: val.ingName,
      quantity: val.ingQuantity,
      unit: val.ingUnit
    }
    this.fireService.create(ingredient);
    console.log(ingredient);
    


    this.snackbar.open(`Ingredient ${ingredient.name} created!`,'Undo',{duration: 2500})
      .onAction().
      subscribe(()=>
      {
        // TODO hanlde undo action
        console.log('Undo.');
      }
      )
    
  }

}
