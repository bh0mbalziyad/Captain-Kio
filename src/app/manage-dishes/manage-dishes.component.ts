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

@Component({
  selector: 'app-manage-dishes',
  templateUrl: './manage-dishes.component.html',
  styleUrls: ['./manage-dishes.component.css']
})
export class ManageDishesComponent implements OnInit, AfterViewInit {
  
  dishes$: Observable<Dish[]>;
  loading$: Observable<Boolean>;
  dataSource: DishesDataSource;
  displayedColumns = [ 'name', 'essence','price','actions'];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Dish>;


  constructor(private dishService: DishesFireService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.dataSource = new DishesDataSource(this.dishService);
    this.dataSource.loadData();
    this.loading$ = this.dataSource.loading$;
  }


  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteDish(dish: Dish){
    this.dishService.deleteDish(dish)
    .then( data => {
      data.deleted ? this.snackBar.open('Dish was deleted!',null,{duration: 1000}) : null 
    } )
    .catch(data => {
      this.snackBar.open('An error occurred :(',null,{duration: 1000})
      console.log('Error log:')
      console.log(data);
      
    })
  }

  editDish(dish: Dish){

  }

}


export class DishesDataSource extends DataSource<Dish> {

  private dishesSubject = new BehaviorSubject<Dish[]>([]);
  private loadingSubject = new BehaviorSubject<Boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  paginator: MatPaginator;
  sort: MatSort;

  constructor(private dishService: DishesFireService){
    super();
  }

  connect(){
    return this.dishesSubject.asObservable();
  }

  loadData(sortBy='name', sortOrder = 'asc', pageIndex = 0, pageSize = 15){
    this.loadingSubject.next(true);
    this.dishService.getDishes().pipe(
      catchError( err => {
        console.error(err);
        return observableOf([]);
        
      } ),
      finalize(
        () => {
          this.loadingSubject.next(false);
        }
      )
    )
    .subscribe(
      data => {
        this.dishesSubject.next(data);
        this.loadingSubject.next(false);
      }
    )
  }

  disconnect(){
    this.dishesSubject.complete();
    this.loadingSubject.complete();
  }

}
