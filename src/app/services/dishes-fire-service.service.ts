import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Ingredient } from '../create-ingredient/create-ingredient.component';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { firestore } from 'firebase';

export enum Essence {
  veg = "veg",
  nonVeg = "nonveg",
}




export interface Dish{
  name: string;
  key?: string;
  price: number;
  essence: Essence;
  ingredientKeys: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DishesFireService {

  private dishImgFolder = 'dishImages/';
  ref: AngularFirestoreCollection<Dish>;
  statusListener$: Subject<string> = new Subject();
  uploadProgressNumber$: Subject<number> = new Subject();

  constructor(private rtdb: AngularFireDatabase, private storage: AngularFireStorage, private afs: AngularFirestore) {
    this.ref = this.afs.collection<Dish>('dishes');
    this.statusListener$.subscribe(str=>console.log(str));
  }

  getDishes(sortBy='name', pageIndex=0, pageSize=5){
    return this.afs.collection<Dish>('dishes', ref => {
      return ref.orderBy('price').startAt(pageIndex).limit(pageSize);
    }).valueChanges();
  }

  create(dish: Dish, file: File){
    this.ref.doc<Dish>(dish.name).set(dish)
    .then(
      ()=>{
        this.statusListener$.next('Firestore doc created');
        const task = this.storage.upload(`${this.dishImgFolder}${dish.name}`,file)
        task.then(
          ()=>{
            this.statusListener$.next('Upload complete');
            // this.statusListener$.complete();
          }
        )
        .catch(err=>console.log(err)
        );


        task.percentageChanges()
        .subscribe(
          number => this.uploadProgressNumber$.next(number)
        )
      }
    )


  }





}
