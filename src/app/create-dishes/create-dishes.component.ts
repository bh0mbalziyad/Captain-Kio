import { Category, CategoryService } from './../services/category.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { InputValidators } from '../validators/sync/createForms.validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap, map } from 'rxjs/operators';
import { Ingredient } from '../create-ingredient/create-ingredient.component';
import { FireDatabaseService } from '../services/fire-database.service';
import { DishesFireService, Dish, Essence, DishIngredient } from '../services/dishes-fire-service.service';
import { Component, OnInit } from '@angular/core';
import {of as observableOf, Observable} from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/remote-config' 
import { MatTabChangeEvent } from '@angular/material';


@Component({
  selector: 'app-dishes',
  templateUrl: './create-dishes.component.html',
  styleUrls: ['./create-dishes.component.css']
})
export class CreateDishesComponent implements OnInit {
  isImageSelected = false;
  isVideoSelected = false;
  dishImageFile: File;
  dishVideoFile: File;
  imgSrc: any = {};
  videoSrc: any = {};
  selectedIndex=0;
  ingredients$:Ingredient[]= [];
  categories$: Observable<Category[]>;
  dishes$: Dish[] = [];
  dishForm: FormGroup;
  isImageBeingUploaded = false;
  isVideoBeingUploaded = false;
  uploadProgressNumber$: Observable<number>;
  showIngredients: boolean = true;

  constructor(
    private dishService: DishesFireService, 
    private ingredientService: FireDatabaseService,
    private categoryService: CategoryService,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {

   }

  ngOnInit() {
    const remoteConfig = firebase.remoteConfig()
    remoteConfig.settings = {
      minimumFetchIntervalMillis:  3 * 60 * 60 * 1000,
      fetchTimeoutMillis: 5 * 1000,
    }

    remoteConfig.defaultConfig = ({
      ingredients_required: false,
    })

    this.route.queryParamMap.subscribe(
      route => this.selectedIndex = +route.get('tab')
    )

    this.showIngredients = remoteConfig.getValue('ingredients_required').asBoolean();

    this.dishForm = this.formBuilder.group({
      dishImage:[null ,Validators.required],
      dishName:['',[Validators.required,InputValidators.containsRestricted],[InputValidators.nameExists(this.afs,this.dishService.collectionName)]],
      dishPrice:['',[Validators.required, InputValidators.containsInvalidNumber]],
      dishEssence:['',Validators.required],
      dishIngredients:['',Validators.required],
      dishVideo:[null,[Validators.required]],
      dishCategory: ['',[Validators.required]],
      dishDescription: ['',[Validators.required]],
    });

    this.categories$ = this.categoryService.getCategories('asc','name',0,0)
    .snapshotChanges()
    .pipe(
      map(
        data => {
          return data.map(
            a=>{
              let val: Category = {
                name: a.payload.doc.data().name,
                key: a.payload.doc.id
              }
              return val;
            }
          )
        }
      )
    )

    if(this.showIngredients){
      
      this.getIngredients();
    }else{
      this.dishForm.removeControl('dishIngredients');
    }
     
    
  }


  tabChange(event : MatTabChangeEvent){
      this.selectedIndex = event.index;
  }


  get dishName(){
    return this.dishForm.get('dishName')
  }

  get dishPrice(){
    return this.dishForm.get('dishPrice')
  }

  // event triggered when user selects a file for upload

  imageFileSelected(event){
    // console.log(event);
    
    const file =<File> event.target.files[0];
    console.log(file);
    
    if (file && file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'){
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
      this.dishImageFile = null;
      this.isImageSelected = false;
      this.dishForm.patchValue({
        dishImage: null,
        
      })
    }
  }


  videoFileSelected(event){
    const file: File = event.target.files[0];
    console.log(file);
    
    if(file && file.type === 'video/mp4'){
      this.dishVideoFile = file;
      this.isVideoSelected = true;
      this.videoSrc = file.name as string;
      this.dishForm.patchValue({
        dishVideo: true
      })
    }
    else{
      this.dishVideoFile = null;
      this.isVideoSelected = false;
      this.dishForm.patchValue({
        dishVideo: null
      })
    }
  }


  // function to fill ingredients select form control
  getIngredients(){
    this.ingredientService.getAll('asc')
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
  submitDish(){
    this.isImageBeingUploaded = true;
    let val = this.dishForm.value;
    let ingredients: DishIngredient[] = [];

    if(this.showIngredients){
      (val.dishIngredients as Ingredient[]).forEach(
        (item ) => {
        ingredients.push({name: item.name, key: item.key})
      }
    )
    } else {let ingredients = null}

    


    let finalDish: Dish = {
      'name': val.dishName,
      'price': +val.dishPrice,
      'essence': val.dishEssence === "nonveg" ? Essence.nonVeg : Essence.veg,
      'ingredients': ingredients ? ingredients : null,
      'description' : val.dishDescription,
      'category': val.dishCategory
    }
    'category'
    
    let taskPromise = this.dishService.altCreate(finalDish, this.dishImageFile,this.dishVideoFile)
    taskPromise
    .then( results => {
        this.snackBar.open('Your dish was added!','',{duration: 1000})
        this.dishName.setValue(null)
        this.dishPrice.setValue(null)
        this.dishForm.get('dishEssence').setValue(null)
        this.dishForm.get('dishIngredients') ? this.dishForm.get('dishIngredients').setValue(null) : null
        this.dishForm.get('dishDescription').setValue(null)
        
    } )
    .catch( err => {
      console.error(err);
      this.snackBar.open('An error occurred :(','',{duration: 1000})
    } )
    .finally( () => {
      this.isImageBeingUploaded=false
      this.isVideoBeingUploaded=false
    } )
    
    
    
  }

}
