import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { AllCategotyComponent } from './all-categoty/all-categoty.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: 'Category'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'allcategory',
        component: AllCategotyComponent,
        data: {
          title: 'All Category'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'categorydetail/:id',
        component: CategoryDetailComponent,
        data: {
          title: 'Category details'
        }
      },
  
  ]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
