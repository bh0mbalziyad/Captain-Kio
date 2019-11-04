import { Ingredient } from './../../create-ingredient/create-ingredient.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireDatabaseService } from './../../services/fire-database.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, take, map } from 'rxjs/operators';
import { resolve } from 'url';

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
        
        if( +value < 0 ){
            return {containsRestrictedNumber: true}
        }
        return null;
    }


     static nameExists(afs: AngularFirestore,collectionName: string) {
        return async (control : AbstractControl): Promise<ValidationErrors | null> => {
            const name = (control.value as string);
            return afs.collection<Ingredient>(collectionName, ref => ref.where('name','==',name)).valueChanges()
            .pipe(
                debounceTime(700),
                take(1),
                map(
                    arr => arr.length ? Promise.resolve({nameExists:true}) : Promise.resolve(null)
                )
            ).toPromise()
        }
    }
}