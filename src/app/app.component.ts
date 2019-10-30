import { Router } from '@angular/router';
import { Component } from '@angular/core';

export interface Items{
  name: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  items: Items[] = [
    {name: 'Categories'},
    {name: 'Dishes'},
    {name: 'Ingredients'}
  ];

  navOpened = true;

  constructor(private router: Router) { }

  navigate(name: string){
    this.router.navigate(['/actions',name.toLowerCase()]);
    
  }
}
