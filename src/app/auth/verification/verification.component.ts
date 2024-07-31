import { Component, OnInit } from '@angular/core';
import { ApiServices} from "../../services/api"
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponse } from 'src/app/models/login-response.model';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  constructor(private Api :ApiServices,private router: Router, private route: ActivatedRoute) { }
  id :any
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params); // 
      this.id = params.id;

      console.log(this.id); // 

    });
  }
  sendverification(): void {
  
    this.Api.sendVerification( this.id )
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
