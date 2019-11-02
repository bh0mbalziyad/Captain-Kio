import { DishesFireService } from './services/dishes-fire-service.service';
import { FireDatabaseService } from './services/fire-database.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// TODO Firebase imports here
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database'
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// material imports here
import {MatCheckboxModule} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, MatFormFieldControl} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar'




import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MenuComponent } from './menu/menu.component';
import { CategoriesComponent } from './categories/categories.component';
import { DishesComponent } from './dishes/dishes.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { CreateIngredientComponent } from './create-ingredient/create-ingredient.component';
import { ManageIngredientsComponent } from './manage-ingredients/manage-ingredients.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableComponent } from './mat-table/mat-table.component';
import { TestTableComponent } from './test-table/test-table.component';
import { AppMatNavComponent } from './app-mat-nav/app-mat-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DialogRefComponent } from './mat-table/dialog-ref/DialogRef.component';
import { ManageDishesComponent } from './manage-dishes/manage-dishes.component';

const routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, data: {title: 'Home'}},
  {path: 'actions/menus', component: MenuComponent},
  {path: 'actions/categories', component: CategoriesComponent},
  {path: 'actions/dishes', component: DishesComponent},
  {path: 'actions/ingredients', component: IngredientsComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DialogRefComponent,
    HomeComponent,
    NotFoundComponent,
    MenuComponent,
    CategoriesComponent,
    DishesComponent,
    IngredientsComponent,
    CreateIngredientComponent,
    ManageIngredientsComponent,
    MatTableComponent,
    TestTableComponent,
    AppMatNavComponent,
    ManageDishesComponent,
  ],
  entryComponents:[
    DialogRefComponent,
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
    MatProgressSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    LayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule
  ],
  providers: [
    FireDatabaseService,
    DishesFireService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
