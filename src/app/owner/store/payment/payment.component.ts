import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor( private apiservice:ApiServices) { }

  ngOnInit(): void {
  
  }
  createStripeAccount() {
    const email = 'makseb88@gmail.com';
    const country = 'US'; 

    this.apiservice.createStripeAccount(email, country).subscribe(
      (response) => {
        console.log(response.url);
        
        window.open(response.url, '_blank');
      },
      (error) => {
        // Handle error
        console.error('Error creating Stripe account:', error);
      }
    );
  }
}
