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
  img_url?: string;
  video_url?: string
  price: number;
  essence: Essence;
  description: string;
  ingredients?: DishIngredient[];
}

export interface DishIngredient{
  name : string;
  key : string
} 

@Injectable({
  providedIn: 'root'
})
export class DishesFireService {
  autoID: string;
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
  
    return this.ref.add(dish)
    .then( ref => {
      this.autoID = ref.id;
      return this.ref.doc<Dish>(this.autoID).update({key: this.autoID})
    })
    .then( success => {
      return this.storage.upload(this.dishImgFolder+this.autoID,file)
    })
    .then( task => {
      return this.storage.ref(this.dishImgFolder+this.autoID).getDownloadURL().toPromise()
    }) 
    .then( result => {
      const imgUrl = result as string;
      return this.ref.doc<Dish>(this.autoID).update({'img_url': imgUrl})
    } )
    .then( success => {
      return Promise.resolve({dishCreated: true})
    } )
    .catch(err => Promise.reject({dishCreated: false, 'err': err}) )



  }

    async deleteDish(dish: Dish) : Promise<{deleted: boolean}>{
    return this.ref.doc<Dish>(dish.key).delete()
    .then( () => { return this.storage.ref(this.dishImgFolder+dish.key).delete().toPromise() } )
    .then( () => { return Promise.resolve({deleted:true}) } )
    .catch( (err) => {
      console.log(err);
      return Promise.reject({deleted: false})
    } )
  }

   updateDish(dish: Dish){

  }






}
