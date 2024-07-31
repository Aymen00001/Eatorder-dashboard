import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiServices} from "../../services/api"
import { LoginResponse } from 'src/app/models/login-response.model';
import { User } from 'src/app/models/user';
import { ToastService } from './toast-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  errorMessage!: string;
  email!: string;
  password!: string;
  registerForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
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
    this.toastService.show('I am a success toast', { classname: 'bg-success text-light', delay: 10000 });
  }

  showDanger(dangerTpl) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light', delay: 5000 });
  }

    constructor(private router: Router,private formBuilder: FormBuilder, private route: ActivatedRoute, private Api :ApiServices ,private toastService: ToastService,
      private translate: TranslateService
  ) { }

    // On Forgotpassword link click
    onForgotpassword() {
      this.router.navigate(['forgot-password'], { relativeTo: this.route.parent });
    }
  
    // On Signup link click
    onSignup() {
      this.router.navigate(['sign-up'], { relativeTo: this.route.parent });
    }
  

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required,Validators.minLength(6)]],

      
    },
    
    );
  }
  get f() { return this.registerForm.controls; }
  onSubmit(dangerTpl) {
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
  

      return;
    }

    // display form values on success
    this.login(dangerTpl);
   

  }
  login(dangerTpl): void {
    this.Api.login(this.email, this.password)
      .subscribe(
        (response: LoginResponse) => {
          // Handle successful login response
          const token = response.token;
          const userData = response.user;
          const user: User =response.user;
          if (!user.verifid)

          {
            this.router.navigate(["/auth/verification"],{ queryParams: { id:user._id }});
          }
          else 
          {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role);
           // console.log(localStorage.getItem('role'))
          //modifier role
          this.router.navigate(['/dashboard/analytics']);
        }
        },
        error => {
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
