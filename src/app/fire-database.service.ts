import { Observable } from 'rxjs';
import { Ingredient } from './create-ingredient/create-ingredient.component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FireDatabaseService {

  private dbPath = '/ingredients'
  ref : AngularFireList<Ingredient>;

  constructor(private db: AngularFireDatabase) {
    this.ref = db.list(this.dbPath);
   }

  create(item : Ingredient){
    this.ref.push(item);
  }

  getAll(): Observable<Ingredient[]>{
    return this.ref.valueChanges();
  }
}
