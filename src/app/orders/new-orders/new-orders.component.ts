import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Order } from './../../services/orders.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.css']
})
export class NewOrdersComponent implements OnInit {

  orders$: Observable<Order[]>
  constructor(private orderService: OrdersService,private snackbar:MatSnackBar) { }

  ngOnInit() {
    this.orders$ = this.orderService.getOrders().snapshotChanges().pipe(
      map(data=>{
        return data.map(value=>{
          let order: Order = {
            key: value.payload.doc.id, ...value.payload.doc.data()
          }
          return order;
        })
      })
    )
  }


  dispatchOrder(order:Order){
    this.snackbar.open('Order dispatched!',null,{duration:800})
    this.orderService.dispatchOrder(order)
    .catch(err=>{
      this.snackbar.open('An error occurred :(',null,{duration:1000})
    })
  }



}
