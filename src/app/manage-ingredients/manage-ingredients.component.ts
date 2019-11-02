import { FireDatabaseService } from '../services/fire-database.service';
import { Ingredient } from './../create-ingredient/create-ingredient.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'manage-ingredients',
  templateUrl: './manage-ingredients.component.html',
  styleUrls: ['./manage-ingredients.component.css']
})
export class ManageIngredientsComponent implements OnInit {
  ingredients: Ingredient[];

  constructor(private fireService: FireDatabaseService) { }

  ngOnInit() {
    this.fireService.getAll()
      .subscribe(
        data => {
          this.ingredients = data;
        }
      )
  }

}
