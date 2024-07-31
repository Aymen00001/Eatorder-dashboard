import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddGroupeOptionComponent } from './add-groupe-option/add-groupe-option.component';
import { AllGroupeOptionComponent } from './all-groupe-option/all-groupe-option.component';
import { AddOptionComponent } from './add-option/add-option.component';
import { AllOptionsComponent } from './all-options/all-options.component';


const routes: Routes = [ {
  path: '',
  children: [
    {
      path: 'addGroupeOption',
      component: AddGroupeOptionComponent,
      data: {
        title: 'Options'
      }
    },
    {
      path: 'allGroupeOption',
      component: AllGroupeOptionComponent,
      data: {
        title: 'Options'
      }
    },
    {
      path: 'addOption',
      component: AddOptionComponent,
      data: {
        title: 'Options'
      }
    },
    {
      path: 'allOptions',
      component: AllOptionsComponent,
      data: {
        title: 'Options'
      }
    },

]  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OptionsRoutingModule { }
