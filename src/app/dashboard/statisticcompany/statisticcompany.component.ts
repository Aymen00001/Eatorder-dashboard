import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StatisticcompanyService } from './statisticcompany.service';
import * as Chart from 'chart.js';


@Component({
  selector: 'app-statisticcompany',
  templateUrl: './statisticcompany.component.html',
  styleUrls: ['./statisticcompany.component.scss']
})
export class StatisticcompanyComponent implements OnInit {
  selectedItemsPerPage: number = 20;
  orderNumber: any;
  storevente: any = [];
  user: any;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  totalItems: number;
  displayedItems: [] = [];
  Userrole:any;
  constructor( private apiservice: ApiServices, private modalService: NgbModal,private statistique :StatisticcompanyService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.selectedYear = new Date().getFullYear();
   }
  ngOnInit(): void {
    this.Userrole=localStorage.getItem('role');

  }
  isManagerRole(): boolean {
    // Vérifie si le rôle de l'utilisateur est 'manager'
    return this.Userrole === 'manager';
  }
  listestore:any=[]
  getventecompany(yers:any): void {
    this.listestore=this.user.stores
    this.statistique.getStoreOrders(this.listestore,yers).subscribe(
      (data) => {
        this.storevente = data;
        this.storevente.forEach((orderItem, index) => {
          this.orderNumber = index + 1;
          orderItem.orderNumber = index + 1;
        });
        if (this.storevente && this.storevente.length > 0) {
          this.createChart();
        } else {
          console.error('No data received for store sales');
        }
      },
      (error) => {
        console.error('Error fetching store sales:', error);
      }
    );
  }
  
  createChart(): void {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Context 2D not supported');
      return;
    }
    const labels = this.storevente.map(vente => vente.storeName);
    const data = this.storevente.map(vente => vente.totalOrders);
  
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Sales of Stores',
          data: data,
          backgroundColor: 'rgba(255, 206, 86, 0.2)', 
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
  sortDirection: string = 'asc'; 
  sortedColumn: string = ''; 
  sortClientsByTotalSpent() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortedColumn = 'percentTotalSales';
    this.storevente.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.percentage - b.percentage;
      } else {
        return b.percentage - a.percentage;
      }
    }); 
    this.updateDisplayedItems(); 
  }
  updateDisplayedItems() {
    if (this.storevente) {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedItems = this.storevente.slice(startIndex, endIndex);
    }
  }
  //Chiffre d'affaire
  totalRevenue: number = 0;
  totalHtRevenue: number = 0;
  selectedYear:any
  getchiffrecompany(yers: any): void {
    this.loadingCategories = true; 
    this.listestore = this.user.stores;
    this.statistique.getchiffrebycompany(this.listestore, yers).subscribe(
      (data: any) => {
        if (data) {
          this.totalRevenue = data.totalRevenueAllStores || 0;
          this.totalHtRevenue = data.totalHtRevenueAllStores || 0;
        } else {
          this.totalRevenue = 0;
          this.totalHtRevenue = 0;
        }
        this.loadingCategories = false;
      },
      (error) => { 
        console.error('Error fetching store sales:', error);
        this.totalRevenue = 0;
        this.totalHtRevenue = 0;
        this.loadingCategories = false;
      }
    );
  }
  
  loadingCategories: boolean = false;
  //afficher detail  store
  currenyData: any = [];
  specialiteNames: string[] = [];
  openModal(content: any, storeId: string) {
    this.apiservice.getStroreById(storeId).subscribe(
      (response) => {
        this.currenyData = response;
          this.modalService.open(content, { size: 'lg' }).result.then(
          (result) => { },
          (reason) => { }  );
      },
      (error) => {
        console.error('Error retrieving Store', error);
      }
    );
  }
  calculateTotalVentes(): number {
    let totalSales = 0;
    this.storevente.forEach(vente => {
        totalSales += vente.totalOrders;
    });
    return totalSales;
  }
  
  
    
}
