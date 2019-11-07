import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CategoryService } from './../services/category.service';
import { InputValidators } from './../validators/sync/createForms.validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit,OnDestroy {
  form: FormGroup;
  selectedIndex=0;
  loadingSubject = new BehaviorSubject<Boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  categories$: Observable<Category[]>;
  
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private categoryService: CategoryService,
    private snackbar: MatSnackBar) 
    {
      this.form = this.fb.group({
      categoryName: ['',[Validators.required,InputValidators.containsRestricted],[InputValidators.nameExists(this.afs,'category')]]
    })
  }

  
  ngOnInit() {
    this.getCategories()
  }
  
  getCategories(){
    this.categories$ = this.categoryService.getCategories('asc');
    this.categories$
    .pipe(
      tap(
        () => this.loadingSubject.next(false)
      )
    )
    .subscribe()
  }

  ngOnDestroy(): void {
  }


  get categoryName (){
    return this.form.get('categoryName')
  }


  deleteCategory(category: Category){
    this.categoryService.deleteCategory(category)
    .then(
      // ()=>this.snackbar.open('Deleted','',{duration:700})
    )
    .catch(
      err => {
        console.error(err)
        this.snackbar.open('An error occurred','',{duration:700})
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
