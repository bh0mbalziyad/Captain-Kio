import { query } from '@angular/animations';
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
  public collectionName='category';
  public ref: AngularFirestoreCollection<Category>;
  public uid: string;
  constructor(private afs: AngularFirestore) { 
    this.ref = this.afs.collection<Category>(this.collectionName);
  }


  getCategories(direction: firestore.OrderByDirection,orderBy='name',pageIndex=0,pageSize=0){  
    return this.afs.collection<Category>(this.collectionName, 
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



  updateCategory(category: Category,originalName: string){
    const updateTask = this.ref.doc(category.key).update({name: category.name})
    // TODO make changes here for user's categories
    const ref = this.afs.collection<Dish>(`dishes`,
        query => {
          return query.where('category','==',originalName)
        }
    )
    .valueChanges()
    .pipe(
      take(1),
      catchError(
        err => {
          console.error(err)
          return of([])
          
        }
      )
    )
    .subscribe(
      data => {
        let batch = this.afs.firestore.batch()
        let documentRef: DocumentReference;
        data.forEach((value : Dish)=>{
          // TODO make changes here for user's dishesh
          documentRef = this.afs.collection<Dish>(`dishes`).doc<Dish>(value.key).ref
          batch.update(documentRef,{category: category.name})
        })
        return batch.commit();
      }
    )

  }

  deleteCategory(category: Category){
    const deleteTask = this.ref.doc(category.key).delete()
    const ref = this.afs.collection<Dish>(
      // TODO make changes here for user's dishes
      `dishes`,
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
          // TODO make changes here for user's dishes
          documentRef = this.afs.collection<Dish>(`dishes`).doc<Dish>(value.key).ref
          batch.delete(documentRef);
        })
        return batch.commit()
      }
    )

  }


}
