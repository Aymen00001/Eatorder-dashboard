import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { AllcompanyComponent } from './allcompany/allcompany.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AddcompanyComponent } from './addcompany/addcompany.component';

@NgModule({
  declarations: [
    AllcompanyComponent,
    AddcompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgxPaginationModule
  ]
})
export class CompanyModule { }
