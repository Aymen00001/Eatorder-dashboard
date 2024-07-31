import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { OptionGroup } from 'src/app/models/optionGroupe';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-addtax',
  templateUrl: './addtax.component.html',
  styleUrls: ['./addtax.component.scss']
})
export class AddtaxComponent implements OnInit {
  tax:any;
  ratetax:any;
  taxes: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  modifiedTax: any;
  modifiedRateTax: any;
  store: any[] ;
  user: User;
  errorMessage: any;
  product:Product[]=[];
  storeId:any="Select your store";
  productId: any="Select your product";
  selectedCategory: any;
  selectedTax: any;
  Categorys: Category[] = [];
  constructor( private apiservices :ApiServices) { }

  ngOnInit(): void {
    this.getAllTaxes();
    this.getuser();
    this.getStore();
    // this.fetchOptionGroups();

  }
  getuser()
  {
  const user = this.apiservices.getUser();
  if (user !== null) {
    this.user = user;
    
   console.log(user._id)
        
  } else {
    // Handle the case when the user is null
    console.log("error");
  }
}
  addTax(name: string, rate: number): void {
    const storeId =this.apiservices.getStore();
    this.apiservices.addTax(name, rate,storeId).subscribe(
      response => {
       console.log('Tax added successfully:', response.tax);
        // Add your logic to handle the response or display success messages here
   
        this.taxes.push(response.tax);
        // Clear the input fields after successful addition
        
      },
      error => {
        console.error('Error adding tax:', error);
        // Add your logic to handle the error or display error messages here
      }
    );
  }
  // getAllTaxes(): void {
  //   this.apiservices.getAllTax().subscribe(
  //     taxes => {
  //       this.taxes = taxes;
  //       console.log('All taxes:', this.taxes);
  //     },
  //     error => {
  //       console.error('Error getting taxes:', error);
  //       // Add your logic to handle the error or display error messages here
  //     }
  //   );
  // }
  getAllTaxes(page?: number, limit?: number): void {
    this.apiservices.getAllTax(page, limit,this.apiservices.getStore()).subscribe(
      data => {
        this.taxes = data.taxes;
        this.totalPages = data.totalPages;
        console.log('All taxes:', this.taxes);
      },
      error => {
        console.error('Error getting taxes:', error);
        // Add your logic to handle the error or display error messages here
      }
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.getAllTaxes(this.currentPage);
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllTaxes(this.currentPage);
    }
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllTaxes(this.currentPage);
    }
  }
  deleteTax(taxId: string): void {
    console.log(taxId);
    this.apiservices.deleteTax(taxId).subscribe(
      response => {
        console.log('Tax deleted successfully:', response);
        // Add your logic to handle the response or display success messages here
        // After deleting the tax, you may want to update the list of taxes by calling getAllTaxes() again
        this.getAllTaxes();
      },
      error => {
        console.error('Error deleting tax:', error);
        // Add your logic to handle the error or display error messages here
      }
    );
  }
  // getTaxDetails(taxId: string): void {
  //   this.apiservices.getTaxById(taxId).subscribe(
  //     tax => {
  //       // Assuming the server returns an object with name and rate properties
  //       this.modifiedTax = tax.name;
  //       this.modifiedRateTax = tax.rate;
  //     },
  //     error => {
  //       console.error('Error getting tax details:', error);
  //       // Add your logic to handle the error or display error messages here
  //     }
  //   );
  // }
  openModifyTaxModal(taxId: string): void {
    this.apiservices.getTaxById(taxId).subscribe(
      (tax) => {
        this.modifiedTax = tax.name;
        this.modifiedRateTax = tax.rate;
        console.log(this.modifiedTax+" " , this.modifiedRateTax)
      },
      (error) => {
        console.error('Error getting tax:', error);
        // Add your logic to handle the error or display error messages here
      }
    );
  }
  saveModifiedTax(taxId: string): void {
    // Call the API to update the tax details
    this.apiservices.updateTax(taxId, this.modifiedTax, this.modifiedRateTax).subscribe(
      (updatedTax) => {
        console.log('Tax updated successfully:', updatedTax);
        // Add your logic to handle the response or display success messages here

        // After updating the tax, you may want to update the list of taxes by calling getAllTaxes() again
        this.getAllTaxes();
      },
      (error) => {
        console.error('Error updating tax:', error);
        // Add your logic to handle the error or display error messages here
      }
    );
  }
  getStore()
  {
    
   this.apiservices.getStoresOwner(this.user._id).subscribe(
     (response  )=> {
      
       this.store=response[0];
    
      console.log(this.store);
      
     },
     error =>{
       if (error.error && error.error.message) {
         console.error(error.error.message);
         this.errorMessage = error.error.message;
   
 
 
       } else {
         console.error('An error occurred during login.');
         this.errorMessage = 'An error occurred during login.';
       }
     }
     
     
   )
  }
  getProductBystore()
  {
    this.apiservices.getPoductByStore(this.storeId).subscribe
    (
      Response =>{
        this.product = Response
        console.log(this.product);
       
     
      },
      error =>{
        console.error(error);
      }

    );
  }
  getstoreid(id: { toString: () => any; }) {
    
    this.storeId = id;
    console.log(this.storeId)
    this.getProductBystore();
    this.fetchCategorys();


  } 
   getproductid(id: { toString: () => any; }) {
    
    this.productId = id;
  }
  getcategoryid(id: { toString: () => any; })
  {
    this.selectedCategory = id;
    console.log(this.selectedCategory)
  }
  addTaxToProduct(productId: string, taxId: string): void {
    this.apiservices.addTaxToProduct(productId, taxId).subscribe(
      (response) => {
        console.log('Tax added to product successfully:', response);
        // Add your logic to handle the response or display success messages here

        // Refresh the list of taxes or update the product's taxes array
        // This step depends on how you have implemented the tax and product listing in your UI
      },
      (error) => {
        console.error('Error adding tax to product:', error);
        // Add your logic to handle the error or display error messages here
      }
    );
  }
  fetchCategorys() {
    this.apiservices.getCategoriesByStoreOnly(this.storeId).subscribe(
      response => {
        this.Categorys = response.categories;
        console.log(this.Categorys)
      
      },
      error => {
        console.error(error);
      }
    );
  }
  addTaxToCategory(selectedCategory,taxId): void {
  
      this.apiservices.addTaxToCategory(selectedCategory, taxId)
        .subscribe(
          response => {
            console.log('Tax added to category:', response);
            // Handle success, show a success message, etc.
          },
          error => {
            console.error('Error adding tax to category:', error);
            // Handle error, show an error message, etc.
          }
        );
   
  }
  //addoption
  optionGroups: OptionGroup[] = [];
  onStoreChange(storeId: string) {
    this.storeId = storeId;
    this.fetchOptionGroupsByStore(storeId);
    this.fetchConsumationModes(storeId);
  }

  fetchOptionGroupsByStore(storeId: string) {
    this.apiservices.getOptionGroups(storeId).subscribe(
      response => {
        this.optionGroups = response.optionGroups.map((group: OptionGroup) => ({
          ...group,
          checked: false // Add the 'checked' property here
        }));
        console.log(this.optionGroups);
      },
      error => {
        console.error('Error fetching option groups:', error);
      }
    );
  }
  consumationModes:any;
  modeId:any;
  selectedModes: string[] = []; // Array to store selected mode IDs

  fetchConsumationModes(storeId: string): void {
    this.apiservices.getConsumationModes(storeId).subscribe(
      (consumationModes) => {
        this.consumationModes = consumationModes;
      },
      (error) => {
        console.error('Error fetching consumation modes:', error);
      }
    );
  }
  toggleModeSelection(modeId: string): void {
    const index = this.selectedModes.indexOf(modeId);
    if (index === -1) {
      this.selectedModes.push(modeId); // Add mode ID if not already selected
    } else {
      this.selectedModes.splice(index, 1); // Remove mode ID if already selected
    }
  }

  isModeSelected(modeId: string): boolean {
    return this.selectedModes.includes(modeId);
  }

  addTaxToOption(optionId: string, modeIds: string[], taxId: string) {
    // Add tax to the product logic
    console.log('Adding tax to option:', optionId, modeIds, taxId);
  }

}
