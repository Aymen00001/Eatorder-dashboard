import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-categoty',
  templateUrl: './all-categoty.component.html',
  styleUrls: ['./all-categoty.component.scss']
})
export class AllCategotyComponent implements OnInit {
  @ViewChild('exampleScrollableModal1') exampleModal1: any;
  Categorys: Category[] = [];
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  user: User;
  store: any[] ;
  errorMessage: any;
  category: Category ={
    name: "",
    description: "",
    parentCategory: "",
    availabilitys:[],
    image: "",
    storeId: null,
    userId: "",
    subcategories: [],
    products:[],

  }
  selectedImage: File;
  displayedCategories: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  selectedCategory: any;

  constructor(private http: HttpClient, private router: Router,private api : ApiServices,private modalService: NgbModal) { }
  selectedItem: any=
  {
    name:"",
    descrition:""
  }; // Declare a variable to hold the selected item

  setSelectedItem(item: any) {
    this.selectedItem = item;
  }
  ngOnInit(): void {
    this.fetchCategorys();
    this.loadCategories();

    const user = this.api.getUser();
    if (user !== null) {
      this.user = user;
      
    //  console.log(user._id)
          
    } else {
      // Handle the case when the user is null
      // console.log("error");
    }
    this.api.getStoresOwner(this.user._id).subscribe(
      (response  )=> {
       
        this.store=response[0];
     
      //  console.log(this.store);
       
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
  onSubmit(categories) {
    // Create a FormData object to hold the category data
    const categoryData = new FormData();
    categoryData.append('name', categories.name);
    categoryData.append('description', categories.description);
    categoryData.append('storeId',this.api.getStore());
    if (this.selectedImage) {
      categoryData.append('image', this.selectedImage);
    }
    else{
      categoryData.append('image', this.selectedImage);
    }

    const categoryId = categories._id;

    // Call the updateCategory method with the categoryId and categoryData
    // this.updateCategory(categoryId, categoryData);
  }
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length) {
      this.selectedImage = inputElement.files[0];
    }
  }
  // updateCategory(categoryId: string, categoryData: FormData) {
  // this.api.updateCategory(categoryId,categoryData).subscribe(
  //   (response) => {
  //     if(response.category.image)
  //     {
  //       this.selectedItem.image=response.category.image
  //     }
      
  //     // console.log('Category updated successfully:', response);
  //     // Handle success, show a success message, or perform other actions
  //   },
  //   (error) => {
  //     console.error('Error updating category:', error);
  //     // Handle error, show an error message, or perform other error handling
  //   }
  // );
  // }
  loadCategories() {

    this.api.getCategoriesByStoresOnly(this.api.getStore(), this.currentPage, this.pageSize).subscribe(data => {
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
  fetchCategorys() {
    this.api.getCategoriesByStoreOnly(this.api.getStore()).subscribe(
      response => {
        this.Categorys = response.categories;
        // console.log(this.Categorys)
      
      },
      error => {
        console.error(error);
      }
    );
  }
  deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.api.deleteCategory(categoryId).subscribe(
        (response: any) => {
          // console.log('Category deleted successfully');
          // Optionally, navigate to a different route after successful deletion
          this.displayedCategories = this.displayedCategories.filter(category => category._id !== categoryId);
              // console.log(categoryId);
      
        
        },
        (error: any) => {
          console.error('Error deleting category:', error);
          // Handle error
        }
      );
    }
  }
  deleteCategoryWithProduct(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.api.deleteCategoryWithProduct(categoryId).subscribe(
        (response: any) => {
          // console.log('Category deleted successfully');
          // Optionally, navigate to a different route after successful deletion
          this.displayedCategories = this.displayedCategories.filter(category => category._id !== categoryId);
              // console.log(categoryId);
      
        
        },
        (error: any) => {
          console.error('Error deleting category:', error);
          // Handle error
        }
      );
    }
  }
  
 
}
