import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category/category.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AllCategotyComponent } from './all-categoty/all-categoty.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CategoryComponent,
    AllCategotyComponent,
    CategoryDetailComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    NgbModule,
    NgbAccordionModule,

    
  ]
  
})
export class CategoryModule { }
