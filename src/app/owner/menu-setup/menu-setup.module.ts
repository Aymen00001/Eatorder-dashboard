import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuSetupRoutingModule } from './menu-setup-routing.module';
import { MenuSetupComponent } from './menu-setup/menu-setup.component';


import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastsContainer } from './toast-container';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OptionsGroupsComponent } from './options-groups/options-groups.component';
import { AddpromoComponent } from './addpromo/addpromo.component';
import { AllpromoComponent } from './allpromo/allpromo.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { ClonemenuComponent } from './clonemenu/clonemenu.component';
import { TagsStoreComponent } from './tags-store/tags-store.component';

@NgModule({
  declarations: [
    MenuSetupComponent,
    ToastsContainer,
    OptionsGroupsComponent,
    AddpromoComponent,
    AllpromoComponent,
    ClonemenuComponent,
    TagsStoreComponent,

  ],
  imports: [
    CommonModule,
    MenuSetupRoutingModule,
    NgbAccordionModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DragDropModule,
    ImageCropperModule,
    HttpClientModule,
    NgxPaginationModule
    
  ],
  exports: [
 
  ],
})
export class MenuSetupModule { }
