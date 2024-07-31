import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { StoresRoutingModule } from './stores-routing.module';
import { AllStoresComponent } from './all-stores/all-stores.component';
import { RequestedStoresComponent } from './requested-stores/requested-stores.component';
import { RejectedStoresComponent } from './rejected-stores/rejected-stores.component';
import { SpecialiteComponent } from './specialite/specialite.component';


@NgModule({
  declarations: [
    AllStoresComponent,
    RequestedStoresComponent,
    RejectedStoresComponent,
    SpecialiteComponent
  ],
  imports: [
    CommonModule,
    StoresRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgbPaginationModule,
    HttpClientModule,
    TranslateModule

    
  ],
  providers: [
    DatePipe
  ]
})
export class StoresModule { }
