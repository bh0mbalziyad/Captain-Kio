import { take, catchError } from 'rxjs/operators';
import { Dish, DishesFireService } from './dishes-fire-service.service';
import { firestore } from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface Category {
  name:string,
  key?:string
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  ref: AngularFirestoreCollection<Category>;
  constructor(private afs: AngularFirestore) { 
    this.ref = this.afs.collection<Category>('category');
  }


  getCategories(direction: firestore.OrderByDirection,orderBy='name',pageIndex=0,pageSize=0){  
    return this.afs.collection<Category>('category', 
    query => {
      if (pageSize==0){
        return query.orderBy(orderBy,direction).startAt(pageIndex)
      }
      else {
        return query.orderBy(orderBy,direction).startAt(pageIndex*pageSize).limit(pageSize)
      }
    }
    )
  }
  
  addCategory(category: Category){
    return this.ref.add(category)
  }

  deleteCategory(category: Category){
    const deleteTask = this.ref.doc(category.key).delete()
    const ref = this.afs.collection<Dish>(
      'dishes',
      query=>{
        return query.where('category','==',category.name)
      }
    ).valueChanges()
    .pipe(
      take(1),
      catchError(
        ()=> of([])
      )
    )
    .subscribe(
      data => {
        let batch = this.afs.firestore.batch()
        let documentRef: DocumentReference;
        data.forEach((value: Dish)=>{
          documentRef = this.afs.collection<Dish>('dishes').doc(value.key).ref
          batch.delete(documentRef);
        })
        return batch.commit()
      }
    )

  }


}
