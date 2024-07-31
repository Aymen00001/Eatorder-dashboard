import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { ProductOption } from '../../../models/productOption';
import { OptionGroup } from 'src/app/models/optionGroupe';
import { HttpClient } from '@angular/common/http';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbPaginationConfig, NgbModal  } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/toast-service';


@Component({
  selector: 'app-all-options',
  templateUrl: './all-options.component.html',
  styleUrls: ['./all-options.component.scss'],
  
})

export class AllOptionsComponent implements OnInit {

  user: User = {} as User; // Initialize with an empty User object
  userId: number = 0;
  p: number = 1;
  currentPage = 1;
  optionProduct: ProductOption[] = [];
  baseUrl = 'https://server.eatorder.fr:8000/'; // L'URL de votre serveur Node.js
  collapsed = true;
  selectedGroup: ProductOption | undefined; // Declare a variable to store the selected group
  isPromoChecked: boolean = false;
  imageFile: File;
  isModalOpen = false;
  optionGroups: OptionGroup[] = [];
  isPriceFieldVisible: boolean = false;
  selectedOption: ProductOption | undefined;
  selectedOptionGroup: OptionGroup | undefined;
  optionPrice: number | undefined = 0;
  selectedGroupId: string | undefined;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedOptionGroupId: string | null = null;
  option: any;
  optionDetails: { [groupId: string]: ProductOption } = {};
  selecteddOption: number = 0; // Modifier la déclaration de la propriété

  modalOpenDelay: number = 2000; // Temps d'affichage du modal en millisecondes (2 secondes dans cet exemple)
  searchQuery: string = '';
  searchForm!: FormGroup;

  optionGroupName: string = '';
  selectedGroupd: any; // Declare the selectedGroup property

  isAddToGroupModalOpen: boolean = false;
  defaultGroupId: string = 'default'; // ID of the default group

  pageSize: number = 20;

  showOptionDetails: boolean = false;
  searchTerm: string = '';

  constructor(private apiService: ApiServices, private http: HttpClient, private router: Router, private paginationConfig: NgbPaginationConfig,private toastService: ToastService
    ) {
    paginationConfig.pageSize = 5;
    paginationConfig.boundaryLinks = true;

   }
  active = "default";

  active2 = 'top';
  filteredOptions: ProductOption[] = [];

  active3;
  disabled = true;

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }
  goToAddOption() {
    this.router.navigateByUrl('/options/addOption');
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      this.active3 = 1;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getOptions();
  }

  active4 = 1;


  tabs = [1, 2, 3, 4, 5];
  counter = this.tabs.length + 1;
  active5;

  close(event: MouseEvent, toRemove: number) {
    this.tabs = this.tabs.filter(id => id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  add(event: MouseEvent) {
    this.tabs.push(this.counter++);
    event.preventDefault();
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
    this.selectedGroupd = { _id:'group_id', optionGroups: [] }; // Replace with your actual data

    // Provide the user ID here
    this.getOptions();
    this.updatePromoCheckedState();
    this.fetchOptionGroups();




  }

  resetModalData(): void {
    this.selectedGroup = undefined;
    this.isPromoChecked = false;
    this.imageFile = undefined;
    // Réinitialisez les autres propriétés du modal si nécessaire
  }
  

  onPromoCheckboxChange(): void {
    this.isPromoChecked = !this.isPromoChecked;
  }

  getUnitLabel(unitValue: number | undefined): string {
    switch (unitValue) {
      case 1:
        return 'Kg';
      case 2:
        return 'Piece';
      case 3:
        return 'Litre';
      default:
        return '';
    }
  }
  
  onNavItemChange(event: NgbNavChangeEvent, groupId: string): void {
    if (groupId !== 'default') {
      this.selectedOptionGroupId = groupId;
      this.getOptionDetails(groupId, this.selectedGroup?._id); // Call getOptionDetails to fetch the details
      const optionInGroup = this.optionDetails[groupId];

      if (optionInGroup) {
        const optionIdInGroup = optionInGroup._id;
        console.log("Option ID in Group: ", optionIdInGroup);
      }
  
    } else if (groupId == 'default') {
      console.log("Option ID ", groupId);
    }
  }
  
 


  getOptionDetails(groupId: string, optionId: string): void {
    this.apiService.getOptionInGroupe(groupId, optionId).subscribe(
      (response: any) => {
        this.optionDetails[groupId] = response.option;
        this.selecteddOption = this.optionDetails[groupId]?.price || 0; // Stocker le prix dans la propriété selectedOption
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  
  
  
  
  
  
  
  
  

  updateOption(): void {
    
    if (!this.selectedGroup) {
      return; // Vérifiez si une option est sélectionnée
    }
  
    const optionId = this.selectedGroup._id;
    const optionData = {
      name: this.selectedGroup.name,
      price: this.selectedGroup.price,
      tax: this.selectedGroup.tax,
      isDefault: this.selectedGroup.isDefault,
      promoPercentage: this.isPromoChecked ? this.selectedGroup.promoPercentage : null,
      unite: Number(this.selectedGroup.unite) // Convertir l'unité en nombre avant de l'enregistrer
    };
  
    this.apiService.updateOption(optionId, optionData, this.imageFile).subscribe(
      (response: any) => {
        // Gestion de la réponse réussie
        console.log(response);
        this.successMessage = 'Option saved successfully.';
        this.errorMessage = ''; // Reset the error message
        this.getOptions();
      },
      (error: any) => {
        this.successMessage = ''; // Reset the success message
        this.errorMessage = 'Failed to save option. Please try again.';
        // Gérer les erreurs lors de la mise à jour de l'option
        console.error(error);
      }
    );
  }
  

  getGroupName(groupId: string): string {
    const optionGroup = this.optionGroups.find(group => group._id === groupId);
    return optionGroup ? optionGroup.name : '';
  }

  getGroupImage(groupId: string): string {
    const optionGroup = this.optionGroups.find(group => group._id === groupId);
    return optionGroup ? optionGroup.image : '';
  }

  getGroupNamesForOption(option: ProductOption): string[] {
    if (!option || !option.optionGroups) {
      return [];
    }
  
    return option.optionGroups.map(groupId => this.getGroupName(groupId));
  }
  
  
 
  

  fetchOptionGroups() {
    this.apiService.getOptionGroups(this.apiService.getStore()).subscribe(
      response => {
        this.optionGroups = response.optionGroups;
        console.log(this.optionGroups);
  
        if (this.optionGroups.length > 0) {
          const groupId = this.optionGroups[0]._id; // Access the _id property of the groupId object
          this.selectedGroupId = groupId; // Assign the ID to the selectedGroupId variable
          console.log(groupId);

        }
      },
      error => {
        console.error(error);
      }
    );
  }

  // ...

  updateOptionGroupsAndDetails(): void {
    // Fetch option groups and their details after removing an option from a group
    this.fetchOptionGroups();
    this.resetOptionDetails();
  }


  removeOptionGroup(groupId: string): void {
    const optionId = this.selectedGroup?._id;
    if (!optionId) {
      return;
    }
  
    const originalSelectedGroup = { ...this.selectedGroup };
  
    const confirmRemove = confirm('Are you sure you want to remove this option from the group?');
    if (confirmRemove) {
      this.apiService.removeOptionFromGroup(groupId, optionId).subscribe(
        (response: any) => {
          if (response.group) {
            this.selectedGroup = response.group;
            console.log(this.selectedGroup);
            this.updateOptionGroupsAndDetails();
            this.closeAddToGroupModal();
            this.getOptions(); // Rafraîchissez les options


          } else {
            this.selectedGroup = originalSelectedGroup;
          }
  
          // Réinitialisez les détails de l'option
       
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }
  

  reloadOption(): void {
    // Mettez à jour les informations de l'option en appelant le service ou en effectuant une nouvelle requête API pour récupérer les données de l'option.
    // Par exemple, vous pouvez appeler une fonction fetchOption() qui récupère les données de l'option à partir de l'API.
    this.getOptions();
  }
  
  
  


  resetOptionDetails(): void {
    this.selectedGroup = null;
    this.optionDetails = {}; // Remplacez ceci par l'initialisation appropriée de l'objet optionDetails
    // Réinitialisez d'autres propriétés de l'option si nécessaire
  }
  
  
  
  

  
 

  deleteOption(option: ProductOption): void {
    const confirmDelete = confirm('Are you sure you want to delete this option?');
    if (confirmDelete) {
      this.apiService.deleteOption(option._id).subscribe(
        (response: any) => {
          // Suppression réussie, mettez à jour la liste des options
          this.showSuccess("Option group deleted successfully.");
          this.getOptions();
          
        },
        (error: any) => {
          console.error(error);
          // Gérer les erreurs lors de la suppression de l'option
          this.showError(" Error deleted Option .");

        }
      );
    }
  }

  getOptions(): void {
    this.apiService.getOptionsByStoreId(this.apiService.getStore()).subscribe(
      (response: any) => {
        // Handle the response containing the options
        const options = response;
        this.optionProduct = response.options;
        this.filteredOptions = options; // Copy the options to the filteredOptions array

        console.log(this.filteredOptions);
      },
      (error: any) => {
        // Handle any errors
        console.error(error);
      }
    );
  }
  

 

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }



  openModal(option: ProductOption, modalType: string): void {
    this.selectedGroup = option; // Set the selected group to the option
  console.log(" this.selectedGroup", this.selectedGroup)
    if (modalType === 'edit') {
      // Call getOptionDetails to fetch option details before opening the modal
      this.isModalOpen = true;
      this.fetchModeAndTaxInfo();

    } else if (modalType === 'addToGroup') {
      this.isAddToGroupModalOpen = true;
      this.isPriceFieldVisible = true; // Show the price field
      this.selectedGroupId = undefined; // Reset the selected group ID
  
      // Initialize optionPrice with selectedGroup.price
      this.optionPrice = this.selectedGroup?.price || 0;
    }
  
    // Update the promo checkbox state
    this.updatePromoCheckedState();
  }
  allModes: any[] = [];

  fetchModeAndTaxInfo() {
    if (this.selectedGroup && this.selectedGroup.taxes) {
      this.apiService.getConsumationModes(this.apiService.getStore()).subscribe(
        (modes) => {
          this.allModes = modes;
          this.selectedGroup.taxes.forEach((taxEntry: any) => {
            this.filterModeById(taxEntry.mode);
            this.getTaxById(taxEntry.tax);
          });
        },
        (error) => {
          console.error('Error retrieving modes', error);
        }
      );
    }
  }
  filterModeById(modeId: string) {
    console.log(modeId)
    this.selectedMode = this.allModes.find(mode => mode.mode._id === modeId);
  }
  selectedMode: any;
  modifiedTax: string = '';
  modifiedRateTax: number = 0;
  getTaxById(taxId: string): void {
    this.apiService.getTaxById(taxId).subscribe(
      (tax) => {
        this.modifiedTax = tax.name;
        this.modifiedRateTax = tax.rate;
        console.log(this.modifiedTax + " ", this.modifiedRateTax);
      },
      (error) => {
        console.error('Error getting tax:', error);
      }
    );
  }
  
  
  
  

  closeAddToGroupModal(): void {
    this.isModalOpen = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  updatePromoCheckedState(): void {
    this.isPromoChecked = this.selectedGroup?.promoPercentage !== null;
  }
  
  addToGroup(groupId: string | undefined, optionId: string | undefined, optionPrice: number | undefined): void {
    // Vérifiez si un groupe d'option est sélectionné
    if (!groupId || !optionId) {
      return;
    }
  
    // Appelez la méthode addToGroup() du service ApiServices en passant l'ID du groupe
    this.apiService.addToGroup(groupId, optionId, optionPrice).subscribe(
      (response: any) => {
        console.log('addToGroup1'); // Log message when the subscription is complete
  
        // Gérez la réponse réussie
        console.log(response);
        this.successMessage = 'Option added to group successfully.';
        this.showSuccess("Option added to group successfully.")
        this.errorMessage = ''; // Réinitialisez le message d'erreur
        this.getOptions(); // Rafraîchissez les options
        this.closeAddToGroupModal(); // Fermez le modal
      },
      (error: any) => {
        // Gérez l'erreur de réponse
        this.successMessage = ''; // Réinitialisez le message de réussite
        this.errorMessage = 'Failed to add option to group. Please try again.';
        this.showError("Failed to add option to group. Please try again.")
        console.error(error);
      },
      () => {
        console.log('addToGroup completed'); // Log message when the subscription is complete
      }
    );
  }
  
  
  
  
  
  updateOptionInGroupe(): void {
    // Your existing code for updating the option goes here...
    if (!this.selectedOptionGroupId) {
      // If selectedOptionGroupId is null, it means the 'default' tab is selected,
      // so update the option directly
      this.updateOption();
    } else {
      // Otherwise, update the option in the group
      const groupId = this.selectedOptionGroupId;
      const optionId = this.optionDetails[groupId]._id;
      console.log("hello IAM: "+ optionId);
      const optionData = this.optionDetails[groupId];
      if (!optionData) {
        console.error('Option data not available for the selected group.');
        return;
      }
      const imageFile = this.imageFile;
      this.apiService.updateOptionInGroup(groupId, optionId, optionData, imageFile).subscribe(
        (response: any) => {
          // Handle the response from the API
          console.log(response);
          // Handle the success message and other actions if needed
        },
        (error: any) => {
          // Handle the error from the API
          console.error(error);
          // Handle the error message and other actions if needed
        }
      );
    }
  }
  
  
  
 filterOptionsByName(): void {
    if (!this.searchQuery) {
      this.filteredOptions = [...this.optionProduct];
    } else {
      this.filteredOptions = this.optionProduct.filter((option) =>
        option.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  
  
//toast
showSuccess(msg) {
  this.toastService.show(`${msg}`, { classname: 'bg-success text-light', delay: 10000 });
}
showError(msg) {
  this.toastService.show(`${msg}`, { classname: 'bg-danger text-light', delay: 10000 });
}
  


}
