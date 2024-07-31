import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AllProductComponent } from './all-product/all-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product',
        component: ProductComponent,
        data: {
          title: 'Product'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'allproducts',
        component: AllProductComponent,
        data: {
          title: 'Product'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'products/:id',
        component: ProductDetailComponent,
        data: {
          title: 'Product Detail'
        }
      },
  
  ]  },

 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
