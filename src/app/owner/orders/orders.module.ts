import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { AllComponent } from './all/all.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination'; 

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderAcceptedComponent } from './order-accepted/order-accepted.component';
import { OrderReadyComponent } from './order-ready/order-ready.component';


@NgModule({
  declarations: [
    AllComponent,
    OrderAcceptedComponent,
    OrderReadyComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,MatPaginatorModule,MatTableModule,NgxPaginationModule,FormsModule,ReactiveFormsModule
  ]
})
export class OrdersModule { }
