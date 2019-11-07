import { Dish, DishesFireService } from './../services/dishes-fire-service.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {
  foodItems$: Observable<Dish[]>;

  constructor(private service: DishesFireService) { }

  ngOnInit() {
    this.foodItems$ = this.service.getDishes('asc');
  }

  test(value:any){
    console.log(value)
  }

}
