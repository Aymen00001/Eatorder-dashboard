import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { AdminserviceService } from './adminservice.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-e-commerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss']
})
export class ECommerceComponent implements OnInit {
  totalOwners = 0;
  constructor(private apiService: ApiServices,private serveradmin:AdminserviceService) { }
  ngOnInit(): void {
     this.getnombercompany();
     this.getnomberStore();
     this.getnomberowner();
     this.getnombertotalstores();
     this.getnombertotalstorespending();
     this.gettotalstatuschart();
      }
  totalcompany: number = 0;
  getnombercompany(){
      this.serveradmin.getNumberCompany().subscribe(
          (response: any) => {            
            this.totalcompany = response.count;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }
  totalStore: number = 0;
  getnomberStore(){
      this.serveradmin.getNumberStore().subscribe(
          (response: any) => {            
            this.totalStore = response.count;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }
  totalOwner: number = 0;
  getnomberowner(){
      this.serveradmin.getNumberStore().subscribe(
          (response: any) => {            
            this.totalOwner = response.count;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }
  totalstores: number = 0;
  getnombertotalstores(){
      this.serveradmin.getNumbersStore().subscribe(
          (response: any) => {            
            this.totalstores = response.count;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }
  totalstoresrejected: number = 0;
  getnombertotalstoresrejected(){
      this.serveradmin.getnombrestorerejected().subscribe(
          (response: any) => {            
            this.totalstoresrejected = response.count;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }
  totalstorespending: number = 0;
  getnombertotalstorespending(){
      this.serveradmin.getnombrestorespending().subscribe(
          (response: any) => {            
            this.totalstorespending = response.count;
          },
          (error: any) => {
            console.error(error);
          }
        );
  }
  totalstatus:any;
  gettotalstatuschart(){
    this.serveradmin.gettotalstatus().subscribe(
        (response: any) => {            
          this.totalstatus = response;
          this.createChart()
        },
        (error: any) => {
          console.error(error);
        }
      );
}
createChart(): void {
  if (!this.totalstatus || this.totalstatus.length === 0) {
    console.error('No data available');
    return;
  }
  const canvas = document.getElementById('statusChart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Context 2D not supported');
    return;
  }
  const labels = this.totalstatus.map(status => `Month ${status.month}`);
  const activeData = this.totalstatus.map(status => status.activeCount);
  const rejectedData = this.totalstatus.map(status => status.rejectedCount);
  const pendingData = this.totalstatus.map(status => status.pendingCount);
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Active',
          data: activeData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Rejected',
          data: rejectedData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Pending',
          data: pendingData,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      }
    }
  });
}


}

