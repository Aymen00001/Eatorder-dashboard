import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component,  Input,  OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ApiServices } from 'src/app/services/api';
import {  FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-allpromo',
  templateUrl: './allpromo.component.html',
  styleUrls: ['./allpromo.component.scss']
})
export class AllpromoComponent implements OnInit {
  @Input() formControl: FormControl;

  searchForm: FormGroup;

  storeid: string;
  promos: any[] = [];
  promoData: any = [];
  consumationModes: any[];
  prevSelectedModes: { mode: string; availability: boolean; }[];
  prevSelectedproduit: any[] = [];
  loading: boolean;
  selectedProducts2: any[];
  orderChanges: any;
  totalItems: number;
  orderNumber: number;
  promosData: any;
  searchTermControl = new FormControl();
  myForm: FormGroup;

  constructor(private route: Router, private apiservice: ApiServices, private modalService: NgbModal ,private fb: FormBuilder) {
  
  }
  ngOnInit(): void {
    this.storeid = localStorage.getItem('storeid');
    this.getallpromos();
    this.getallcategorie();
    this.fetchConsumationModes();
    this.totalItems = this.filterPromos().length;  
    this.updateDisplayedItems(); 
    
 }
  getProductDetails(productId: string, index: number): any {
    const productGroup = this.products[index];
    return productGroup.find(prod => prod._id === productId); }
  ajouter() { this.route.navigateByUrl(`menu/addpromo`); }
  getallpromos() {
    this.apiservice.getallpromos(this.storeid).subscribe(
      (response: any) => {  
        this.promos = response.reverse(); 
        const totalItems = this.promos.length;

        // Mettez à jour le numéro d'ordre pour chaque élément dans la liste inversée
        this.promos.forEach((orderItem, index) => {
          orderItem.orderNumber = totalItems - index;
        });
        this.selectedItemsPerPage = 15; 
        this.p = 1; 
      },
      (error: any) => { 
        console.error('Error getting promos:', error); 
      }
    );
  }


  delettePromo(prompid: any) {
    const isConfirmed = confirm('Are you sure you want to delete this Promo?');
    if (isConfirmed) {
      this.apiservice.deletepromo(prompid).subscribe(
        (response: any) => {  this.getallpromos() },
        (error: any) => { console.error('Error deleting stores:', error);}
      );} else {  console.log('Deletion canceled'); } }

  UpdatePromo(promoid: any, availability: boolean) {
    this.apiservice.updatePromo(promoid, { availability }).subscribe(
      (response) => { },
      (error) => { console.error('Error updating Promo', error); } );
  }
  UpdatePromos(promoId: any) {
    const updatedPromoData: any = {
      _id: this.promoData._id,
      name: this.promoData.name,
      storeId: this.promoData.storeId,
      numberGroup: this.promoData.numberGroup,
      number2: this.promoData.number2,
      image: this.promoData.image,
      promos: [],
      discount: this.promoData.discount,
      availability: this.promoData.availability,
      availabilitys: this.selectedModes2, };
        if (Object.keys(this.productsByCategorys).length > 0) {
          for (const promoId in this.productsByCategorys) {
            if (this.productsByCategorys.hasOwnProperty(promoId)) {
              const categoryId = this.productsByCategorys[promoId][0].categoryId;
        const order=this.productsByCategorys[promoId][0].order;
              const productsWithCategoryId = this.productsByCategorys[promoId].map((productData: any) => productData.product._id);
              if (productsWithCategoryId.length > 0) {
                updatedPromoData.promos.push({ products: productsWithCategoryId,category: categoryId, order: order,  });  } } }
        } else if (this.prevSelectedproduit && this.prevSelectedproduit.length > 0) { updatedPromoData.promos = this.prevSelectedproduit;  }
        console.log(updatedPromoData,updatedPromoData)
  this.apiservice.updatePromos(promoId, updatedPromoData).subscribe(
      (response) => {
        this.getallpromos();
        this.selectedModes2 = [];
        this.selectedProduitId = [];
        this.prevSelectedproduit = [];
        this.selectedData = [];
        this.productsByCategorys = {};
      this.route.navigateByUrl(`/menu/Allpromo`);},
      (error) => { console.error('Error updating Promo', error); });}
//glissement
loadingg: boolean = false;
drop(event: CdkDragDrop<any[]>, promid: any) {
  if (event.previousContainer === event.container) {  moveItemInArray(event.container.data, event.previousIndex, event.currentIndex); } else {
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex );
  } this.updateOrders(promid)
}
updateOrders(promid: any) {
  this.promoData.promos.forEach((promo, index) => {promo.order = index + 1;  this.orderChanges = promo.order;  });
  const orderChanges = this.promoData.promos.map(promo => ({ promoId: promo._id,newOrder: promo.order}));
  this.apiservice.updateOrderPromo(orderChanges).subscribe(
    (response) => { this.selectedProduitId = []; this.selectedProduitIdByCategory = {};
      this.productsByCategorys = {}; this.contenuopen(promid);
 },(error) => { console.error('Error updating Promo', error); } );
}
  //removegroup
  removeGroup(promoData: any, promoId: any): void {
    this.apiservice.deletepromos(promoData, promoId).subscribe(
      (response) => {this.apiservice.getPromobyId(promoData).subscribe(
          (promoresponse) => {
              const remainingPromos = promoresponse.promos;
            remainingPromos.sort((a: any, b: any) => a.order - b.order);
              const updatedPromos = remainingPromos.map((promo: any, index: number) => {
              return { _id: promo._id, order: index + 1 }; });
            this.apiservice.updategrouppromo({ promos: updatedPromos }).subscribe(
              (responsepromo) => {  this.selectedProduitId = [];this.selectedProduitIdByCategory = {};
            this.productsByCategorys = {};  this.contenuopen(promoData); },
              (error) => {console.error('Error updating Promo', error);}
            ); }, (error) => { console.error('Error fetching Promo', error);  }
        );}, (error) => { console.error('Error deleting Promo', error); } );
  }
  
  load: boolean = false;
  async  contenuopen(promId: any) {
    try {
      this.apiservice.getPromobyId(promId).subscribe(
      (response) => { this.promoData = response; this.promoData.promos.sort((a, b) => a.order - b.order);
        const filteredPromos = response.promos?.map(async (promo) => {
          let productsDetails: any[] = [];
          if (promo.products) { productsDetails = await Promise.all(promo.products?.map(async (productId) => {
              try {const productDetailResponse = await this.apiservice.getProductsById(productId).toPromise();
                const productIdFromResponse = productDetailResponse?._id; return productIdFromResponse;
              } catch (error) {  console.error('Error fetching product details:', error);  return null; } })) || [];
          } return { products: productsDetails,  category: promo.category,order:promo.order };  }) || [];
        Promise.all(filteredPromos).then((result) => {this.prevSelectedproduit = result; });
        //rows et mode
        this.addRows(this.promoData.numberGroup);
        for (const mode of this.promoData.availabilitys) {
          this.apiservice.getModeById(mode.mode).subscribe((modeResponse: any) => { mode.modeDetails = modeResponse; },
            (categoryError: any) => { console.error('Error getting category:', categoryError); }
          ); this.selectedModes2 = this.promoData.availabilitys; } this.prevSelectedModes = [...this.selectedModes2];
        const categoryRequests = this.promoData.promos.map((promo) =>
          this.apiservice.getCategoriebyId(promo.category)
        );      
        //retourner categorie avec tous produit
        forkJoin(categoryRequests).subscribe(
          (categoryResponses: any[]) => {
            categoryResponses.forEach((categoryResponse, index) => {
              const promo = this.promoData.promos[index];
              promo.categoryDetails = categoryResponse;
              this.getallproductbycategorie(promo);
              promo.productsDetails = [];
              for (const productId of promo.products) {
                this.apiservice.getProductsById(productId).subscribe(
                  (productDetailResponse: any) => {
                    promo.productsDetails.push(productDetailResponse);
                    this.selectedProduitId.push({
                      product: productDetailResponse,
                      categoryId: promo.category,
                      promoId: promo._id,
                      order:promo.order }); },
                  (productError: any) => {  console.error('Error getting product details:', productError);
                  } ); } }); },);   },); }
           catch (error) { console.error('Error loading promo data:', error); this.showSpinner = true;
          }}
         
  //edit
showSpinner: boolean = false;
openModal(content: any, promoId: string) {
  this.loading = true; 
  this.apiservice.getPromobyId(promoId).subscribe(
    (response) => {
      this.promoData = response; this.contenuopen(promoId); this.loading = false;
      this.selectedProduitId = [];
      this.modalService.open(content, { size: 'lg' }).result.then(
        (result) => { },
        (reason) => { console.log(`Modal dismissed with: ${reason}`); }
      ); },
    (error) => {  console.error('Error loading promo data:', error);this.loading = false; });}

  getallproductbycategorie(promo: any) {
    this.apiservice.getProductsByCategory(promo.category).subscribe(
      (response: any) => { promo.products = response;},
      (error: any) => {console.error(error);} ); }
 productsss: any[] = [];
 image: File | null = null;
  onImageChange(event: any): void {const files: File = event.target.files[0];
    this.promoData.image = files;
  }
  numberGroup: number = 0;
  dynamicRows: any[] = [];
  categories: any[] = [];
  selectedCategoryIds: string[] = [];
  products: any[] = [];
  selectedProducts: any[] = [];
  selectedData: { categoryId: string, products: any[], order: number }[] = [];
  connectedDropLists: string[] = [];
  addRows(numberGroup: any) {
   this.connectedDropLists = Array.from({ length: numberGroup }, (_, i) => `list-${i}`);
    const prevSelectedCategoryIds = [...this.selectedCategoryIds];
    this.dynamicRows = [];
    this.selectedCategoryIds = [];
    this.products = [];
    this.selectedProducts = [];
    this.selectedData = [];
    for (let i = 0; i < numberGroup; i++) {
      this.dynamicRows.push({});
      this.selectedCategoryIds.push(prevSelectedCategoryIds[i] || '');
      this.products.push([]);
      this.selectedData.push({  categoryId: this.selectedCategoryIds[i], products: [],order: i + 1, });    }
  }
  getallcategorie() {
    this.apiservice.getCategoriesByStore(this.storeid).subscribe(
      (response: any) => { this.categories = response.categories; },
      (error: any) => {console.error('Error getting categories:', error);} );
  }
  selectedProduitId: { product: any, categoryId: string, promoId: any,order:any }[] = [];
  isproduitSelected(product: any, promoId: any): boolean {
    if (!product || !promoId) { return false;  }
    return this.selectedProduitId.some(selectedProduit =>
        selectedProduit.product._id === product._id && selectedProduit.promoId === promoId );
}
  selectedProduitIdByCategory: { [categoryId: string]: any[] } = {};
  productsByCategorys: { [categoryId: string]: any[] } = {};
  selectedProduitIdByPromo: { [promoId: string]: { product: any, categoryId: string }[] } = {};
  toggleProduitSelection(product: any, categoryId: string, promoId: any,order:any): void {
    if (!this.selectedProduitIdByPromo[promoId]) {
        this.selectedProduitIdByPromo[promoId] = [];}
    const isProductSelected = this.isproduitSelected(product, promoId);
    if (isProductSelected) {
        const index = this.selectedProduitIdByPromo[promoId].findIndex(
            selectedProduit => selectedProduit.product._id === product._id );
        if (index !== -1) {   this.selectedProduitIdByPromo[promoId].splice(index, 1); }
    } else { this.addProduitSelection(product, categoryId, promoId,order); }
}
addProduitSelection(product: any, categoryId: string, promoId: any, order: any): void {
  const existingSelection = this.selectedProduitId.find(
    selection => selection.product._id === product._id && selection.promoId === promoId
  );
  if (!existingSelection) {
    this.selectedProduitIdByCategory[categoryId] = this.selectedProduitIdByCategory[categoryId] || [];
    this.selectedProduitIdByCategory[categoryId].push({ product, categoryId, order });
    this.selectedProduitId.push({ product, categoryId, promoId: promoId, order });
    this.productsByCategorys = {};
    for (const selectedProduit of this.selectedProduitId) {
      const { product, categoryId, promoId, order } = selectedProduit;
      if (categoryId && !this.productsByCategorys[promoId]) { this.productsByCategorys[promoId] = [];  }
      if (categoryId) { this.productsByCategorys[promoId].push({ product, categoryId, order }); }
    }}
}
  //modeUpdate
  selectedModes2: { mode: string, availability: boolean }[] = [];
  fetchConsumationModes(): void {
    this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
      (consumationModes) => {this.consumationModes = consumationModes;},
      (error) => { console.error('Error fetching consumation modes:', error); }
    ); }

  isModeSelected(modeId: any): boolean {
    return this.promoData.availabilitys.some((mode: any) => String(mode.mode) === String(modeId._id));
  }
  onModeCheckboxChange(modeId: any, isChecked: boolean) {
    const existingModeIndex = this.selectedModes2.findIndex(mode => mode.mode === modeId);
    if (isChecked) {
      if (existingModeIndex === -1) { this.selectedModes2.push({ mode: modeId, availability: true });}
       else { this.selectedModes2[existingModeIndex].availability = true; }
      const modeInModelivraison = this.promoData.availabilitys.find(mode => mode.mode === modeId);
      if (!modeInModelivraison) {
        this.promoData.availabilitys.push({ mode: modeId, availability: true });
      } } else { this.removeModeFromModelivraison(modeId);  }
    const isModified = !this.areArraysEqual(this.prevSelectedModes, this.selectedModes2);
    if (isModified) {}
  }

  removeModeFromModelivraison(modeId: any): void {
    const index = this.promoData.availabilitys.findIndex(mode => mode.mode === modeId._id);
    if (index !== -1) {
      this.promoData.availabilitys.splice(index, 1);
      const isModified = !this.areArraysEqual(this.prevSelectedModes, this.selectedModes2);
      if (isModified) { } } else { }
  }
  areArraysEqual(arr1: any[], arr2: any[]): boolean { return JSON.stringify(arr1) === JSON.stringify(arr2); }
  //fin update mode
  promogroupid: any;
  //AddGroupe
  openModal2(content: any, promoid: any) {
    this.promogroupid = promoid;
    this.modalService.open(content, { size: 'sm' }).result.then(
      (result) => { },
      (reason) => { console.log(`Modal dismissed with: ${reason}`); }
    ); }
  selectedData2: { categoryId: string, products: any[], order?: any } = { categoryId: '', products: [] };
  onProductChange(productId: string) {
    if (productId === 'all') {
      this.products.forEach(prod => prod.selected = false);  this.selectedData2.products = [];
    } else {
      const selectedProduct = this.products.find(prod => prod._id === productId);
      if (selectedProduct) {
        selectedProduct.selected = !selectedProduct.selected;
        this.updateSelectedData(selectedProduct);
      }  } this.updateSelectedProducts();
  }
  onAllProductsCheckboxChange(checked: boolean) {
    this.products.forEach(prod => prod.selected = checked);
    this.selectedData2.products = checked ? this.products.map(prod => prod._id) : [];
    this.updateSelectedProducts();
  }
  onProductCheckboxChange(prod: any) {
    prod.selected = !prod.selected; this.updateSelectedData(prod);
    this.updateSelectedProducts();
  }
  updateSelectedProducts() {
    this.selectedProducts2 = [];
    this.selectedData2.products.forEach(productId => {
      for (const productsGroup of this.products) {
        if (Array.isArray(productsGroup)) {
          const product = productsGroup.find(prod => prod._id === productId);
          if (product) {
            this.selectedProducts2.push(product);
            break;
          }  }  } });  }
  updateSelectedData(product: any) {
    const productIndex = this.selectedData2.products.indexOf(product._id);
    if (product.selected && productIndex === -1) {this.selectedData2.products.push(product._id);
    } else if (!product.selected && productIndex !== -1) {this.selectedData2.products.splice(productIndex, 1); }}
openproduit=false
  onCategoryChange(categoryId: string) {
    this.selectedData2.categoryId = categoryId;
    this.apiservice.getProductsByCategory(categoryId).subscribe(
      (response: any) => {
        this.products = response;
        this.products.forEach(prod => prod.selected = false);
        this.selectedData2.products = [];
        this.updateSelectedProducts();
        this.openproduit=true
      },(error: any) => { console.error(error); });  }

  isAllProductsSelected(): boolean {return this.products.every(prod => prod.selected); }
  isProductSelected(prod: any): boolean { return this.selectedData2.products.includes(prod._id); }
  promo: any = {};
  messageError: string = "";
  modal:any
  addGroup() {
  this.messageError = "";
  if (!this.selectedData2 || !this.selectedData2.categoryId || !this.selectedData2.products || this.selectedData2.products.length === 0) {
    this.messageError = "Please select at least one category and one product in Group.";
    console.error("Invalid group data");
    return; 
  }else{
    if (this.selectedData2 && this.promogroupid) {
        this.selectedData2.order = this.promoData.numberGroup + 1;
        this.promo = { selectedData2: this.selectedData2, promoid: this.promogroupid };
       this.apiservice.addGroupPromo(this.promo).subscribe(
            (response) => {
                this.selectedProduitId = [];
                this.selectedProduitIdByCategory = {};
                this.productsByCategorys = {};
                this.selectedData2 = { categoryId: '', products: [] };
                this.openproduit=false
                this.contenuopen(this.promogroupid);
            if (this.modal) {
          this.modal.close('Close click')        } else {
          console.error('Modal is not defined');
        }            },  (error) => {  console.error('Error adding Promo', error); } );
    } else {  console.error('Promo or storeid is not defined'); }
}}

//Fin Add Group
//filter
searchTerm: string = '';
currentPage: number = 0; 
itemsPerPage: number = 5;
p: number = 1;
selectedItemsPerPage: number = 15; 
displayedItems: any[];

filterPromos() {
  return this.promos.filter(promo =>
    promo.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    promo.discount.toString().includes(this.searchTerm.toLowerCase()) 
  );
}
updateDisplayedItems() {
  const startIndex = this.currentPage * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedItems = this.filterPromos().slice(startIndex, endIndex);
}

pageChanged(event: PageEvent) { this.currentPage = event.pageIndex; this.updateDisplayedItems();}
items: any[] = []; 
get paginatedItems() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.items.slice(startIndex, endIndex);
}

//Afficher 
openModal3(content: any, promoId: string) {
  console.log(promoId);
  this.apiservice.getPromobyId(promoId).subscribe(
    (response) => {
      this.promosData = response;
      const categoryRequests = this.promosData.promos.map((promo) =>
        this.apiservice.getCategoriebyId(promo.category)
      );
      forkJoin(categoryRequests).subscribe((categories) => {
        this.promosData.promos.forEach((promo, index) => {
          promo.categoryDetails = categories[index];
          promo.productsDetails = [];
          for (const productId of promo.products) {
            this.apiservice.getProductsById(productId).subscribe(
              (productDetailResponse: any) => {
                promo.productsDetails.push(productDetailResponse);
                this.selectedProduitId.push({
                  product: productDetailResponse,
                  categoryId: promo.category,
                  promoId: promo._id,
                  order:promo.order }); },
              (productError: any) => {  console.error('Error getting product details:', productError);
              } ); }
        });
        this.promosData.promos.sort((a, b) => a.order - b.order);
        this.modalService.open(content, { size: 'lg' }).result.then(
          (result) => {// console.log(`Modal closed with: ${result}`); 
          },
          (reason) => { //console.log(`Modal dismissed with: ${reason}`); 
          }
        );
      });

    },
  );
}
isModeInModelivraison(modeId: string): boolean {
  return this.promosData.availabilitys.some((item) => item.mode === modeId);
}
}
