import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-addpromo',
  templateUrl: './addpromo.component.html',
  styleUrls: ['./addpromo.component.scss']
})
export class AddpromoComponent implements OnInit {
  numberGroup: number = 0;
  dynamicRows: any[] = [];
  storeid: string;
  categories: any[] = [];
  selectedCategoryIds: string[] = [];
  products: any[] = [];
  selectedProducts: any[] = [];
  constructor(private apiservice: ApiServices,private route:Router) {
    this.storeid = localStorage.getItem('storeid');
    this.getallcategorie();
    this.fetchConsumationModes()
  }
  ngOnInit(): void {this.addRows();}
  addRows() {
    const prevSelectedCategoryIds = [...this.selectedCategoryIds];
    this.dynamicRows = [];
    this.selectedCategoryIds = [];
    this.products = [];
    this.selectedProducts = [];
    this.selectedData = [];
    for (let i = 0; i < this.numberGroup; i++) {
      this.dynamicRows.push({});
      this.selectedCategoryIds.push(prevSelectedCategoryIds[i] || '');
      this.products.push([]);
   this.selectedData.push({ categoryId: this.selectedCategoryIds[i],products: [], order: i + 1, });
     // this.selectedData.push({ categoryId: this.selectedCategoryIds[i], products: [] });
}
  }
  getallcategorie() {
    this.apiservice.getCategoriesByStore(this.storeid).subscribe(
      (response: any) => {this.categories = response.categories;},
      (error: any) => {console.error('Error getting categories:', error); });
  }
  getallproductbycategorie(idcategory: any, index: number) {
    this.apiservice.getProductsByCategory(idcategory).subscribe(
      (response: any) => { this.products[index] = response; },
      (error: any) => { console.error(error);});
  }
  onCategoryChange(categoryId: string, index: number) {
    this.selectedCategoryIds[index] = categoryId;
    this.getallproductbycategorie(categoryId, index);
    this.selectedData[index] = { categoryId: categoryId, products: [],order: index + 1,  };
  }
  selectedData: { categoryId: string, products: any[] ,order:any}[] = [];
  onProductChange(productId: string, index: number) {
    const categoryData = this.selectedData[index];
    if (productId === 'all') { this.products[index].forEach(prod => (prod.selected = false));
      categoryData.products = [];
    } else {const selectedProduct = this.products[index].find(prod => prod._id === productId);
  if (selectedProduct) { selectedProduct.selected = !selectedProduct.selected; this.updateSelectedData(index, selectedProduct); }
    } this.updateSelectedProducts();
  }
  onAllProductsCheckboxChange(checked: boolean, index: number) {
    const categoryData = this.selectedData[index];
      this.products[index].forEach(prod => (prod.selected = checked));
    categoryData.products = checked
      ? this.products[index].map(prod => prod._id) : [];
    this.updateSelectedProducts();
  }
  onProductCheckboxChange(prod: any, index: number) {
    const categoryData = this.selectedData[index];
    const productIndex = categoryData.products.indexOf(prod._id);
    prod.selected = !prod.selected;
    if (prod.selected && productIndex === -1) { categoryData.products.push(prod._id); }
    else if (!prod.selected && productIndex !== -1) { categoryData.products.splice(productIndex, 1); }
        this.updateSelectedProducts();
}
updateSelectedProducts() {
  this.selectedProducts = [];
  for (const group of this.selectedData) {
    for (const prodId of group.products) {
      for (const productsGroup of this.products) {const product = productsGroup.find(prod => prod._id === prodId);
        if (product) {this.selectedProducts.push(product);
          break;  } } }}
}
  updateAllProductsCheckbox(index: number) {
    const categoryData = this.selectedData[index];
    const allProductsCheckbox = document.getElementById('allProductsCheckbox_' + index) as HTMLInputElement;
    if (allProductsCheckbox) {
      const allSelected = this.products[index].every(prod => prod.selected);
      allProductsCheckbox.checked = allSelected;
        categoryData.products = allSelected
        ? this.products[index].map(prod => prod._id): []; }
  }
  updateSelectedData(index: number, product: any) {
    const categoryData = this.selectedData[index];
    const productIndex = categoryData.products.indexOf(product._id);
    if (product.selected && productIndex === -1) { categoryData.products.push(product._id); }
    else if (!product.selected && productIndex !== -1) {categoryData.products.splice(productIndex, 1); }
  }
  name: any;
  image: File | null = null;
  number2: any;
  discount: any;
  availability:boolean
  messageerror: string = "";
  messageErrors: { [key: string]: string } = {};
  onSubmit() {
    const requiredFields = {
      name: "Name",
      number2: "Number Base_price",
      discount: "Discount",
    };
    this.messageErrors = {};
    for (const field in requiredFields) {
      if (!this[field]) {
        this.messageErrors[field] = `Please fill in the ${requiredFields[field]} field`;
      }
    }
    const selectedModes = this.selectedModes;
    if (selectedModes.length === 0) {
      this.messageErrors['availabilitys'] = 'Please select at least one delivery mode';
    } else {
      delete this.messageErrors['availabilitys'];
    }
    this.selectedData.forEach((data, index) => {
      if (!data || !data.categoryId || !data.products || data.products.length === 0) {
        this.messageErrors[`categoryProduct_${index}`] = `Please select at least one category and one product in Group  ${index + 1}`;
      } else {
      }
    });
    const errorFields = Object.keys(this.messageErrors);
    if (errorFields.length > 0) {
      this.messageerror = `Please fill in the following fields: ${errorFields.map((field) => requiredFields[field]).join(', ')}`;
      setTimeout(() => {
        this.messageerror = "";
      }, 2000);
    } else {
      const formData = new FormData();
      formData.append('storeId', this.storeid);
      formData.append('name', this.name);
      formData.append('numberGroup', this.numberGroup.toString());
      formData.append('number2', this.number2);
      formData.append('image', this.image);
      formData.append('discount', this.discount);
      formData.append('availability', this.availability ? 'true' : 'false');
      formData.append('promos', JSON.stringify(this.selectedData.map((data) => ({
        category: data.categoryId || null,
        products: data.products,
        order: data.order
      }))));
      formData.append('availabilitys', JSON.stringify(this.selectedModes));
      this.apiservice.addpromo(formData).subscribe(
        (response) => {  this.route.navigateByUrl(`/menu/Allpromo`);  },
        (error) => { console.error('Error adding Promo', error); }
      );  }
  }
  clearError(fieldName: string): void {
    this.messageErrors[fieldName] = '';
  }
  getErrorMessage(index: number): string | undefined {
    return this.messageErrors[`categoryProduct_${index}`];
  }
  onImageChange(event: any): void { const files = event.target.files;
   if (files.length > 0) { this.image = files[0]; }
  }
isAllProductsSelected(index: number): boolean { return this.products[index].every(prod => prod.selected);}
isProductSelected(prod: any, index: number): boolean {const categoryData = this.selectedData[index];
  return categoryData.products.includes(prod._id);
}
consumationModes: any[];
fetchConsumationModes(): void {
  this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
    (consumationModes) => {this.consumationModes = consumationModes;},
    (error) => { console.error('Error fetching consumation modes:', error); }
  );}
selectedModes: { mode: string, availability: boolean }[] = [];
onModeCheckboxChange(modeId: string, isChecked: boolean) {
  const existingModeIndex = this.selectedModes.findIndex(mode => mode.mode === modeId);
  if (isChecked && existingModeIndex === -1) {this.selectedModes.push({ mode: modeId, availability: true }); }
   else if (!isChecked && existingModeIndex !== -1) {this.selectedModes.splice(existingModeIndex, 1);}
}


}
