import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllComponent } from './all/all.component';
import { OrderAcceptedComponent } from './order-accepted/order-accepted.component';
import { OrderReadyComponent } from './order-ready/order-ready.component';

const routes: Routes = [  {
  path: '',
  children: [
    {
      path: 'all',
      component: AllComponent,
      data: {
        title: 'All'
      }
    },
    {
      path: 'orderaccepted',
      component:OrderAcceptedComponent,
      data: {
        title: 'orderaccepted'
      }
    },
    {
      path: 'orderready',
      component:OrderReadyComponent,
      data: {
        title: 'orderready'
      }
    },

],
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
