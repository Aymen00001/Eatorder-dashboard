import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddtaxComponent } from './addtax/addtax.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addtax',
        component: AddtaxComponent,
        data: {
          title: 'Add tax'
        }
      },
  
  ]  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule { }
