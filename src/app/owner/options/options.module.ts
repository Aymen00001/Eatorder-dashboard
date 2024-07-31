import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptionsRoutingModule } from './options-routing.module';
import { AddGroupeOptionComponent } from './add-groupe-option/add-groupe-option.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllGroupeOptionComponent } from './all-groupe-option/all-groupe-option.component';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AddOptionComponent } from './add-option/add-option.component';
import { AllOptionsComponent } from './all-options/all-options.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipComponent } from 'src/app/ng-components/tooltip/tooltip.component';


@NgModule({
  declarations: [
    AddGroupeOptionComponent,
    AllGroupeOptionComponent,
    AddOptionComponent,
    AllOptionsComponent,
    TooltipComponent,
  

  ],
  imports: [
    CommonModule,
    OptionsRoutingModule,
    FormsModule,
    NgxPaginationModule,
    TranslateModule,
    NgbModule,
    ReactiveFormsModule,

    

  ]
})
export class OptionsModule { }
