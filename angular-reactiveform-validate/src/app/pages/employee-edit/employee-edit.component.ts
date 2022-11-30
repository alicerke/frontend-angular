import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormArray, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { of, delay, switchMap, map, catchError, Subscription, Observable } from 'rxjs';

function rangeValidator(min: number, max: number): ValidatorFn {
  return (control) => {
    if (control.value >= min && control.value <= max) {
      return null;
    }
    return {
      range: {
        min: min,
        max: max,
        actual: control.value,
      }
    };
  };
}

function emailTakenValidator(http: HttpClient): AsyncValidatorFn {
  return (control) => {
    return of(control.value).pipe(
      delay(500),
      switchMap(email => http.get(" http://localhost:3000/employees", {
        params: {
          email: control.value
        }
      }).pipe(
        map(() => null),
        catchError(() => of({
          taken: true
        }))
      ))
    );
  }
}

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  subs: Subscription[] = [];

  ngOnInit(): void {
    const sub = this.employeeForm.valueChanges.subscribe();
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  getError(path: string, errorName: string): any {
    const formControl = (this.employeeForm.get(path) as FormControl);
    const actualClass = document.getElementById(path)!;
    if (formControl.untouched && formControl.pristine) {
      return;
    }
    formControl.errors
      ? actualClass.classList.add('is-invalid')
      : actualClass.classList.remove('is-invalid');
    return formControl.errors?.[errorName];
  }

  getSkills() {
    return (this.employeeForm.get("skills") as FormArray).controls as FormControl[];
  }

  addSkill() {
    (this.employeeForm.get("skills") as FormArray).push(new FormControl(""));
  }

  deleteSkill(index: number) {
    (this.employeeForm.get("skills") as FormArray).removeAt(index);
  }

  onSubmit() {
    this.employeeForm.markAllAsTouched();
    if (!this.employeeForm.valid) {
      return;
    }
    alert(JSON.stringify(this.employeeForm.value));
  }

  allPositions$ = this.http.get(" http://localhost:3000/positions") as Observable<{ id: number, name: string }[]>

  nameValidator = Validators.compose([
    Validators.required,
    Validators.minLength(0),
    Validators.maxLength(100),
  ]);

  employeeForm = this.fb.group({
    firstName: ["", this.nameValidator],
    lastName: ["", this.nameValidator],
    age: [20, rangeValidator(18, 100)],
    email: ["", null, emailTakenValidator(this.http)],
    position: [""],
    gender: ["female"],
    address: this.fb.group({
      city: [''],
      street: [''],
      zip: ['', rangeValidator(1000, 9999)],
    }),
    skills: this.fb.array([
      ["Teszt képesség 1."],
      ["Teszt képesség 2."],
    ]),
    isAccepted: [false],
  });

}
