import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'; import { OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  RegForm!: FormGroup
  separatorKeysCodes: number[] = [ENTER, COMMA];
  Ctrl = new FormControl();
  filteredhobbies: Observable<string[]>;
  hobbies: string[] = [];
  allhobbies: string[] = ['football', 'badminton', 'swimming', 'cricket '];

  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;

  constructor(private formB: FormBuilder, private router: Router, private http: HttpClient,
    private api: ApiService,
    private dialogRef: MatDialogRef<UserRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {
    this.filteredhobbies = this.Ctrl.valueChanges.pipe(
      startWith(null),
      map((hobbies: string | null) => (hobbies ? this._filter(hobbies) : this.allhobbies.slice())),
    );
  }

  ngOnInit(): void {
    console.log(this.editData);
    // throw new Erromr('Method not implemented.');
    this.RegForm = this.formB.group({
      id: [''],
      UploadPic: new FormControl('/assets/images.png'),
      f_name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z]*$')])),
      l_name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z]*$')])),
      //hobbies:['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      age: ['20'],
      state: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      address_line1: ['', Validators.required],
      address_line2: ['', Validators.required],
      subscribe_to_newsletter: [false],
      hobbies: ['', Validators.required],

    });
    this.setFormWithUserData(this.editData);
  }

  setFormWithUserData(data: any) {
    if (data && data.hasOwnProperty('userData') && data.userData) {
      this.RegForm.controls['id'].setValue(data.userData.id);
      this.RegForm.controls['UploadPic'].setValue(data.userData.UploadPic);
      this.RegForm.controls['f_name'].setValue(data.userData.f_name);
      this.RegForm.controls['l_name'].setValue(data.userData.l_name);
      this.RegForm.controls['email'].setValue(data.userData.email);
      this.RegForm.controls['mobile'].setValue(data.userData.mobile);
      this.RegForm.controls['age'].setValue(data.userData.age);
      this.RegForm.controls['state'].setValue(data.userData.state);
      this.RegForm.controls['country'].setValue(data.userData.country);
      this.RegForm.controls['address'].setValue(data.userData.address);
      this.RegForm.controls['address_line1'].setValue(data.userData.address_line1);
      this.RegForm.controls['address_line2'].setValue(data.userData.address_line2);
      this.RegForm.controls['subscribe_to_newsletter'].setValue(data.userData.subscribe_to_newsletter);
      this.RegForm.controls['hobbies'].setValue(data.userData.hobbies);
      this.hobbies = data.userData.hobbies && data.userData.hobbies.length > 0 ? data.userData.hobbies.split(',') : [];

    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our hobbies
    if (value) {
      this.hobbies.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.Ctrl.setValue(null);
  }

  remove(hobbies: string): void {
    const index = this.hobbies.indexOf(hobbies);

    if (index >= 0) {
      this.hobbies.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.hobbies.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.Ctrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allhobbies.filter(hobbies => hobbies.toLowerCase().includes(filterValue));
  }
  addRegister() {
    this.RegForm.controls['hobbies'].setValue(this.hobbies.join(","));

    if (this.RegForm.valid) {
      if (this.RegForm.value.hasOwnProperty('id') && this.RegForm.value.id && this.RegForm.value.id != '') {
        this.api.putData(this.RegForm.value, this.RegForm.value.id).subscribe({
          next: (res) => {
            alert("Registeration updated sucessfully...!!!");
            this.RegForm.reset();
            this.dialogRef.close();
          },
          error: () => {
            alert("Error while adding the register");
          }
        })
      } else {
        this.api.postUserRegister(this.RegForm.value).subscribe({
          next: (res) => {
            //console.log(res);
            alert("Register added sucessfully...!!!");
            this.RegForm.reset();
            this.dialogRef.close();
            this.router.navigate(['user-profile'], { queryParams: { id: res.id } });
          },
          error: () => {
            alert("Error while adding the register");
          }
        })
      }
    } else {
      Object.keys(this.RegForm.controls).forEach((controlName) => {
        this.RegForm.controls[controlName].markAsTouched();
      });
    }
  }


  handleImageSelect(e: Event, form: any, control: string) {
    console.log(form);
    form as FormGroup;
    let input = e.target as HTMLInputElement;
    let file = (input.files as FileList)[0];
    console.log(file);
    if (file) {
      if (file.size > 500000) {
        console.log("File Size");
      } else {
        if (file.type.split("/")[0] === "image") {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event: any) => {
            form.controls[control].setValue(event.target.result);
          }
        } else {
          console.log("File Type");
        }
      }
    }
  }
  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {

      if (event.target.files[0].type === 'image/jpeg' ||
        event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/jpg') {
        if (event.target.files[0].size < 200 * 200) {/* Checking height * width*/ }
        if (event.target.files[0].size < 2000000) {/* checking size here - 2MB */ }
      }
    }
  }
}
