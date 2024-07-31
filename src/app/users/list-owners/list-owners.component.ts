import { Component, OnInit } from '@angular/core';
import { ApiServices} from "../../services/api"
import { User } from 'src/app/models/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationConfig, NgbModal  } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-list-owners',
  templateUrl: './list-owners.component.html',
  styleUrls: ['./list-owners.component.scss']
})


export class ListOwnersComponent implements OnInit {
  [x: string]: any;


  searchForm!: FormGroup;
  noResultsFound: boolean = false;
  owners: User[] = [];
  totalOwners = 0;
  filteredOwners: any[] = [];
  searchQuery: string = '';
  pageSize: number = 8;
  currentPage = 1;
  p: number = 1;
  selectedOwner: any;




  constructor(
    private datePipe: DatePipe,
    private apiService: ApiServices,
    private paginationConfig: NgbPaginationConfig,
    private modalService: NgbModal,
    private translate: TranslateService



    ) { 

      paginationConfig.pageSize = 5;
      paginationConfig.boundaryLinks = true;

    }

  ngOnInit() {
    this.currentPage = 2;
    this.getOwners();
  }


  deleteOwner(ownerId: number) {
    this.apiService.deleteOwner(ownerId).subscribe(
      (response: any) => {
        console.log(response.message);
        this.getOwners();
        // Handle success, e.g., display a success message
      },
      (error: any) => {
        console.error(error);
        // Handle error, e.g., display an error message
      }
    );
  }

  confirmDeleteOwner(owner: User) {
    if (confirm("Are you sure you want to delete this owner?")) {
      this.deleteOwner(owner._id);
    }
  }
  


  openOwnerDetailsModal(owner: User, content: any) {
    this.selectedOwner = owner;
    this.modalService.open(content, { scrollable: true });
  }



  getOwners(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.apiService.getOwners(startIndex, this.pageSize).subscribe(
      (response: any) => {
        // Assign the response data to component properties
        this.owners = response.owners;
        this.totalOwners = response.ownerCount;
        console.log(this.totalOwners);

        this.filteredOwners = this.owners; // Initialize the filtered owners with all owners
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getOwners();
  }


  searchOwners(): void {
    const query = this.searchQuery.toLowerCase();

    if (query) {
      this.filteredOwners = this.owners.filter(
        (owner: User) =>
          owner.firstName.toLowerCase().includes(query) ||
          owner.lastName.toLowerCase().includes(query) ||
          owner.email.toLowerCase().includes(query) ||
          owner.status.toLowerCase().includes(query) ||
          owner.phoneNumber.toLowerCase().includes(query) 
      );
    } else {
      this.filteredOwners = this.owners;
    }
    this.noResultsFound = this.filteredOwners.length === 0;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge rounded-pill text-success bg-light-success p-2 text-uppercase px-3';
      case 'pending':
        return 'badge rounded-pill text-warning bg-light-warning p-2 text-uppercase px-3';
      case 'suspended':
        return 'badge rounded-pill text-danger bg-light-danger p-2 text-uppercase px-3';
      // Add more cases for other status values and their corresponding class names
      default:
        return '';
    }
  }

    formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    return this.datePipe.transform(date, 'MMMM d, yyyy');
  }


  confirmDisableOwner2(owner: User) {
      if (confirm("Voulez vous suspendre ce proprietaire ? ")) {
        this.disableOwner(owner._id);
      }  
   }
   confirmDisableOwner(owner: User) {
    this.translate.get('disableOwnermessage').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.disableOwner(owner._id)
      } else {
        text = "You canceled!";
      }
    });
  }

   confirmEnableOwner(owner: User) {
    this.translate.get('enableOwnermessage').subscribe((translation: string) => {
      let text = translation;
      if (confirm(text) == true) {
        this.enableOwner(owner._id)
      } else {
        text = "You canceled!";
      }
    });
  }

  
  disableOwner(ownerId: number) {
    // Call the disableOwner service method with the ownerId
    this.apiService.disableOwner(ownerId).subscribe(
      (response: any) => {
        console.log(response.message);
        this.getOwners();

        // Handle success, e.g., display a success message
      },
      (error: any) => {
        console.error(error);
        // Handle error, e.g., display an error message
      }
    );
  }






  enableOwner(ownerId: number) {
    // Call the disableOwner service method with the ownerId
    this.apiService.enableOwner(ownerId).subscribe(
      (response: any) => {
        console.log(response.message);
        this.getOwners();

        // Handle success, e.g., display a success message
      },
      (error: any) => {
        console.error(error);
        // Handle error, e.g., display an error message
      }
    );
  }




  
}
