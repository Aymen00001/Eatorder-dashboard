import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TaxRoutingModule } from './tax-routing.module';
import { AddtaxComponent } from './addtax/addtax.component';


@NgModule({
  declarations: [
    AddtaxComponent
  ],
  imports: [
    CommonModule,
    TaxRoutingModule,
    FormsModule,
    NgbModule,
  ]
})
export class TaxModule { }
