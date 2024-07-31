import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './currency/banner.component';
import { AddUnityComponent } from './add-unity/add-unity.component';
import { AddModeComponent } from './add-mode/add-mode.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import { StripeAccountComponent } from './stripe-account/stripe-account.component';

@NgModule({
  declarations: [
    BannerComponent,
    AddUnityComponent,
    AddModeComponent,
    StripeAccountComponent
  ],
  imports: [
  
    CommonModule,
    BannerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    DragDropModule,
    MatNativeDateModule,
    
  ]
})
export class BannerModule { }
