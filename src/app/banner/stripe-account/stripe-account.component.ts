import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@sentry/angular-ivy';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from 'src/app/toast-service';

@Component({
  selector: 'app-stripe-account',
  templateUrl: './stripe-account.component.html',
  styleUrls: ['./stripe-account.component.scss']
})
export class StripeAccountComponent implements OnInit {
  @ViewChild('modalContentt') modalContent: any;
  userr: User;
  store: any[];
    orderNumber: number;
  constructor(private apiServe: ApiServices,private toastService: ToastService, private modalService: NgbModal) {}

  ngOnInit(): void {
      const userr = this.apiServe.getUser();
      if (userr !== null) {
          this.userr = userr;
      } else { console.log("error");}
      this.get();
      this.getStorestipe();
  }

  get() {
      this.apiServe.getStoresOwner(this.userr._id).subscribe(
          (response) => {
              this.store = response[0];
              console.log(this.store);
              this.store.forEach((orderItem, index) => {
                this.orderNumber = index + 1;
                orderItem.orderNumber = index + 1;
              });
          },
          error => {}
      );
  }
  stores: any[] = [];
  filteredStores: any[] = [];
  getStorestipe() {
      this.apiServe.getStoresOwner(this.userr._id).subscribe(
          (response) => {
              console.log('Response:', response.stripeAccountId); 
              this.filteredStores = [];
                for (let storeGroup of response) {
                for (let store of storeGroup) {
                    console.log('Current Store:', store); 
                    console.log('Stripe Account ID:', store.stripeAccountId); 
                    if (store.stripeAccountId) {
                        this.filteredStores.push(store);
                    }} }
                          this.stores = response;
              console.log('Filtered Stores with stripeAccountId:', this.filteredStores);
          }, error => { console.error('Error fetching stores:', error); }
      );
  }
  selectedStore: { storeId: string, stripeAccountId: string } = { storeId: '', stripeAccountId: '' };
selectStore(selectElement: any,email:any,idstore:any) {
    const selectedValue = selectElement.value;
    const [storeId, stripeAccountId] = selectedValue.split('|');
    this.selectedStore = { storeId, stripeAccountId };
    console.log("Store ID selected:", storeId);
    console.log("Stripe Account ID:", stripeAccountId);
    console.log("Stripe email:", email);
    console.log("Stripe id:", idstore);

    if (selectedValue === 'other') {
      this.openModal2(this.modalContent,email,idstore);
  } else {
      // Handle other selections if needed
  }
}
selectStoreFromButton(store:any) {
    const { storeId, stripeAccountId } = this.selectedStore;
    console.log("Store ID from button:", storeId);
    console.log("Stripe Account ID from button:", stripeAccountId);
    console.log("Store  from button:", store);
    const data ={store,stripeAccountId}
    this.apiServe.switchStripe(data).subscribe(
      (response) => {
        this.get();
        this.toastService.show('Store créé avec succès un compte Stripe. ', { classname: 'bg-success text-light' });
      },
      error => {
        this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });


      }
  );
}
//Other Create Account
countries: string[] = ['US', 'CA', 'GB', 'FR', 'DE', 'AU']; // Exemple de codes de pays
compteemail:any;
compteidstore:any
openModal2(content: any,email:any,idstore:any) {
  this.compteemail=email;
  this.compteidstore=idstore
  console.log(this.compteidstore)
  this.modalService.open(content, { size: 'sm' }).result.then(
      (result) => {},
      (reason) => {
          console.log(`Modal dismissed with: ${reason}`);
      }
  );
}
addcomptstrip(email:any,storeId:any,country:any){
console.log(email,storeId,country)
  this.apiServe.createAccount(email, country, storeId).subscribe(
    (response)=>{},
      error=>{         this.toastService.show('Creation error', { classname: 'bg-danger text-light' });
    })
}

}
