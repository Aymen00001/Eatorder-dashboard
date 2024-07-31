import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { ClientsComponent } from './clients/clients.component';
import { StoreComparativeComponent } from './store-comparative/store-comparative.component';
import { VentesComponent } from './ventes/ventes.component';
import { StatisticcompanyComponent } from './statisticcompany/statisticcompany.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'e-commerce',
        component: ECommerceComponent,
        data: {
          title: 'e-Commerce'
        }
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        data: {
          title: 'Analytics'
        }
      },
      {
        path: 'clients',
        component: ClientsComponent,
        data: {
          title: 'Clients'
        }
      },
      {
        path: 'compartivestore',
        component: StoreComparativeComponent,
        data: {
          title: 'compartive-store'
        }
      },
       {
        path: 'ventes',
        component: VentesComponent,
        data: {
          title: 'ventes'
        }
      },
      {
        path: 'statisticcompany',
        component: StatisticcompanyComponent,
        data: {
          title: 'statisticcompany'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
