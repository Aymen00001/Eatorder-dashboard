import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOwnersComponent } from './list-owners/list-owners.component';
import { AddOwnersComponent } from './add-owners/add-owners.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list-owners',
        component: ListOwnersComponent,
        data: {
          title: 'List Owners'
        }
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: 'add-owners',
        component: AddOwnersComponent,
        data: {
          title: 'Add Owners'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
