import { Component, OnInit } from '@angular/core';
import { User } from '@sentry/angular-ivy';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from '../../menu-setup/toast-service';


@Component({
  selector: 'app-clonemenu',
  templateUrl: './clonemenu.component.html',
  styleUrls: ['./clonemenu.component.scss']
})
export class ClonemenuComponent implements OnInit {
  userr: User;
  store: any[];

  constructor(private apiServe: ApiServices,private toastService:ToastService) {}

  ngOnInit(): void {
      const userr = this.apiServe.getUser();
      if (userr !== null) {
          this.userr = userr;
      } else {
          console.log("error");
      }
      this.get();
  }
  excludedStoreID: string;
  get() {
    const OldStoreID = localStorage.getItem('storeid');
    this.apiServe.getStoresOwner(this.userr._id).subscribe(
        (response) => {
            this.store = response[0];
            this.excludedStoreID = OldStoreID;
            this.store = this.store.filter(str => str._id !== this.excludedStoreID);
            console.log(this.store);
        },
        error => {}
    );
}

  selectstore:any;
  loadingCategories: boolean = false;
  messageErrors: { [key: string]: string } = {};

  selectStore() {
    if (!this.selectstore ) {
        this.messageErrors['selectstore'] = 'Please Select Store';
        setTimeout(() => { this.messageErrors['selectstore'] = ''; }, 2000);
        return;
      }
    const isConfirmed = confirm('Are you sure you want Select this Store?');
    if (isConfirmed) {
        this.loadingCategories = true; 
        const newStoreID=this.selectstore
    const OldStoreID = localStorage.getItem('storeid');
    //console.log("Store ID selected:", newStoreID);
   // console.log("Store OldStoreID selected:", OldStoreID);
    this.apiServe.clonemenu({newStoreID,OldStoreID}).subscribe(
        (response) => { 
            this.toastService.show('The store clone successfully ', { classname: 'bg-success text-light' });
            this.loadingCategories = false; 
            this.selectstore=null;
        },
        error => {
            this.toastService.show('Store .', { classname: 'bg-success text-light' });

        }  
          );} else {  console.log('Store canceled'); }
  }

}
