import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  selectedIndex=0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(
      route => {
        this.selectedIndex= +route.get('tab');
      }
    )
  }

}
