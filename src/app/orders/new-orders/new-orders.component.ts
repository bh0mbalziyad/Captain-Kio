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
  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.orders$ = this.orderService.getOrders().valueChanges();
  }



}
