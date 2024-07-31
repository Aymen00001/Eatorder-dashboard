import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './currency/banner.component';
import { AddUnityComponent } from './add-unity/add-unity.component';
import { AddModeComponent } from './add-mode/add-mode.component';
import { StripeAccountComponent } from './stripe-account/stripe-account.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addStore',
        component: BannerComponent,
        data: {
          title: 'addStore'
        }
      },
  ]  },
  {
    path: '',
    children: [
      {
        path: 'settings',
        component: AddUnityComponent,
        data: {
          title: 'Add Unity'
        }
      },
  ]  },
  {
    path: '',
    children: [
      {
        path: 'addMode/:id',
        component: AddModeComponent,
        data: {
          title: 'Add Mode'
        }
      },
  ]  },
  {
    path: '',
    children: [
      {
        path: 'stripeaccount',
        component: StripeAccountComponent,
        data: {
          title: 'stripeaccount'
        }
      },
  ]  },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }






