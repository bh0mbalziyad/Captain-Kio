import { Dish } from './../../services/dishes-fire-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { InputValidators } from 'src/app/validators/sync/createForms.validators';
import * as firebase from 'firebase/app';
import 'firebase/remote-config';  

@Component({
  selector: 'app-dish-dialog',
  templateUrl: './dish-dialog.component.html',
  styleUrls: ['./dish-dialog.component.css']
})
export class DishDialogComponent implements OnInit {
  showIngredients = false;

  constructor( public dialogRef: MatDialogRef<DishDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Dish) 
  {
    const remoteConfig  = firebase.remoteConfig();
    remoteConfig.settings = ({
      minimumFetchIntervalMillis: 3*60*60*1000,
      fetchTimeoutMillis: 5 * 1000
    })

    remoteConfig.defaultConfig = ({
      ingredients_required: false
    })

    this.showIngredients = remoteConfig.getValue('ingredients_required').asBoolean();
  }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close();
    // this.data.
  }

}
