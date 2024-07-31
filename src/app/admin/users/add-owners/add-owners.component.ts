import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from './toast-service';
import { ApiServices } from 'src/app/services/api';
import { Router } from '@angular/router';
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
@Component({
  selector: 'app-add-owners',
  templateUrl: './add-owners.component.html',
  styleUrls: ['./add-owners.component.scss']
})
export class AddOwnersComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private toastService: ToastService, private api: ApiServices) { }
  ownerForm!: FormGroup;
  submitted = false;
  registerForm!: FormGroup;
  errorMessage!: string;
  show = true;

  close() {
    this.show = false;
    setTimeout(() => this.show = true, 3000);
  }


  show2 = false;
  autohide = true;
  showStandard() {
    this.toastService.show('I am a standard toast');
  }

  showSuccess() {
    this.toastService.show('Owner ajouté avec succès', { classname: 'bg-success text-light', delay: 1900 });
    setTimeout(() => {
      this.router.navigate(['/users/list-owners']);
    }, 2000);  //5s
  }

  showDanger(dangerTpl) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 15000 });
  }


  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: "",
    role: "owner",
    sexe: ''
  };
  ngOnInit(): void {
    this.ownerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

    }, {
      validator: MustMatch('password', 'confirmPassword')
    }

    );
  }
  get f() { return this.ownerForm.controls; }
  onSubmit(dangerTpl) {

    this.submitted = true;

    // stop here if form is invalid
    if (this.ownerForm.invalid) {


      return;
    }

    // display form values on success
    this.add(dangerTpl);
   

  }


  add(dangerTpl) {
    // Vérification des mots de passe correspondants

    const ownerData = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      password: this.formData.password,
      phoneNumber: this.formData.phoneNumber,
      role: this.formData.role,
      sexe: this.formData.sexe,
      

    };
    this.api.addOwner(ownerData).subscribe(
      response => {
        // Gérer la réponse de succès
        console.log(response);
        this.showSuccess();
      },
      error => {
        // Gérer les erreurs
        if (error.error && error.error.message) {
          console.error(error.error.message);
          this.errorMessage = error.error.message;
          this.showDanger(dangerTpl)


        } else {
          console.error('An error occurred during login.');
          this.errorMessage = 'An error occurred during login.';
        }
      }
    );
  }
}
