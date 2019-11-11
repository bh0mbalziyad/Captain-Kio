import { take, catchError } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';


export interface Table {
  name: string;
  password: string;
  key?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  collectionName = 'tables';
  ref: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore) {
    let uid = firebase.auth().currentUser.uid;
    if (uid) this.collectionName = `users/${uid}/tables`
    this.ref = this.afs.collection<Table>(this.collectionName);
  }

  getTables(){
    return this.afs.collection<Table>(this.collectionName)
  }
  
  updatePassword(password : string){
    let batch = this.afs.firestore.batch()
    this.getTables().valueChanges()
    .pipe(
      take(1),
      catchError(err=>{
        console.error(err)
        return of([])
      })
    )
    .subscribe(
      (data: Table[])=>{
        let documentRef: DocumentReference;
        data.forEach(a=>{
          documentRef = this.afs.collection<Table>(this.collectionName).doc(a.key).ref
          batch.update(documentRef, {'password': password})
        })
        batch.commit()
        .then(
          ()=> Promise.resolve('password updated')
        )
        .catch(
          err=>{
            console.error(err)
            return Promise.reject('an error occuurr')
          }
        )
      }
    )
  }
  
}