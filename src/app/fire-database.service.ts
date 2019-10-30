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
    let ref = this.ref.push(item).key;
    console.log(`Key = ${ref}`);
    this.db.object(this.dbPath+'/'+ref).update({key: ref});
  }


  update(item: any){
    return this.db.object(this.dbPath+'/'+item.key)
      .update({item});
  }


  delete(item: Ingredient): Promise<void>{
    return this.db.object(this.dbPath+'/'+item.key).remove();
  }

  getAll(): Observable<Ingredient[]>{
    return this.ref.valueChanges();
  }
}
