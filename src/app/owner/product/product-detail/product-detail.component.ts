import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionGroup } from 'src/app/models/optionGroupe';
import { User } from 'src/app/models/user';
import { ApiServices } from 'src/app/services/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  optionGroups: OptionGroup[] = [];
  user: User = {} as User; // Initialize with an empty User object
  userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée
  id:any
  public isCollapsed = true;

  constructor(private route: ActivatedRoute , private apiservice :ApiServices,private location: Location)  { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      console.log(productId);
      this.id=productId;
      const user = this.apiservice.getUser();
      if (user !== null) {
        this.user = user;
        this.userId = this.user._id;
  
        console.log(this.userId)
      } else {
        // Handle the case when the user is null

  
    }
    
    this.apiservice.getProductsById(productId).subscribe(
      (response: any) => {
        this.product = response;
        console.log(this.product)
      },
      (error: any) => {
        console.error(error);
        // Handle error
      }
    );
  });
  
  this.fetchOptionGroups();
}
goBack(): void {
  this.location.back();
}
addOptionGroupesToProduct(productId, optionGroupId): void {
  this.apiservice.addOptionGroupsToProduct(productId, optionGroupId)
    .subscribe(
      (response) => {
        console.log('Option added to product:', response);
        // Handle the success condition
      },
      (error) => {
        console.error('Failed to add option to product:', error);
        // Handle the error condition
      }
    );
}
handleDragStart(event: any, optionGroupId: string): void {
  event.dataTransfer.setData('text/plain', optionGroupId);
}

handleDragOver(event: any): void {
  event.preventDefault();
}

handleDrop(event: any, sizeId: any): void {
  event.preventDefault();
  const optionGroupId = event.dataTransfer.getData('text/plain');
  console.log(sizeId);

  // Find the size within the product's sizes array by its ID
  const size = this.product.size.find((s) => s._id === sizeId);

  if (size) {
    // Find the dropped option group by its ID
    const optionGroup = this.optionGroups.find((group) => group._id === optionGroupId);

    if (optionGroup) {
      // Add the option group to the size's optionGroups array
      size.optionGroups.push(optionGroup);

      // Update the size on the server by calling the API
      this.addOptionGroup(this.id, sizeId, optionGroupId)
    }
  }
}
addOptionGroup(productId: string, sizeId: string, optionGroupId: string) {
  this.apiservice.addOptionGroupToProduct(productId, sizeId, optionGroupId)
    .subscribe(
      (response) => {
        console.log('Option group added successfully:', response);
        // Handle success, update UI, etc.
      },
      (error) => {
        console.error('Error adding option group:', error);
        // Handle error, display error message, etc.
      }
    );
}
fetchOptionGroups(): void {
  this.apiservice.getOptionGroups(this.apiservice.getStore())
    .subscribe(
      (response) => {
        this.optionGroups = response.optionGroups;
      },
      (error) => {
        console.error('Failed to fetch option groups', error);
        // Handle the error condition
      }
    );
}
deleteOptionGroup(productId: string, sizeId: string, optionGroupId: string, event: Event) {
  this.apiservice.deleteOptionGroups(productId, sizeId, optionGroupId).subscribe(
    (response) => {
      console.log('Option group deleted successfully:', response);
      // Handle success, update UI, etc.
       // Perform any additional actions after successful removal
       const element = (event.target as HTMLElement).parentElement;
       if (element) {
         element.style.display = 'none';
       }
    },
    (error) => {
      console.error('Error deleting option group:', error);
      // Handle error, display an error message, etc.
    }
  );
}
removeOptionGroup(productId: string, optionGroupId: string , event: Event): void {
  this.apiservice.removeOptionGroup(productId, optionGroupId)
    .subscribe(
      () => {
        console.log('Option group removed successfully');
        // Perform any additional actions after successful removal
        const element = (event.target as HTMLElement).parentElement;
        if (element) {
          element.style.display = 'none';
        }
      
      },
      (error) => {
        console.error('Failed to remove option group', error);
        // Handle the error condition
      }
    );
}
}
