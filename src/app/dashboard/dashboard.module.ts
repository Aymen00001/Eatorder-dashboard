import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighchartsChartModule } from 'highcharts-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ChartModule } from 'angular2-chartjs';
import { FormsModule } from '@angular/forms';
import { ClientsComponent } from './clients/clients.component';
import { StoreComparativeComponent } from './store-comparative/store-comparative.component';
import { VentesComponent } from './ventes/ventes.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StatisticcompanyComponent } from './statisticcompany/statisticcompany.component'; 


@NgModule({
  declarations: [
    AnalyticsComponent, 
    ECommerceComponent, ClientsComponent, StoreComparativeComponent, VentesComponent, StatisticcompanyComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PerfectScrollbarModule,
    HighchartsChartModule,
    ChartModule,
    FormsModule,
    NgxPaginationModule
    
    
  ]
})
export class DashboardModule { }
