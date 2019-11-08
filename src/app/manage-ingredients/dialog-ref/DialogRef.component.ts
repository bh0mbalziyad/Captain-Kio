import { InputValidators } from './../../validators/sync/createForms.validators';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from '../../create-ingredient/create-ingredient.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-dialog-ref',
    templateUrl:'./DialogRef.component.html',
    styleUrls: ['./DialogRef.component.css'],
})
export class DialogRefComponent implements OnInit{

    form: FormGroup
    
    constructor(
        public fb: FormBuilder,
        public afs: AngularFirestore,
        private dialogRef: MatDialogRef<DialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Ingredient
    ){
        this.form = this.fb.group({
            name: [data.name,[Validators.required],[InputValidators.EditFieldNameTaken(this.afs,data.name,'ingredients')]],
            quantity: [data.quantity,[Validators.required,InputValidators.containsInvalidNumber],],
            unit: [data.unit,[Validators.required]]
        });
    }


    get ingName(){
        return this.form.get('name')
    }

    get ingQuantity(){
        return this.form.get('quantity')
    }

    get ingUnit(){
        return this.form.get('unit')
    }
    
    ngOnInit(){}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmitClicked(){
        const value = this.form.value
        this.data.name = value.name as string
        this.data.quantity = value.quantity as number
        this.data.unit = value.unit as string
        this.dialogRef.close(this.data);
    }
}