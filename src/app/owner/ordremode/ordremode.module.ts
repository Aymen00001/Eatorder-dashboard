import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdremodeRoutingModule } from './ordremode-routing.module';
import { AllordremodeComponent } from './allordremode/allordremode.component';
import { FormsModule } from '@angular/forms';
import { AddmodeComponent } from './addmode/addmode.component'; // Import FormsModule

@NgModule({
  declarations: [
    AllordremodeComponent,
    AddmodeComponent
  ],
  imports: [
    CommonModule,
    OrdremodeRoutingModule,
    FormsModule // Add FormsModule to imports
  ]
})
export class OrdremodeModule { }
