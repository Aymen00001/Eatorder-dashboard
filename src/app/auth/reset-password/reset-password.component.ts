import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiServices} from "../../services/api"
import { LoginResponse } from 'src/app/models/login-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute,private formBuilder: FormBuilder, private Api :ApiServices) { }

  id: string;
  token: string;
  password: string;
  confirmPassword: string;
  errorMessage: string;
  submitted = false;
  registerForm!: FormGroup;
	// On Login link click
	onLogin() {
	  this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
	}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        console.log(params); // 
        this.id = params.id;
        this.token = params.tk;
        console.log(this.id); // 
        console.log(this.token);
      });
      this.registerForm! = this.formBuilder.group({
       
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
  
      }, {
        validator: MustMatch('password', 'confirmPassword')
      }
  
      );
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {


      return;
    }

    // display form values on success
    this.resetPassword();
   

  }
  resetPassword(): void {
    console.log(this.password)
    this.Api.resetPassword( this.password ,this.id, this.token)
      .subscribe(
        (response: LoginResponse) => {
          this.router.navigate(['/dashboard/analytics']);
        },
        error => {
     
          if (error.error && error.error.message) {
            console.error(error.error.message);
            this.errorMessage = error.error.message;
   
            
          } else {
            console.error('An error occurred during login.');
            this.errorMessage = 'An error occurred during login.';
          }
        }
      );
  }

  
}
