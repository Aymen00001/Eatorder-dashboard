import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwIfEmpty } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { ApiServices } from 'src/app/services/api';
import { Router } from '@angular/router';
import { Store } from 'src/app/models/store';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  user: User;
  store: Store[] ;
  errorMessage: string;
  productForm: FormGroup;
  consumationModes: any[];
  Categorys: any;
  selectedImage: File = null; // Add a property to store the selected image file


constructor(private apiservice: ApiServices, private fb: FormBuilder, private http: HttpClient,private toastService: ToastService) {
  this.productForm = this.fb.group({
  name: '',
  description: '',
  storeId: '',
  category: '',
  modePrices: this.fb.array([]),  // You can use FormArray for mode prices
  // ... other form controls
});
} 


onFileChange(event: any): void {
const file = event.target.files[0];
if (file) {
  this.selectedImage = file;
}
}
fetchConsumationModes(): void {
this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
  (consumationModes) => {
    this.populateModePrices(consumationModes);
  
  },
  (error) => {
    console.error('Error fetching consumation modes:', error);
  }
);
}
populateModePrices(consumationModes: any[]): void {
const modePricesArray = this.productForm.get('modePrices') as FormArray;
modePricesArray.clear(); // Clear existing controls before populating
// console.log(this.modePrices);
// console.log(consumationModes);
consumationModes.forEach((mode) => {
  modePricesArray.push(this.createModePriceGroup(mode._id, "0",mode.mode.name)); // Adjust default price as needed
 
});
}
showSuccess() {
  this.toastService.show('Produit ajouté avec succès', { classname: 'bg-success text-light', delay: 10000 });
}
resetForm() {
  this.productForm = this.fb.group({
    name: '',
    description: '',
    storeId: '',
    category: '',
  
  });
  
}
ngOnInit(): void {
 


    const user = this.apiservice.getUser();
    if (user !== null) {
      this.user = user;
    //  console.log(user._id)
          
    } else {
      // Handle the case when the user is null
      // console.log("error");
    }
    this.get();
    this.fetchConsumationModes();
    this.getStoreOwner();
     this.fetechCatrgory();
}
getStoreOwner() {

  this.apiservice.getStoresOwner(this.user._id).subscribe(
    (response) => {

      this.store = response[0];

      // console.log(this.store);

    },
    error => {
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
getstoreid(id) {
  // console.log(id);
  this.productForm.value.storeId = id.toString();


}
fetechCatrgory() {
  this.apiservice.getCategoriesByStoreOnly(this.apiservice.getStore()).subscribe(
    (response: any) => {
      this.Categorys = response.categories;
      //const Categorys = categories.map((categoryWithProducts) => categoryWithProducts.category.name);
      // console.log(this.Categorys)

    },
    (error: any) => {
      console.error(error);
    }
  );
}
addProduct() {
  const productData = this.productForm.value;

  // Create a new FormData object to send both product data and image
  const formData = new FormData();
  // console.log(productData);

  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('storeId', productData.storeId);
  formData.append('category', productData.category);
  formData.append('modePrices', JSON.stringify(productData.modePrices));
  formData.append('image', this.selectedImage); // Append the selected image file
  console.log(formData);
  // Send the request to your API to add the product with the image
  this.http.post('http://localhost:8000/owner/addprod', formData).subscribe(
    (response) => {
      // console.log('Product added:', response);
      this.showSuccess();
      this.resetForm();
      // Clear the form or provide user feedback as needed
    },
    (error) => {
      console.error('Error adding product:', error);
    }
  );
}
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
createModePriceGroup(mode = '', price = '',name=''): FormGroup {
  return this.fb.group({
    mode: mode,
    price: price,
    name:name,
  });
}

// Getter for the modePrices FormArray
get modePrices(): FormArray {
  return this.productForm.get('modePrices') as FormArray;
}

// Add a mode price control to the FormArray
addModePrice() {
  this.modePrices.push(this.createModePriceGroup());
}

get()
{
 this.apiservice.getStoresOwner(this.user._id).subscribe(
   (response  )=> {
    
     this.store=response[0];
  
    // console.log(this.store);
    
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




//   user: User = {} as User; // Initialize with an empty User object
//   fd = new FormData();
//   userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée
//   errorMessage: string;
//   store: any[];
//   optionGroups: any;
//   storeId: string;
//   selectedFile: File = null;
//   selectedFileData: string | null;
//   Categorys: any;
//   product: Product = {
//     name: "",
//     price: null,
//     description: "",
//     storeId: "",
//     image: "",
//     category: "",
//     optionGroups: [],
//     taxes:[],
//   }
//   registerForm!: FormGroup;
//   consumationModes: any[] = [];

//   submitted = false;
//   show = true;
// close() {
//     this.show = false;
//     setTimeout(() => this.show = true, 3000);
//   }
//   constructor(private apiService: ApiServices, private router: Router, private formBuilder: FormBuilder) { }
//   getSelectedValues() {
//     const selectedValues :any = $('#mySelect').val();
//     console.log(selectedValues);
//     this.product.optionGroups=selectedValues
//   }
//   ngOnInit(): void {
//     $.getScript('./assets/plugins/select2/select2.min.js');
//     $.getScript('./assets/js/custom-select2.js');
//     const user = this.apiService.getUser();
//     if (user !== null) {
//       this.user = user;
//       this.userId = this.user._id;

//       console.log(this.userId)
//     } else {
//       // Handle the case when the user is null
//     }
//     this.fetchOptionGroups();
//     this.fetechCatrgory();
//     this.apiService.getConsumationModes(this.apiService.getStore())
//     .subscribe(
//       (modes) => {
//         this.consumationModes = modes;
//       },
//       (error) => {
//         console.error(error);
//       }
//     );

//     this.getStoreOwner();
//     this.registerForm = this.formBuilder.group({
//       // title: ['', Validators.required],
//       name: [this.product.name, Validators.required],
//       description: [this.product.description, Validators.required],
//       price: [this.product.price, Validators.required],
//       storeId:[this.product.storeId,Validators.required],
//       category: [this.product.category, Validators.required],
//       // optionGroups: [this.product.optionGroups, Validators.required],
//     });

//   }
//   get f() { return this.registerForm.controls; }

//   getstoreid(id) {
//     console.log(id);
//     this.product.storeId = id.toString();


//   }
//   onSubmit() {
//     this.submitted = true;

//     // stop here if form is invalid
//     if (this.registerForm.invalid) {


//       return;
//     }

//     // display form values on success
//     this.addProduct();

//   }
//   getStoreOwner() {

//     this.apiService.getStoresOwner(this.user._id).subscribe(
//       (response) => {

//         this.store = response[0];

//         console.log(this.store);

//       },
//       error => {
//         if (error.error && error.error.message) {
//           console.error(error.error.message);
//           this.errorMessage = error.error.message;
//           this.router.navigate(['/error/error-404']);


//         } else {
//           console.error('An error occurred during login.');
//           this.errorMessage = 'An error occurred during login.';
//           this.router.navigate(['/error/error-404']);
//         }
//       }


//     )
//   }
//   addProduct() {
//     console.log(this.product)
//     this.getSelectedValues();
//     this.apiService.addProduct(this.product, this.selectedFile).subscribe(
//       response => {

//         console.log(this.product);
//         this.router.navigate(['/product/allproducts']);
//       },
//       error => {
//         console.error(error);
        
//         this.router.navigate(['/error/error-404']);
//       }
//     )
//   }
//   fetchOptionGroups() {
//     this.apiService.getOptionGroups(this.userId).subscribe(
//       response => {
//         this.optionGroups = response.optionGroups;
//         console.log(this.optionGroups)
//       },
//       error => {
//         console.error(error);
//         this.router.navigate(['/error/error-404']);
//       }
//     );
//   }
//   fetechCatrgory() {
//     this.apiService.getCategoriesByStoreOnly(this.apiService.getStore()).subscribe(
//       (response: any) => {
//         this.Categorys = response.categories;
//         //const Categorys = categories.map((categoryWithProducts) => categoryWithProducts.category.name);
//         console.log(this.Categorys)

//       },
//       (error: any) => {
//         console.error(error);
//         this.router.navigate(['/error/error-404']);
//       }
//     );
//   }
//   onFileChange(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.selectedFileData = e.target.result;

//       };
//       reader.readAsDataURL(file);

//     }
//   }
//   createFormData(event) {
//     this.selectedFile = <File>event.target.files[0];
//     console.log(this.fd);
//     this.fd.append('file', this.selectedFile, this.selectedFile.name);
//   }


}
