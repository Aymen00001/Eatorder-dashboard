import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiServices} from "../../services/api"
import { LoginResponse } from 'src/app/models/login-response.model';
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submitted = false;
  registerForm!: FormGroup;
  errorMessage!: string;
  email!: string;

  constructor(private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, private Api:ApiServices,private translate: TranslateService) { }

	// On SignIn link click
	onSignIn() {
	  this.router.navigate(['sign-in'], { relativeTo: this.route.parent });

	}
  get f() { return this.registerForm.controls; }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
    
      email: ['', [Validators.required, Validators.email]],   

    },

    );
  }
  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {


      return;
    }

    // display form values on success
    this.forgotPassword();
   

  }

  forgotPassword(): void {
    this.Api.forgetPassword(this.email)
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
