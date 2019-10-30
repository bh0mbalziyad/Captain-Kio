import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { FireDatabaseService } from './../fire-database.service';
import { DataSource } from '@angular/cdk/collections';
import { Ingredient } from './../create-ingredient/create-ingredient.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Observable, of, merge } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';



export interface Page{
  pageIndex: number,
  pageSize: number
}

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.css']
})
export class MatTableComponent implements OnInit{

  displayedColumns = [ 'id','name', 'quantity'];
  dataSource: IngredientDataSource;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Ingredient>;

  constructor(private service: FireDatabaseService, private snackBar: MatSnackBar) { 

  }

  ngOnInit() {
    this.dataSource = new IngredientDataSource(this.service);
    this.dataSource.loadData();
  }

  ngAfterViewInit(){
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


    this.sort.sortChange
    .pipe(
      tap(()=>{
        this.dataSource.loadData(true,false);
      })
    )
    .subscribe()

    // this.paginator.page
    // .pipe(
    //   tap(()=>{
    //     this.dataSource.loadData(false, true);
    //   })
    // )
    // .subscribe()
  }


  applyFilter(filterValue: string) {
    console.log('Filter applied')
    this.dataSource.filter(filterValue);    
  }

  // Delete item from row
  delete(ingredient: Ingredient){
    this.snackBar.open('Deleted!','Undo',{
      duration: 5000
    })
    .onAction()
    .subscribe(()=>{
      // TODO hanlde undo delete here
      
    })
    
  }

}



export class IngredientDataSource extends DataSource<Ingredient>{

  private ingredientsSubject = new BehaviorSubject<Ingredient[]>([]);
  private loadingSubject= new BehaviorSubject<Boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private data: Ingredient[] = [];
  
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private service: FireDatabaseService){
    super();
  }

  connect(): Observable<Ingredient[]> {
    return this.ingredientsSubject.asObservable();
  }


  filter(value: string){
    let data = this.data.filter(
      (val: Ingredient,index: number,arr: Ingredient[]) => {
        let valString = val.name+''+val.id;
        if (valString.toLowerCase().includes(value.toLowerCase()))
          return true;
        return false;
      }
    );
    console.log('Filtered');
    
    this.ingredientsSubject.next(data);
  }


  loadData(sort?:boolean, paginate?:boolean){
    this.loadingSubject.next(true);
    this.service.getAll()

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
        this.data=data;
        if (sort){
          data= this.getSortedData(data);
          // this.data=data;
        }

        if (paginate){
          data = this.getPagedData(data);
          // this.data = data;
        }
        this.loadingSubject.next(false);
        this.ingredientsSubject.next(data);
      })
  }
  

  disconnect() {
    this.loadingSubject.complete();
    this.ingredientsSubject.complete();
  }
  
  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  public getPagedData(data: Ingredient[], page?: Page) {
    
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  public getSortedData(data: Ingredient[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'quantity': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
      this.data = data;
    });
  }

}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}