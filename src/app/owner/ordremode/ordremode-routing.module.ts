import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllordremodeComponent } from './allordremode/allordremode.component';
import { AddmodeComponent } from './addmode/addmode.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all-mode',
        component: AllordremodeComponent,
        data: {
          title: 'Ordre mode'
        }
      },
  
  ]  },
  {
    path: '',
    children: [
      {
        path: 'addmode',
        component: AddmodeComponent,
        data: {
          title: 'Add ordre mode'
        }
      },
  
  ]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdremodeRoutingModule { }
