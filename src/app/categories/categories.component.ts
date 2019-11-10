import { ConfirmDialogComponent } from './../common/dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CategoryService } from './../services/category.service';
import { InputValidators } from './../validators/sync/createForms.validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit,OnDestroy {
  form: FormGroup;
  selectedIndex=0;
  private uid: string;
  private collectionName: string;
  loadingSubject = new BehaviorSubject<Boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  categories$: Observable<Category[]>;
  
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private snackbar: MatSnackBar) 
    {
      this.uid = firebase.auth().currentUser.uid
      this.collectionName = `users/${this.uid}/category`;
      this.form = this.fb.group({
      categoryName: ['',[Validators.required,InputValidators.containsRestricted],[InputValidators.nameExists(this.afs,this.collectionName)]]
    })
  }

  
  ngOnInit() {
    this.initializeCollection()
    this.getCategories()
  }

  initializeCollection(){
    this.categoryService.collectionName = `users/${this.uid}/category`
    this.categoryService.ref = this.afs.collection<Category>(this.categoryService.collectionName)
  }
  
  getCategories(){
    this.categories$ = this.categoryService.getCategories('asc')
    .snapshotChanges()
    .pipe(
      tap(()=>this.loadingSubject.next(false)),
      map(data => {
        return data.map( a=> {
          let val: Category = {
            name : a.payload.doc.data().name,
            key: a.payload.doc.id
          }
          return val;
        })
      })
    )
  }

  ngOnDestroy(): void {
  }


  get categoryName (){
    return this.form.get('categoryName')
  }


  deleteCategory(category: Category){
    this.dialog.open(ConfirmDialogComponent,{
      width: '400px',
      maxHeight: 400,
      data: {content: 'Deleting this category will also delete all the Food items in this category. Are you sure want to remove this category?'}
    })
    .afterClosed()
    .subscribe(
      data=>{
        if(data){
          this.categoryService.deleteCategory(category)
          // .then(
          //   ()=>this.snackbar.open('Deleted','',{duration:700})
          // )
          // .catch(
          //   err => {
          //     console.error(err)
          //     this.snackbar.open('An error occurred','',{duration:700})
          //   }
          // )
        }
      }
    )
    
    
  }

  submit(){
    // console.log(this.form.value);
    let category: Category = {
      name: this.form.value.categoryName as string
    }
    this.form.reset();
    this.snackbar.open('Added!',null,{duration:700});
    
    
    this.categoryService.addCategory(category)
    .then(
      ()=> {
      }
    )
    .catch(
      err => {
        this.snackbar.open('An error occurred :(','',{duration: 7000})
        console.error(err)
      }
    )
    
  }
}
