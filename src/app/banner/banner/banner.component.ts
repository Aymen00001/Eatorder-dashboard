import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  displayedCategories: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private apiService: ApiServices) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {

    this.apiService.getCategoriesByStoresOnly(this.apiService.getStore(), this.currentPage, this.pageSize).subscribe(data => {
      // Assuming the API response contains a 'categories' property that is an array
      const categories = data.categories;
      this.totalPages = Math.ceil(categories.length / this.pageSize);
      this.displayedCategories = categories.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    });
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.loadCategories(); // Reload categories for the new page
    }
  }
//   user: User;
//     store: Store[] ;
//     errorMessage: string;
//     productForm: FormGroup;
//     consumationModes: any[];
//     Categorys: any;
//     selectedImage: File = null; // Add a property to store the selected image file
 

//   constructor(private apiservice: ApiServices, private fb: FormBuilder, private http: HttpClient) {
//     this.productForm = this.fb.group({
//     name: '',
//     description: '',
//     storeId: '',
//     category: '',
//     modePrices: this.fb.array([]),  // You can use FormArray for mode prices
//     // ... other form controls
//   });
// } 
// onFileChange(event: any): void {
//   const file = event.target.files[0];
//   if (file) {
//     this.selectedImage = file;
//   }
// }
// fetchConsumationModes(): void {
//   this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
//     (consumationModes) => {
//       this.populateModePrices(consumationModes);
    
//     },
//     (error) => {
//       console.error('Error fetching consumation modes:', error);
//     }
//   );
// }
// populateModePrices(consumationModes: any[]): void {
//   const modePricesArray = this.productForm.get('modePrices') as FormArray;
//   modePricesArray.clear(); // Clear existing controls before populating
//   console.log(this.modePrices);
//   console.log(consumationModes);
//   consumationModes.forEach((mode) => {
//     modePricesArray.push(this.createModePriceGroup(mode._id, "0",mode.mode.name)); // Adjust default price as needed
   
//   });
// }
//   ngOnInit(): void {
   


//       const user = this.apiservice.getUser();
//       if (user !== null) {
//         this.user = user;
//        console.log(user._id)
            
//       } else {
//         // Handle the case when the user is null
//         console.log("error");
//       }
//       this.get();
//       this.fetchConsumationModes();
//       this.getStoreOwner();
//        this.fetechCatrgory();
//   }
//   getStoreOwner() {

//     this.apiservice.getStoresOwner(this.user._id).subscribe(
//       (response) => {

//         this.store = response[0];

//         console.log(this.store);

//       },
//       error => {
//         if (error.error && error.error.message) {
//           console.error(error.error.message);
//           this.errorMessage = error.error.message;
         


//         } else {
//           console.error('An error occurred during login.');
//           this.errorMessage = 'An error occurred during login.';
         
//         }
//       }


//     )
//   }
//   getstoreid(id) {
//     console.log(id);
//     this.productForm.value.storeId = id.toString();


//   }
//   fetechCatrgory() {
//     this.apiservice.getCategoriesByStoreOnly(this.apiservice.getStore()).subscribe(
//       (response: any) => {
//         this.Categorys = response.categories;
//         //const Categorys = categories.map((categoryWithProducts) => categoryWithProducts.category.name);
//         console.log(this.Categorys)

//       },
//       (error: any) => {
//         console.error(error);
//       }
//     );
//   }
//   addProduct() {
//     const productData = this.productForm.value;

//     // Create a new FormData object to send both product data and image
//     const formData = new FormData();
//     console.log(productData);

//     formData.append('name', productData.name);
//     formData.append('description', productData.description);
//     formData.append('storeId', productData.storeId);
//     formData.append('category', productData.category);
//     formData.append('modePrices', JSON.stringify(productData.modePrices));
//     formData.append('image', this.selectedImage); // Append the selected image file
//     console.log(formData);
//     // Send the request to your API to add the product with the image
//     this.http.post('http://localhost:8000/owner/addprod', formData).subscribe(
//       (response) => {
//         console.log('Product added:', response);
//         // Clear the form or provide user feedback as needed
//       },
//       (error) => {
//         console.error('Error adding product:', error);
//       }
//     );
//   }
  // addProduct() {
  //   const productData = this.productForm.value;
  //   console.log(productData);
  //   this.apiservice.addProd(productData).subscribe(
  //     (response) => {
  //       console.log('Product added:', response);
  //       // Clear the form or provide user feedback as needed
  //     },
  //     (error) => {
  //       console.error('Error adding product:', error);
  //     }
  //   );
  // }
  // createModePriceGroup(mode = '', price = '',name=''): FormGroup {
  //   return this.fb.group({
  //     mode: mode,
  //     price: price,
  //     name:name,
  //   });
  // }

  // // Getter for the modePrices FormArray
  // get modePrices(): FormArray {
  //   return this.productForm.get('modePrices') as FormArray;
  // }

  // // Add a mode price control to the FormArray
  // addModePrice() {
  //   this.modePrices.push(this.createModePriceGroup());
  // }

  // get()
  // {
  //  this.apiservice.getStoresOwner(this.user._id).subscribe(
  //    (response  )=> {
      
  //      this.store=response[0];
    
  //     console.log(this.store);
      
  //    },
  //    error =>{
  //      if (error.error && error.error.message) {
  //        console.error(error.error.message);
  //        this.errorMessage = error.error.message;
   
 
 
  //      } else {
  //        console.error('An error occurred during login.');
  //        this.errorMessage = 'An error occurred during login.';
  //      }
  //    }
     
     
  //  )
  // }

}
