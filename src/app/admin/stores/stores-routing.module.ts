import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllStoresComponent } from './all-stores/all-stores.component';
import { RequestedStoresComponent } from './requested-stores/requested-stores.component';
import { RejectedStoresComponent } from './rejected-stores/rejected-stores.component';
import { SpecialiteComponent } from './specialite/specialite.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-stores',
        component: AllStoresComponent,
        data: {
          title: 'All Stores'
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'list-stores-request',
        component: RequestedStoresComponent,
        data: {
          title: 'Requested Stores'
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'list-stores-rejected',
        component: RejectedStoresComponent,
        data: {
          title: 'Rejected Stores'
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'specialite',
        component: SpecialiteComponent,
        data: {
          title: 'Specialite'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresRoutingModule { }
