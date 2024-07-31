import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { ToastsContainer } from "./product/toast-container"
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { AllProductComponent } from './all-product/all-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ProductComponent,
    AllProductComponent,
    ProductDetailComponent,
    ToastsContainer,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
