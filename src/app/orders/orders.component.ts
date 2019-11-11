import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  selectedIndex=0
  constructor(public route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(
      map => {
        this.selectedIndex = +map.get('tab');
      }
    )
   }

  ngOnInit() {
  }

}
