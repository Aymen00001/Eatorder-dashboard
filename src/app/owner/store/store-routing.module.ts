import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApparenceComponent } from './apparence/apparence.component';
import { AllStoresComponent } from 'src/app/admin/stores/all-stores/all-stores.component';
import { AllstoreComponent } from './allstore/allstore.component';
import { EditstoreComponent } from './editstore/editstore.component';
import { AddstoreComponent } from './addstore/addstore.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { CouponComponent } from './coupon/coupon.component';
import { PaymentComponent } from './payment/payment.component';
import { AllmanagerComponent } from './allmanager/allmanager.component';
import { AddmanagerComponent } from './addmanager/addmanager.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'apparence',
        component: ApparenceComponent,
        data: {
          title: 'Apparence'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'allstore',
        component: AllstoreComponent,
        data: {
          title: 'All Store'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'editstore/:id',
        component: EditstoreComponent,
        data: {
          title: 'Edit Store'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'addstore',
        component: AddstoreComponent,
        data: {
          title: 'Add Store'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'openinghours',
        component: OpeningHoursComponent,
        data: {
          title: 'Opening Hours'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'coupon',
        component: CouponComponent,
        data: {
          title: 'Coupon'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'payment',
        component: PaymentComponent,
        data: {
          title: 'Payment'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'allmanager',
        component: AllmanagerComponent,
        data: {
          title: 'all manager'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'addmanager',
        component: AddmanagerComponent,
        data: {
          title: 'addmanager'
        }
      },
  
  ]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
