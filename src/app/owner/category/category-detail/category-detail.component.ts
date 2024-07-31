import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { ApiServices } from 'src/app/services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  id: any;
  category: Category
  Categorys: Category[] = [];
  selectedObjectId: any;
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  errorMessage: string;

  constructor(private route: ActivatedRoute,private router: Router ,private apiservices:ApiServices) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoriesId = params['id'];
      console.log(categoriesId);
      this.id=categoriesId;
      this.getCategoryById(categoriesId);
  })
  
this.fetchCategorys();

}
onSelectionChange(event: any) {
  this.selectedObjectId = event;
  console.log("Selected ID:", this.selectedObjectId);
}
getstoreid(id){
  console.log(id);
  this.category.storeId=id;


}
fetchCategorys() {
  this.apiservices.getCategoriesByStoreOnly(this.apiservices.getStore()).subscribe(
    response => {
      this.Categorys = response.categories;
      console.log(this.Categorys)
    
    },
    error => {
      console.error(error);
    }
  );
}
  // Function to get a category by its ID
getCategoryById(categoryId: string): void {
  this.apiservices.getCategoryById(categoryId)
    .subscribe(
      (response) => {
        this.category = response;
        console.log('Category retrieved successfully:', response);
      },
      (error) => {
        console.error('Failed to retrieve category:', error);
      }
    );
}
addSubcategoryToCategory(categoryId: string, subcategoryId: string): void {
  this.apiservices.addSubcategoryToCategory(categoryId, subcategoryId)
    .subscribe(
      (response) => {
        console.log('Subcategory added successfully:', response);
        this.errorMessage = null; // Reset error message on success

        this.router.navigateByUrl(`/category/allcategory`, { skipLocationChange: true }).then(() =>
  this.router.navigate([this.router.url])
);
        if (this.category && response) {
          this.category.subcategories.push(response.subcategory); // Assuming the response is the newly added subcategory object

          // Clear the selected subcategory
          this.selectedObjectId = null;
        }
        // Handle success, if needed
      },
      (error) => {
        console.error('Failed to add subcategory:', error);
        this.errorMessage = error.error.error;
        // Handle error, if needed
      }
    );
}
deleteSubcategory(categoryId: string, subcategoryId: string  , event: Event) {
  const confirmDelete = confirm('Are you sure you want to delete this product?');
  if (confirmDelete) {
  this.apiservices.deleteSubcategory(categoryId, subcategoryId)
    .subscribe(
      () => {
        // Success handling, e.g., show a success message
        console.log('Subcategory deleted successfully');
        const element = (event.target as HTMLElement).parentElement;
        if (element) {
          element.style.display = 'none';
        }
      },
      (error) => {
        // Error handling, e.g., show an error message
        console.error('Failed to delete subcategory:', error);
      }
    );
}
}
}
