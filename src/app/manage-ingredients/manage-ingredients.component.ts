import { ConfirmDialogComponent } from './../common/dialog/confirm-dialog/confirm-dialog.component';
import { DialogRefComponent } from './dialog-ref/DialogRef.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FireDatabaseService } from '../services/fire-database.service';
import { DataSource } from '@angular/cdk/collections';
import { Ingredient } from '../create-ingredient/create-ingredient.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Observable, of, merge } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import * as deepEqual from "deep-equal";



export interface Page{
  pageIndex: number,
  pageSize: number
}

@Component({
  selector: 'manage-ingredients',
  templateUrl: './manage-ingredients.component.html',
  styleUrls: ['./manage-ingredients.component.css']
})
export class ManageIngredientsComponent implements OnInit{

  displayedColumns = [ 'name', 'quantity','actions'];
  dataSource: IngredientDataSource;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Ingredient>;

  constructor(
    private service: FireDatabaseService, 
    private snackBar: MatSnackBar, 
    private dialog: MatDialog
    ) { 

  }

  ngOnInit() {
    this.dataSource = new IngredientDataSource(this.service);
    this.dataSource.loadData();
  }

  ngAfterViewInit(){
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(filterValue: string) {
    // console.log('Filter applied')
    this.dataSource.filter(filterValue);    
  }

  //TODO Update item in row
  update(ingredient: Ingredient){
    console.log(`Update ${ingredient.name} & ${ingredient.key}`);
    const dialogRef = this.dialog.open(DialogRefComponent,{
      width: '400px',
      data: {
        name: ingredient.name,
        quantity: ingredient.quantity,
        key: ingredient.key,
        unit: ingredient.unit
      }
    });

    dialogRef.afterClosed()
    .subscribe((result: Ingredient) => {
      // console.log('Dialog closed');
      if (result){
        // console.log(deepEqual(ingredient,result,{strict: true}));
        !deepEqual(ingredient,result)? this.service.update(result): null;
        // this.snackBar.open('Updated!',null,{duration: 1000});
      }
    })
    
  }


  // Delete item from row
  delete(ingredient: Ingredient){
    this.dialog.open(ConfirmDialogComponent,{
      width: '400',
      data: {content: 'Are you sure you want to delete this ingredient?'}
    })
    .afterClosed()
    .subscribe(
      data => {
        if (data){
          this.service.delete(ingredient).then(
            ()=>{
              this.snackBar.open('Deleted!',null,{
                duration: 5000
              })
              .onAction()
              .subscribe(()=>{
                // TODO hanlde undo delete here
                this.service.create(ingredient);
            
              });
            }
          )
        }
      }
    )
    
    
  }

}



export class IngredientDataSource extends DataSource<Ingredient>{

  private ingredientsSubject = new BehaviorSubject<Ingredient[]>([]);
  private loadingSubject= new BehaviorSubject<Boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private service: FireDatabaseService){
    super();
  }

  connect(): Observable<Ingredient[]> {
    return this.ingredientsSubject.asObservable();
  }


  filter(value: string){
    
  }


  loadData(){
    this.loadingSubject.next(true);
    this.service.getAll('asc')

      .pipe(
        catchError(
          () => of([])
        ),
        finalize(
          () => {
            this.loadingSubject.next(false);
          }
        )
      )
      .subscribe(data=>{
        this.loadingSubject.next(false);
        this.ingredientsSubject.next(data);
      })
  }
  

  disconnect() {
    this.loadingSubject.complete();
    this.ingredientsSubject.complete();
  }

}