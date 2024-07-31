import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSaleComponent } from './new-sale/new-sale.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new-sale',
        component: NewSaleComponent,
        data: {
          title: 'new sale'
        }
      },
  
  ]  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
