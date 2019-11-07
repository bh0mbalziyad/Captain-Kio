import { firestore } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

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


  getCategories(direction: firestore.OrderByDirection,orderBy='name',pageIndex=0,pageSize=15){  
    return this.afs.collection<Category>('category', 
    query => query.orderBy(orderBy,direction).startAt(pageIndex*pageSize).limit(pageSize)
    )
    .valueChanges()
  }
  
  addCategory(category: Category){
    return this.ref.add(category)
    .then(
      ref => {
        const id = ref.id;
        return this.ref.doc(id).update({key:id})
      }
    )
  }

  deleteCategory(category: Category){
    return this.ref.doc(category.key).delete();
  }


}
