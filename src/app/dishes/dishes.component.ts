import { catchError, tap } from 'rxjs/operators';
import { Ingredient } from './../create-ingredient/create-ingredient.component';
import { FireDatabaseService } from './../services/fire-database.service';
import { DishesFireService, Dish, Essence } from './../services/dishes-fire-service.service';
import { Component, OnInit } from '@angular/core';
import {of as observableOf, Observable} from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { read } from 'fs';


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  isImageSelected = false;
  dishImageFile: File;
  imgSrc: any = {};
  selectedIndex=1;
  ingredients$:Ingredient[]= [];
  dishes$: Dish[] = [];
  dishForm: FormGroup;
  isImageBeingUploaded = false;
  uploadProgressNumber$: Observable<number>;

  constructor(
    private dishService: DishesFireService, 
    private ingredientService: FireDatabaseService,
    private formBuilder: FormBuilder,
  ) {

   }

  ngOnInit() {

    this.dishForm = this.formBuilder.group({
      dishImage:[null ,Validators.required],
      dishName:['',Validators.required],
      dishPrice:['',Validators.required],
      dishEssence:['',Validators.required],
      dishIngredients:['',Validators.required]
    });
    this.getIngredients();
    // this.getDishes();
    
  }

  // event triggered when user selects a file for upload

  fileSelected(event){
    console.log(event);
    
    const file =<File> event.target.files[0];
    if (file){
      this.isImageSelected = true;
      const reader = new FileReader();
      reader.onload = e => {
        this.imgSrc = e.target.result;
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

  submitDish(form: FormGroup){
    this.isImageBeingUploaded = true;
    let val = form.value;
    let finalDish: Dish = {
      name: val.dishName,
      price: +val.dishPrice,
      essence: val.dishEssence === "nonveg" ? Essence.nonVeg : Essence.veg,
      ingredientKeys: val.dishIngredients,
    }

    this.dishService.create(finalDish, this.dishImageFile);
    this.uploadProgressNumber$ = this.dishService.uploadProgressNumber$;
    let events = this.dishService.statusListener$;

    this.uploadProgressNumber$.subscribe( n =>{
      n === 100 ? this.isImageBeingUploaded = false : null
    });
    events.subscribe( s => console.log('Component',s) );
    
    
    
  }

}
