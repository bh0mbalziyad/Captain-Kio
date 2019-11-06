import { Dish } from './../../services/dishes-fire-service.service';
import { Ingredient } from './../../create-ingredient/create-ingredient.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireDatabaseService } from './../../services/fire-database.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, take, map, distinctUntilChanged } from 'rxjs/operators';
import { resolve } from 'url';
import { async } from 'q';
import { query } from '@angular/animations';

export class InputValidators {

    static containsWhiteSpace(control: AbstractControl): ValidationErrors | null {
        if ( (control.value as string).indexOf(' ') >= 0 ) return {containsWhiteSpace : true}
        return null;
    }
    static containsRestricted(control: AbstractControl): ValidationErrors | null{
        const value = control.value as string;
        const regex = /[~!@#$%^&*()\-_+={\[}\]:;"'<,>.?\/\\]/gi;
        if( regex.test(value) ){
            return {containsRestricted: true}
        }
        return null;
    }


    static containsInvalidNumber(control: AbstractControl): ValidationErrors | null{
        const value = control.value as string;
        
        if( +value <= 0 ){
            return {containsRestrictedNumber: true}
        }
        return null;
    }


     static nameExists(afs: AngularFirestore,collectionName: string) {
        return async (control: AbstractControl):Promise<any>=>{
            const success = await afs.collection<Dish | Ingredient>(collectionName, query => query.where('name', '==', (control.value as string)))
                .valueChanges()
                .pipe(distinctUntilChanged(), debounceTime(500), take(1), map(data => {
                    if (data.length >= 1) {
                        return ({ nameTaken: true });
                    }
                    else {
                        return ({ nameTaken: false });
                    }
                }))
                .toPromise();
            return await (success.nameTaken ? Promise.resolve({ nameExists: true }) : Promise.resolve(null));
        }
    }
}