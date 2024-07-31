import { Component, OnInit } from '@angular/core';
import { ApiServices} from "../../services/api"
import { LoginResponse } from 'src/app/models/login-response.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {
  id: any;

  constructor( private Api :ApiServices,private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    //  console.log(params); // 
      this.id = params.id;

    //  console.log(this.id); // 

    });
    this.resetPassword()
  }

  resetPassword(): void {
  
    this.Api.verification( this.id )
      .subscribe(
        (response: LoginResponse) => {
          this.router.navigate(['/auth/sign-in']);
        },
        error => {
     
          if (error.error && error.error.message) {
            console.error(error.error.message);
           
   
            
          } else {
            console.error('An error occurred during login.');
          
          }
        }
      );
  }
}
