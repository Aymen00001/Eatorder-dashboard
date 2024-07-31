import { Component, OnInit } from '@angular/core';
import { ApiServices } from "../../../services/api"
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Store } from 'src/app/models/store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-requested-stores',
  templateUrl: './requested-stores.component.html',
  styleUrls: ['./requested-stores.component.scss']
})
export class RequestedStoresComponent implements OnInit {

  searchQuery: string = '';

  pendingStores: Store[] = [];
  searchForm!: FormGroup;
  pageSize: number = 10;
  currentPage = 1;
  p: number = 1;
  filteredRestaurants!: any[];

  noResultsFound: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServices,
    private translate: TranslateService


  ) { 
    this.searchForm = this.formBuilder.group({
      searchQuery: ['']
    });
  }

  ngOnInit() {
    this.currentPage = 2;
    this.getPendingStores();
  }

  getPendingStores(): void {
    this.apiService.getPendingStores(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.pendingStores = response.stores;
        this.filteredRestaurants = [...this.pendingStores];
        this.searchStores();

        this.fetchOwnersNames(); 
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }

  searchStores(): void {
    const searchQuery = this.searchQuery.toLowerCase();
  
    if (searchQuery) {
      this.filteredRestaurants = this.pendingStores.filter(
        (store: Store) =>
          store.name.toLowerCase().includes(searchQuery) ||
          store.phoneNumber.toLowerCase().includes(searchQuery) ||
          store.address.toLowerCase().includes(searchQuery)
      );
    } else {
      this.filteredRestaurants = [...this.pendingStores];
    }
    this.noResultsFound = this.filteredRestaurants.length === 0;
  }

  

  

  confirmRejectStore(store: Store) {
    this.translate.get('rejeterStore').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.rejectStore(store._id);
      } else {
        text = "You canceled!";
      }
    });
  }

  confirmApprouveStore(store: Store) {
    this.translate.get('approuverStore').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.approveStore(store._id);
      } else {
        text = "You canceled!";
      }
    });
  }




  

  approveStore(storeId: string): void {
    this.apiService.approveStore(storeId).subscribe(
      (response: any) => {
        // Approval successful, update the list of pending stores
        this.getPendingStores();
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }

  rejectStore(storeId: string): void {
    this.apiService.rejectStore(storeId).subscribe(
      (response: any) => {
        // Rejection successful, update the list of pending stores
        this.getPendingStores();
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }

  fetchOwnersNames() {
    this.apiService.fetchOwnersNames(this.filteredRestaurants).subscribe(
      () => {
        // Call searchStores() after fetching owner names
        this.searchStores();
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }


  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3';
      case 'pending':
        return 'badge rounded-pill text-warning bg-light-warning p-2 text-uppercase px-3';
      case 'suspended':
        return 'badge rounded-pill text-danger bg-light-danger p-2 text-uppercase px-3';
      case 'rejected':
        return 'badge rounded-pill text-danger bg-light-danger p-2 text-uppercase px-3';
      // Add more cases for other status values and their corresponding class names
      default:
        return '';
    }
  }
}
