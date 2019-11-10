import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { DishDialogComponent } from './manage-dishes/dish-dialog/dish-dialog.component';
import { DishesFireService } from './services/dishes-fire-service.service';
import { FireDatabaseService } from './services/fire-database.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// TODO Firebase imports here
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database'
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard'
import { environment } from '../environments/environment';

// material imports here
import {MatCheckboxModule,MAT_LABEL_GLOBAL_OPTIONS, MatChipsModule,} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';






import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CategoriesComponent } from './categories/categories.component';
import { CreateDishesComponent } from './create-dishes/create-dishes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { CreateIngredientComponent } from './create-ingredient/create-ingredient.component';
import { ManageIngredientsComponent } from './manage-ingredients/manage-ingredients.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DialogRefComponent } from './manage-ingredients/dialog-ref/DialogRef.component';
import { ManageDishesComponent } from './manage-dishes/manage-dishes.component';
import { CategoryService } from './services/category.service';
import { ConfirmDialogComponent } from './common/dialog/confirm-dialog/confirm-dialog.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './common/guards/authguard.guard';



const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectAuthorizedToDashboard = () => redirectLoggedInTo(['dashboard']);


const routes:Routes = [
  {
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full'
  },
  {
    path: 'login', 
    component: LoginComponent,
    // canActivate: [AngularFireAuthGuard],
    // data: {authGuardPipe: redirectAuthorizedToDashboard}
  },
  {
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    // canActivate: [AngularFireAuthGuard],
    // data:{ authGuardPipe: redirectUnauthorizedToLogin },  
    children: [
      {path: 'actions/categories', component: CategoriesComponent},
      {path: 'actions/dishes', component: CreateDishesComponent}
    ]
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DialogRefComponent,
    HomeComponent,
    NotFoundComponent,
    CategoriesComponent,
    CreateDishesComponent,
    IngredientsComponent,
    CreateIngredientComponent,
    ManageIngredientsComponent,
    ManageDishesComponent,
    DishDialogComponent,
    LoginComponent,
    ConfirmDialogComponent,
    DashboardComponent,
  ],
  entryComponents:[
    DialogRefComponent,
    DishDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    LayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule
  ],
  providers: [
    FireDatabaseService,
    AuthService,
    AuthGuard,
    DishesFireService,
    CategoryService,
    AngularFireAuthGuard,
    {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'auto'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
