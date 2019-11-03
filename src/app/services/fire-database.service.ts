import { Observable } from 'rxjs';
import { Ingredient } from '../create-ingredient/create-ingredient.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FireDatabaseService {

  private dbPath = '/ingredients'
  ref : AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    this.ref = this.afs.collection<Ingredient>('ingredients');
   }

  create(item : Ingredient){
    this.ref.add(item).then(
      ref =>{
        this.ref.doc(`${ref.id}`).update({key: ref.id});
      }
    )
  }


  update(item: Ingredient){
    return this.ref.doc<Ingredient>(item.key).update(item);
    // return this.db.object(this.dbPath+'/'+item.key)
    //   .update(item);
  }


  delete(item: Ingredient): Promise<void>{
    return this.ref.doc<Ingredient>(item.key).delete();
    // return this.db.object(this.dbPath+'/'+item.key).remove();
  }

  getAll(): Observable<Ingredient[]>{
    return this.afs.collection<Ingredient>('ingredients').valueChanges();
    // return this.ref.valueChanges();
  }
}
