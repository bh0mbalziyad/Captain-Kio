import { ConfirmDialogComponent } from './../common/dialog/confirm-dialog/confirm-dialog.component';
import { DishDialogComponent } from './dish-dialog/dish-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, finalize } from 'rxjs/operators';
import { Ingredient } from './../create-ingredient/create-ingredient.component';
import { Dish, DishesFireService } from './../services/dishes-fire-service.service';
import { Observable, Subject, of as observableOf, BehaviorSubject } from 'rxjs';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import * as deepEqual from "deep-equal";

@Component({
  selector: 'app-manage-dishes',
  templateUrl: './manage-dishes.component.html',
  styleUrls: ['./manage-dishes.component.css']
})
export class ManageDishesComponent implements OnInit {
  
  foodItems$: Observable<Dish[]>;
  loadingSubject = new BehaviorSubject<Boolean>(false);
  loading$ = this.loadingSubject.asObservable();


  constructor(private dishService: DishesFireService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.getDishes();
  }



  getDishes(){
    this.loadingSubject.next(true)
    this.foodItems$ = this.dishService.getDishes('asc')
    this.foodItems$.subscribe(()=>{
      this.loadingSubject.next(false);
    })
  }



  
  deleteDish(dish: Dish){
    const data = {
      content : 'Are you sure you want to delete this dish?'
    }
    this.dialog.open(ConfirmDialogComponent,{
      width: '600',
      data: data
    })
    .afterClosed()
    .subscribe(
      (data)=>{
        if(data){
          this.dishService.deleteDish(dish)
          .then( data => {
            data.deleted ? this.snackBar.open('Dish was deleted!',null,{duration: 1000}) : null 
          } )
          .catch(data => {
            this.snackBar.open('An error occurred :(',null,{duration: 1000})
            console.error('Error log:')
            console.error(data);
            
          })
        }        
      }
    )


    
  }

  editDish(dish: Dish){
    const copyOfDish: Dish = {
      name: dish.name,
      price: dish.price,
      description: dish.description,
      essence: dish.essence,
      img_url: dish.img_url,
      video_url: dish.video_url,
      ingredients: dish.ingredients ? dish.ingredients : null,
      key: dish.key,
      category: dish.category

    }
    const dialogRef  = this.dialog.open(DishDialogComponent,{
      'width': "550",
      'data': copyOfDish
    });

    dialogRef.afterClosed().subscribe(
      (result: Dish ) => {
        
        if ( result ){
          if (!deepEqual(result,dish,{strict:true}) ){
              // console.log(result);
              // console.log('Dialog closed');
            this.snackBar.open('Updated!',null,{duration:500})
            this.dishService.updateDish(result)
            .then()
            .catch(
              (err) => {
                console.error(err)
                this.snackBar.open('An error ocurred :(',null,{duration:700})
              }
            )
          }
        }
        
      }
    )
  }

}

