import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PosRoutingModule } from './pos-routing.module';
import { NewSaleComponent } from './new-sale/new-sale.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    NewSaleComponent
  ],
  imports: [
    CommonModule,
    PosRoutingModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PosModule { }
