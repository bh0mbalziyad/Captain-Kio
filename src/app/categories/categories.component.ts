import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CategoryService } from './../services/category.service';
import { InputValidators } from './../validators/sync/createForms.validators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit,OnDestroy {
  form: FormGroup;
  selectedIndex=0;
  // categoriesSubjectSubject<Category[]>;
  categories: Observable<Category[]>;
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackbar: MatSnackBar) 
    {
      this.form = this.fb.group({
      categoryName: ['',[Validators.required,InputValidators.containsRestricted]]
    })
  }

  
  ngOnInit() {
    this.categories = this.categoryService.getCategories();
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
    this.categoryService.addCategory(category)
    .then(
      ()=> {
        // this.snackbar.open('Added!','',{duration: 7000})
        // this.categoryName.value('');
        this.categoryName.markAsUntouched()
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
