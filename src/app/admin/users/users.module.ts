import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
 import{ToastsContainer} from "./add-owners/toast-container"
import { UsersRoutingModule } from './users-routing.module';
import { ListOwnersComponent } from './list-owners/list-owners.component';
import { AddOwnersComponent } from './add-owners/add-owners.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module






@NgModule({
  declarations: [
    ListOwnersComponent,
    AddOwnersComponent,
    ToastsContainer,
    
    
    
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    TranslateModule
    
  ],
  providers: [
    DatePipe,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
