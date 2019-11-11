import { take, map, tap } from 'rxjs/operators';
import { MatTable } from '@angular/material/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { Order, OrdersService } from './../services/orders.service';
import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit,AfterViewInit {

  displayedColumns = ['orderId','timestamp','totalamount']
  dataSource: SalesDataSource;
  totalAmountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalAmount$: Observable<number> = this.totalAmountSubject.asObservable();
  
  @ViewChild(MatTable, {static: false}) table: MatTable<Order>;
  
  constructor(private orderService: OrdersService) { 
  }

  ngOnInit(){
    this.dataSource = new SalesDataSource(this.orderService);
    this.orderService.getOrders().valueChanges()
    .pipe(
      take(1),
      map(
        data => {
          return data.map(a=>{
            return a.totalamount
          })
        }
      )
    ).subscribe(
      data => {
        let val: number = 0;
        data.forEach(a=>val+=a)
        this.totalAmountSubject.next(val)
      }
    )
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }

}

export class SalesDataSource extends DataSource<Order> {
  
  constructor(private service: OrdersService){
    super()
  }

  connect(): Observable<Order[]>{
    return this.service.getOrders().valueChanges()
  }

  disconnect(){
    
  }
}