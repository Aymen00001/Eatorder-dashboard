import { Component, OnInit } from '@angular/core';
import { ApiServices } from "../../../services/api"

import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Store } from 'src/app/models/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rejected-stores',
  templateUrl: './rejected-stores.component.html',
  styleUrls: ['./rejected-stores.component.scss']
})
export class RejectedStoresComponent implements OnInit {

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

  ngOnInit () {
    this.currentPage = 2;
    this.getRejectedStores();  
  }

  getRejectedStores(): void {
    this.apiService.getRejectedStores(this.currentPage, this.pageSize).subscribe(
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

  deleteStore(storeId: string): void {
    this.apiService.deleteStore(storeId).subscribe(
      (response: any) => {
        // Suppression réussie, mettez à jour la liste des magasins
        this.getRejectedStores();
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur
      }
    );
  }

  approveStore(storeId: string): void {
    this.apiService.approveStore(storeId).subscribe(
      (response: any) => {
        // Approval successful, update the list of pending stores
        this.getRejectedStores();
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }


  


  confirmDeleteStore(store: Store) {
    this.translate.get('deleteStores').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.deleteStore(store._id);
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




 



}
