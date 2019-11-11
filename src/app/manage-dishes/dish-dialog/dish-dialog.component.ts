import { tap } from 'rxjs/operators';
import { Category, CategoryService } from './../../services/category.service';
import { Observable } from 'rxjs';
import { Ingredient } from './../../create-ingredient/create-ingredient.component';
import { Dish } from './../../services/dishes-fire-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { InputValidators } from 'src/app/validators/sync/createForms.validators';
import * as firebase from 'firebase/app';
import 'firebase/remote-config';  
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-dish-dialog',
  templateUrl: './dish-dialog.component.html',
  styleUrls: ['./dish-dialog.component.css']
})
export class DishDialogComponent implements OnInit {
  showIngredients: boolean;
  form: FormGroup;
  categories$: Observable<Category[]>
  constructor(
    public afs: AngularFirestore,
    public fb: FormBuilder, 
    public dialogRef: MatDialogRef<DishDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Dish,
    private categoryService: CategoryService
  ) 
  {
    this.categories$ = this.categoryService.getCategories('asc','name',0,0).valueChanges()

    const remoteConfig  = firebase.remoteConfig();
    remoteConfig.settings = ({
      minimumFetchIntervalMillis: 3*60*60*1000,
      fetchTimeoutMillis: 5 * 1000
    })

    remoteConfig.defaultConfig = ({
      ingredients_required: false
    })

    this.showIngredients = remoteConfig.getValue('ingredients_required').asBoolean();
    const uid = firebase.auth().currentUser.uid
    this.form = this.fb.group({
      // TODO make changes here to show user's dishes
      name: [data.name,[Validators.required,],[InputValidators.EditFieldNameTaken(this.afs,data.name,`dishes`),]],
      price: [data.price,[Validators.required,InputValidators.containsInvalidNumber]],
      essence: [data.essence,[Validators.required]],
      ingredients: [data.ingredients,Validators.required],
      category: [data.category,[Validators.required]]
      
    })

    if(!this.showIngredients){
      this.form.removeControl('ingredients')
    }
  }

  ngOnInit() {
    
  }

  onNoClick(){
    this.dialogRef.close();
    // this.data.
  }

  onSubmitClicked(){
    let val = this.form.value
    this.data.name = val.name;
    this.data.price = val.price;
    this.data.essence = val.essence;
    this.data.ingredients = val.ingredients ? val.ingredients : null;
    this.data.category = val.category

    this.dialogRef.close(this.data);
  }

}
