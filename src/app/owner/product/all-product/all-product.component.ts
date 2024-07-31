import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiServices } from 'src/app/services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.scss']
})
export class AllProductComponent implements OnInit {
  product:Product[]=[];
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  image: any
  imageUrl:any
  selectedProduct: Product;
  user: User = {} as User; // Initialize with an empty User object
  userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée
  registerForm!: FormGroup;
  store: any[];
  optionGroups: any[];
  Categorys: any;
  errorMessage: string;
  lastSelectedOption: any;
  condition: boolean = true;
  products: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  displayedProducts: any[] = [];
  size: any[] = []; 
  selectedImage: File | null = null;

   constructor(private formBuilder: FormBuilder,private router: Router,private modalService: NgbModal, private apiservices:ApiServices) { }
  
   onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
  }
  toggleCondition() {
    this.condition = !this.condition;
  }
  ngOnInit(): void {
    this.loadProducts();

    const user = this.apiservices.getUser();
    if (user !== null) {
      this.user = user;
      this.userId = this.user._id;

      // console.log(this.userId)
    } else {
      // Handle the case when the user is null
    } 


    this.getProductBystore();
   // this.updateProduct();

  
  }
  loadProducts() {
    

    this.apiservices.getProductsByStore(this.apiservices.getStore(), this.currentPage, this.pageSize).subscribe(data => {
      const  products = data; // Assuming the API response is an array of products
      // console.log(products)
      this.totalPages = Math.ceil(products.length / this.pageSize);
      this.displayedProducts = products.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    });
  }
  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.loadProducts();
    }
  }
  fetchOptionGroups() {
    this.apiservices.getOptionGroups(this.apiservices.getStore()).subscribe(
      response => {
        this.optionGroups = response.optionGroups;
        // console.log(this.optionGroups)
      },
      error => {
        console.error(error);
        this.router.navigate(['/error/error-404']);
      }
    );
  }
  fetechCatrgory() {
    this.apiservices.getCategoriesByStoreOnly(this.apiservices.getStore()).subscribe(
      (response: any) => {
        this.Categorys = response.categories;
        //const Categorys = categories.map((categoryWithProducts) => categoryWithProducts.category.name);
        // console.log(this.Categorys)

      },
      (error: any) => {
        console.error(error);
        this.router.navigate(['/error/error-404']);
      }
    );
  }
  getStoreOwner() {

    this.apiservices.getStoresOwner(this.user._id).subscribe(
      (response) => {

        this.store = response[0];

        // console.log(this.store);

      },
      error => {
        if (error.error && error.error.message) {
          console.error(error.error.message);
          this.errorMessage = error.error.message;
          this.router.navigate(['/error/error-404']);


        } else {
          console.error('An error occurred during login.');
          this.errorMessage = 'An error occurred during login.';
          this.router.navigate(['/error/error-404']);
        }
      }


    )
  }
  toggleAvailability(product: any): void {
    // Toggle the 'disponibilite' property of the item
    const productId = product._id; // Assuming your product object has an _id property

  this.apiservices.updateAvailability(productId).subscribe(
    (response: any) => {
      // Update the product's availability property locally
      product.availability = response.product.availability;
      // console.log('Product availability updated successfully');
    },
    (error) => {
      console.error('Error updating product availability:', error);
    }
  );
    // You might want to call an API or perform other actions here to update the backend
  }
  addSizeupdateproduct() {
    this.selectedProduct.size.push({name: '', price: null});
   
  }
  removeSizeupdateproduct(index: number) {
    this.selectedProduct.size.splice(index, 1);
  }
 updateProduct(selectedProduct)
  {
    //selectedProduct.size=this.size;
     
  
    console.log(selectedProduct.image);
    this.apiservices.updatePorduct(selectedProduct._id,selectedProduct.name,selectedProduct.description,selectedProduct.price,selectedProduct.storeId,selectedProduct.category._id, selectedProduct.size,selectedProduct.tags).subscribe
    (
      Response =>{
        if(Response.imageURL)
        {
           selectedProduct.image=Response.imageURL;
        }
       
    //  console.log(Response);
     this.router.navigate([this.router.url]);
      },
      error =>{
        console.error(error);
      }

    );
  
  }
  getProductBystore()
  {
    this.apiservices.getPoductByStore(this.apiservices.getStore()).subscribe
    (
      Response =>{
        this.product = Response
        // console.log(this.product);
       
     
      },
      error =>{
        console.error(error);
      }

    );
  }
  deleteProduct(prod: Product): void {
    // Show confirmation dialog/modal if needed
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.apiservices.deleteProduct(prod._id).subscribe(
        () => {
          // Option group deleted successfully, update the product array
          this.displayedProducts = this.displayedProducts.filter((g) => g._id !== prod._id);
        },
        (error) => {
          console.error(error);
          // Handle error scenario
        }
      );
    }
  }
  openLg(content,item ) {
 
    this.fetchOptionGroups();
    this.fetechCatrgory();
    this.getStoreOwner();


   // this.lastSelectedOption = item.optionGroups[0]._id;
    this.selectedProduct=item;
  // console.log(item);
   //this.selectedProduct.category._id = item.category._id;
    // console.log(content)
  // console.log(this.selectedProduct.category.name+" this is product")
    this.modalService.open(content, { size: 'lg' });
  }  

}
