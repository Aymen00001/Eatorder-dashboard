import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { OptionGroup } from '../../../models/optionGroupe';
import { NgbPaginationConfig, NgbModal  } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-all-groupe-option',
  templateUrl: './all-groupe-option.component.html',
  styleUrls: ['./all-groupe-option.component.scss']
})
export class AllGroupeOptionComponent implements OnInit {

  user: User = {} as User; // Initialize with an empty User object
  userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée
  optionGroups: OptionGroup[] = [];
  pageSize: number = 6;
  currentPage = 1;
  p: number = 1;
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  isModalOpen: boolean = false;
  selectedGroup: OptionGroup | null = null;
  imageFile: File | undefined; // Add the 'imageFile' property
  successMessage: string | null = null; // Add the 'successMessage' property with an initial value of null
  errorMessage: string | null = null; // Add the 'errorMessage' property with an initial value of null
  searchQuery: string = '';
  searchForm!: FormGroup;
  filteredGroupeOptions: OptionGroup[] = [];


  constructor(private apiService: ApiServices, private paginationConfig: NgbPaginationConfig, private router: Router) { 
    
    paginationConfig.pageSize = 5;
    paginationConfig.boundaryLinks = true;
  }

  ngOnInit(): void {
    const user = this.apiService.getUser();
    if (user !== null) {
      this.user = user;
      this.userId = this.user._id;

      console.log(this.userId)
    } else {
      // Handle the case when the user is null
    }
    this.currentPage = 2;

    this.fetchOptionGroups();


    

  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.imageFile = inputElement.files[0];
    } else {
      this.imageFile = undefined;
    }
  }

  goToAddGroupeOption() {
    this.router.navigateByUrl('/options/addGroupeOption');
  }

  openModal(group: OptionGroup): void {
    this.selectedGroup = group;
    this.isModalOpen = true;
  }
  

  closeAddToGroupModal(): void {
    this.isModalOpen = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchOptionGroups();
  }

  fetchOptionGroups() {
    this.apiService.getOptionGroups(this.apiService.getStore()).subscribe(
      response => {
        this.optionGroups = response.optionGroups;
  
        // Filtrer les groupes d'options en fonction de la recherche
        this.filteredGroupeOptions = this.optionGroups.filter((group) =>
          group.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      error => {
        console.error(error);
      }
    );
  }
  


  deleteOptionGroup(group: OptionGroup): void {
    let confirmMessage = 'Are you sure you want to delete this option group?';
    if (group.options && group.options.length > 0) {
      confirmMessage = 'Are you sure you want to delete this option group with options?';
    }
  
    const confirmDelete = confirm(confirmMessage);
    if (confirmDelete) {
      this.apiService.deleteOptionGroup(group._id).subscribe(
        () => {
          // Option group deleted successfully, update the optionGroups array
          this.optionGroups = this.optionGroups.filter((g) => g._id !== group._id);
        },
        (error) => {
          console.error(error);
          // Handle error scenario
        }
      );
    }
  }
  

  updateOptionGroup(): void {


    const groupId = this.selectedGroup._id;
    const optionGroupData = {
      name: this.selectedGroup.name,
      description: this.selectedGroup.description,
      force_min: this.selectedGroup.force_min,
      force_max: this.selectedGroup.force_max,
      allow_quantity: this.selectedGroup.allow_quantity,


    };

    // Call the API service method to update the option group
    this.apiService.updateOptionGroup(groupId, this.selectedGroup).subscribe(
      (response: any) => {
        // Handle the successful response
        console.log('Option group updated successfully', response);
        this.successMessage = 'Option group updated successfully.';
        this.errorMessage = null; // Reset the error message
        this.fetchOptionGroups(); // Refresh the option groups list
      },
      (error: any) => {
        // Handle the error response
        console.error('Error while updating option group', error);
        this.successMessage = null; // Reset the success message
        this.errorMessage = 'Failed to update option group. Please try again.';
      }
    );
  }


  removeOptionFromGroup(groupId: string, optionId: string): void {
    // Show confirmation dialog/modal if needed
    const confirmRemove = confirm('Are you sure you want to remove this option from the group?');
    if (confirmRemove && this.selectedGroup) {
      this.apiService.removeOptionFromGroup(groupId, optionId).subscribe(
        () => {
          // Option removed from group successfully, update the selectedGroup and fetchOptionGroups
          if (this.selectedGroup.options) {
            this.selectedGroup.options = this.selectedGroup.options.filter((option) => option.option !== optionId);
          }
          this.fetchOptionGroups();
        },
        (error) => {
          console.error(error);
          // Handle error scenario
        }
      );
    }
  }
  
  
  
  

}
