import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuSetupComponent } from './menu-setup/menu-setup.component';
import { OptionsGroupsComponent } from './options-groups/options-groups.component';
import { AddpromoComponent } from './addpromo/addpromo.component';
import { AllpromoComponent } from './allpromo/allpromo.component';
import { ClonemenuComponent } from './clonemenu/clonemenu.component';
import { TagsStoreComponent } from './tags-store/tags-store.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'menu-setup',
        component: MenuSetupComponent,
        data: {
          title: 'Menu Setup'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'optionsgroups',
        component: OptionsGroupsComponent,
        data: {
          title: 'Option Groups'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'addpromo',
        component: AddpromoComponent,
        data: {
          title: 'addpromo'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'Allpromo',
        component: AllpromoComponent,
        data: {
          title: 'Allpromo'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'clonemenu',
        component:ClonemenuComponent,
        data: {
          title: 'clonemenu'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'tags-store',
        component:TagsStoreComponent,
        data: {
          title: 'tags-store'
        }
      },
  
  ]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuSetupRoutingModule { }
