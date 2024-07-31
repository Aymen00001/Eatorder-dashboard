import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { ApparenceComponent } from './apparence/apparence.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { AllstoreComponent } from './allstore/allstore.component';
import { EditstoreComponent } from './editstore/editstore.component';
import { AddstoreComponent } from './addstore/addstore.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { CouponComponent } from './coupon/coupon.component';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PaymentComponent } from './payment/payment.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AllmanagerComponent } from './allmanager/allmanager.component';
import { AddmanagerComponent } from './addmanager/addmanager.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';



@NgModule({
  declarations: [
    ApparenceComponent,
    AllstoreComponent,
    EditstoreComponent,
    AddstoreComponent,
    OpeningHoursComponent,
    CouponComponent,
    PaymentComponent,
    AllmanagerComponent,
    AddmanagerComponent
  ],
  imports: [
    NgxIntlTelInputModule,
    CommonModule,
    StoreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    NgxPaginationModule,
    NgbDatepickerModule,
    GooglePlaceModule
    
  ]
})
export class StoreModule { }
