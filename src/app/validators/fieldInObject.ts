import { AbstractControl, ValidatorFn } from "@angular/forms";

export function fieldInObjRegex(fieldName:string, regex:RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if(control.value && control.value[fieldName] && regex.test( control.value[fieldName])){
            return null;
        }
           
        return { 'fieldInObjRegex': true };
        
        
    };
}