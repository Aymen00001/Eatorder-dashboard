import { Component, OnInit } from '@angular/core';
import { ApiServices } from "../../../services/api"
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Store } from 'src/app/models/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-all-stores',
  templateUrl: './all-stores.component.html',
  styleUrls: ['./all-stores.component.scss']
})
export class AllStoresComponent implements OnInit {

  stores: Store[] = [];
  filteredRestaurants!: any[];
  pageSize: number = 20;
  currentPage = 1;
  totalStores: any;
  p: number = 1;
  searchForm!: FormGroup;
  noResultsFound: boolean = false;
  selectedStatus: string = 'all';
  ownerNames: { [storeId: string]: string } = {};
  searchQuery: string = '';
  allStores: Store[] = [];
  //private baseurl = 'http://localhost:8000';
  constructor(
    private apiService: ApiServices,
    private http: HttpClient,
    private paginationConfig: NgbPaginationConfig,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {

    paginationConfig.pageSize = 5;
    paginationConfig.boundaryLinks = true;
    this.searchForm = this.formBuilder.group({
      searchQuery: ['']
    });

  }

  ngOnInit(): void {
    this.currentPage = 2;
    this.getStores();

  }
  
  confirmDeleteStore(store: Store) {
    if (confirm("Voulez-vous supprimer ce magasin ?")) {
      this.deleteStore(store._id);
    }  
  }

  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    return this.datePipe.transform(date, 'MMMM d, yyyy');
  }



  deleteStore(storeId: string): void {
    this.apiService.deleteStore(storeId).subscribe(
      (response: any) => {
        // Suppression réussie, mettez à jour la liste des magasins
        this.getStores();
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur
      }
    );
  }


  getStores(): void {
    this.apiService.getStores(this.currentPage, this.pageSize, this.selectedStatus).subscribe(
      (response: any) => {
        this.stores = response.stores;
        this.filteredRestaurants = this.stores;
        this.fetchOwnersNames();
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur
      }
    );
  }
  fetchOwnersNames(): void {
    this.apiService.fetchOwnersNames(this.filteredRestaurants).subscribe(
      () => {
        // Toutes les opérations sont terminées avec succès
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }


  selectedStatusChange(): void {
    if (this.selectedStatus === 'pending' || this.selectedStatus === 'active' || this.selectedStatus === 'suspended' || this.selectedStatus === 'rejected' || this.selectedStatus !== 'suspended') {
      this.getStores();
    }
  }





  searchStores(): void {
    const searchQuery = this.searchQuery.toLowerCase();
  
    if (searchQuery) {
      this.filteredRestaurants = this.stores.filter(
        (store: Store) =>
          store.name.toLowerCase().includes(searchQuery) ||
          store.phoneNumber.toLowerCase().includes(searchQuery) ||
          store.address.toLowerCase().includes(searchQuery)
      );
    } else {
      this.filteredRestaurants = [...this.stores];
    }
    this.noResultsFound = this.filteredRestaurants.length === 0;
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

  disableStore(storeId: string): void {
    this.apiService.disableStore(storeId).subscribe(
      (response: any) => {
        // Store suspension successful, update the store list
        this.getStores();
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }


  confirmDisableStore(store: Store) {
    this.translate.get('disableStore').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.disableStore(store._id)
      } else {
        text = "You canceled!";
      }
    });
  }

  confirmEnableStore(store: Store) {
    this.translate.get('enableStore').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.activateStore(store._id);
            } else {
        text = "You canceled!";
      }
    });
  }



 


  activateStore(storeId: string): void {
    this.apiService.activateStore(storeId).subscribe(
      (response: any) => {
        // Store activation successful, update the store list
        this.getStores();
      },
      (error) => {
        console.error(error);
        // Handle the error
      }
    );
  }

  





}
