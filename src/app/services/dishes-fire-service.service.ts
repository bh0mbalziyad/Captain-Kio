import { Category } from './category.service';
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
  category?: string;
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
  private dishVideoFolder = 'dishVideos/';
  ref: AngularFirestoreCollection<Dish>;
  statusListener$: Subject<string> = new Subject();
  uploadProgressNumber$: Subject<number> = new Subject();

  constructor(private rtdb: AngularFireDatabase, private storage: AngularFireStorage, private afs: AngularFirestore) {
    this.ref = this.afs.collection<Dish>('dishes');
    // this.statusListener$.subscribe(str=>console.log(str));
  }
  
  getDishes(sortOrder: firestore.OrderByDirection, sortBy='name', pageIndex=0, pageSize=15){
    return this.afs.collection<Dish>('dishes', ref => {
      return ref.orderBy('price',sortOrder).startAt(pageIndex*pageSize).limit(pageSize);
    }).valueChanges();
  }



  async altCreate(dish:Dish,dishImage:File, dishVideo: File){
    const id = this.afs.createId()
    dish.key = id;
    await Promise.all([
      this.ref.doc<Dish>(id).set(dish),
      this.storage.upload(this.dishImgFolder+id,dishImage),
      this.storage.upload(this.dishVideoFolder+id,dishVideo)
    ])
    const videoUrl = await this.storage.ref(this.dishVideoFolder+id).getDownloadURL().toPromise();
    const imageUrl = await this.storage.ref(this.dishImgFolder+id).getDownloadURL().toPromise();
    return this.ref.doc<Dish>(id).update({
      img_url: imageUrl as string,
      video_url: videoUrl as string,
    })
    
  }

    async deleteDish(dish: Dish) : Promise<{deleted: boolean}>{

    return Promise.all(
      [
        this.storage.ref(this.dishImgFolder+dish.key).delete().toPromise(),
        this.storage.ref(this.dishVideoFolder+dish.key).delete().toPromise(),
        this.ref.doc<Dish>(dish.key).delete()
      ]
    )
    .then( ()=>Promise.resolve({deleted:true}) )
    .catch(err=>{
      console.error(err)
      return Promise.reject({deleted:false})
    })
  }

    async updateDish(dish: Dish){
    return this.ref.doc<Dish>(dish.key).update(dish)
    .then( () => Promise.resolve({updated:true}) )
    .catch(err => {
      console.error(err);
      return Promise.reject({updated:false})
    })

  }






}
