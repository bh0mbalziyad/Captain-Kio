import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Dish } from './dishes-fire-service.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';


export interface Order {
  orderId: string;
  timestamp: firebase.firestore.Timestamp;
  totalamount: number;
  order: Cart;
  key?: string;
}

export interface Cart {
  cart : OrderItem[]
}

export interface OrderItem {
  count: number;
  foodItem: Dish;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public collectionName = 'order';
  public ref: AngularFirestoreCollection;

  constructor(private afs : AngularFirestore) {
    let uid = (firebase.auth().currentUser.uid)
    // this.collectionName = `users/${uid}/order`
    this.ref = this.afs.collection<Order>(this.collectionName);
  }

  getOrders(){
    return this.afs.collection<Order>(this.collectionName,query=>query.orderBy('orderId'));
  }
}
