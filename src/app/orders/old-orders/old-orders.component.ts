import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OrdersService, Order } from './../../services/orders.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-old-orders',
  templateUrl: './old-orders.component.html',
  styleUrls: ['./old-orders.component.css']
})
export class OldOrdersComponent implements OnInit {
  orders$: Observable<Order[]>;
  constructor(private orderService: OrdersService,private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.orders$ = this.orderService.getOrders().snapshotChanges().pipe(
      map(data=>{
        return data.map(value=>{
          let order:Order = {
            key: value.payload.doc.id, ...value.payload.doc.data()
          }
          return order;
        })
      })
    )
  }

  undoDispatch(order:Order){
    this.snackbar.open('Done!',null,{duration:500})
    this.orderService.undoDispatchOrder(order)
    .catch(err=>{
      console.error(err)
      this.snackbar.open('An error occurred :(',null,{duration:1000})
    })
  }

}
