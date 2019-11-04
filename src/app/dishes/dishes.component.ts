import { InputValidators } from './../validators/sync/createForms.validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { Ingredient } from './../create-ingredient/create-ingredient.component';
import { FireDatabaseService } from './../services/fire-database.service';
import { DishesFireService, Dish, Essence, DishIngredient } from './../services/dishes-fire-service.service';
import { Component, OnInit } from '@angular/core';
import {of as observableOf, Observable} from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  isImageSelected = false;
  dishImageFile: File;
  imgSrc: any = {};
  selectedIndex=0;
  ingredients$:Ingredient[]= [];
  dishes$: Dish[] = [];
  dishForm: FormGroup;
  isImageBeingUploaded = false;
  uploadProgressNumber$: Observable<number>;

  constructor(
    private dishService: DishesFireService, 
    private ingredientService: FireDatabaseService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {

   }

  ngOnInit() {

    this.dishForm = this.formBuilder.group({
      dishImage:[null ,Validators.required],
      dishName:['',[Validators.required,InputValidators.containsRestricted],],
      dishPrice:['',[Validators.required, InputValidators.containsInvalidNumber]],
      dishEssence:['',Validators.required],
      dishIngredients:['',Validators.required]
    });
    this.getIngredients();
    // this.getDishes();
    
  }


  get dishName(){
    return this.dishForm.get('dishName')
  }

  get dishPrice(){
    return this.dishForm.get('dishPrice')
  }

  // event triggered when user selects a file for upload

  fileSelected(event){
    console.log(event);
    
    const file =<File> event.target.files[0];
    if (file){
      this.isImageSelected = true;
      const reader = new FileReader();
      reader.onload = ev => {
        this.imgSrc = reader.result;
      }
      reader.readAsDataURL(file);
      this.dishImageFile = file;
      this.dishForm.patchValue({
        dishImage: true
      })
    }
    else {
      this.isImageSelected = false;
      this.dishForm.patchValue({
        dishImage: null
      })
    }
  }


  // function to fill ingredients select form control
  getIngredients(){
    this.ingredientService.getAll()
    .pipe(
      tap(ingredients => {
        this.ingredients$ = ingredients;
      }),
      catchError(error => {
        console.error(error);
        
        return observableOf([]);
      })
    ) 
    .subscribe()
  }

  //function triggered when form is submitted


  log(val?: any){   
    
  }

  submitDish(){
    this.isImageBeingUploaded = true;
    let val = this.dishForm.value;

    let ingredients: DishIngredient[] = [];


    (val.dishIngredients as Ingredient[]).forEach(
        (item ) => {
          ingredients.push({name: item.name, key: item.key})
        }
    )


    let finalDish: Dish = {
      'name': val.dishName,
      'price': +val.dishPrice,
      'essence': val.dishEssence === "nonveg" ? Essence.nonVeg : Essence.veg,
      'ingredients': ingredients,
    }
    
    
    let taskPromise = this.dishService.create(finalDish, this.dishImageFile)
    taskPromise
    .then( results => {
        this.snackBar.open('Your dish was added!','',{duration: 1000})
    } )
    .catch( err => console.error(err) )
    .finally( () => this.isImageBeingUploaded=false )




    // this.dishService.create(finalDish, this.dishImageFile);





    // this.uploadProgressNumber$ = this.dishService.uploadProgressNumber$;
    // let events = this.dishService.statusListener$;

    // this.uploadProgressNumber$.subscribe( n =>{
    //   n === 100 ? this.isImageBeingUploaded = false : null
    // });
    // events.subscribe( s => console.log('Component',s) );
    
    
    
  }

}
