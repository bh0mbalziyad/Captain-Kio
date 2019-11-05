import { Ingredient } from '../../create-ingredient/create-ingredient.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-dialog-ref',
    templateUrl:'./DialogRef.component.html',
    styleUrls: ['./DialogRef.component.css'],
})
export class DialogRefComponent implements OnInit{
    
    constructor(
        private dialogRef: MatDialogRef<DialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Ingredient
    ){}
    
    ngOnInit(){}

    onNoClick(): void {
        this.dialogRef.close();
    }
}