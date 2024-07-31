import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllcompanyComponent } from './allcompany/allcompany.component';
import { AddcompanyComponent } from './addcompany/addcompany.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'allcompany',
        component: AllcompanyComponent
        ,
        data: {
          title: 'All Company'
        }
      },
  ]  },
  {
    path: '',
    children: [
      {
        path: 'addcompany',
        component: AddcompanyComponent
        ,
        data: {
          title: 'Add Company'
        }
      },
  ]  },








];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
