import { Component, OnInit } from '@angular/core';
import { VentesService } from './ventes.service';
import { ApiServices } from 'src/app/services/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Chart from 'chart.js';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss']
})
export class VentesComponent implements OnInit {
  orderNumber: any;
  totalSalesPercentage: number = 0; 
  selectedItemsPerPage: number = 20;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  totalItems: number;
  displayedItems: [] = [];
  selectedOption: string ='Order'; 
  chartCreated: boolean = false;
  order: any[] = [];

  constructor(private VentesService: VentesService, private apiservice: ApiServices, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.updateDisplayedItems();
    this.show(); 
    this.initializeMonth();

  }
//produit
  ventes: any = [];
  getventes(): void {
    this.VentesService.getventebyproduit(this.apiservice.getStore(),this.startDate,this.endDate).subscribe(
      (data) => {
        this.ventes = data;
       // console.log(data);
        this.ventes.forEach((orderItem, index) => {
          this.orderNumber = index + 1;
          orderItem.orderNumber = index + 1;
        });
          this.createChart();
        
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }
  createChart() {
    const canvas = document.getElementById('salesChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Context 2D not supported');
      return;
    }
    const chart = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: this.ventes.map(vente => vente.productName),
        datasets: [{
          label: 'Total des Products',
          data: this.ventes.map(vente => vente.totalSales),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
    this.ventes.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return a.percentTotalSales - b.percentTotalSales;
      } else {
        return b.percentTotalSales - a.percentTotalSales;
      }
    }); 
    this.updateDisplayedItems(); 
  }
  updateDisplayedItems() {
    if (this.ventes) {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.displayedItems = this.ventes.slice(startIndex, endIndex);
    }
  }
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.updateDisplayedItems();
  }
  calculateTotalSales(): number {
    let totalSales = 0;
    this.ventes.forEach(vente => {
      console.log("totalSales1",totalSales)

        totalSales += vente.priceproduct * vente.totalSales;
        console.log("totalSales2",totalSales)

    });
    return totalSales;
}
calculateTotalVentes(): number {
  let totalSales = 0;
  this.ventes.forEach(vente => {
      totalSales += vente.totalSales;
  });
  return totalSales;
}
selectedMonth: string = ''; 
startDate: string = ''; 
endDate: string = '';
formatDate(inputDate: Date): string {
  const year = inputDate.getFullYear();
  const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
  const day = ('0' + inputDate.getDate()).slice(-2); 
  return `${year}-${month}-${day}`;
}
onMonthChange(event: any) {
  const selectedDate = new Date(this.selectedMonth);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  this.startDate = this.formatDate(startDate);
  this.endDate = this.formatDate(endDate);
  console.log("startDate",this.startDate)
  console.log("endDate",this.endDate)
  this.refreshData();
}
//fin produit
refreshData() {
  if (this.selectedOption === 'Produit') {
    this.getventes();
  } else if (this.selectedOption === 'Mode') {
    this.getmodes();
  } else if (this.selectedOption === 'Status') {
    this.getstatus();
  } else if (this.selectedOption === 'Order') {
    this.getAllorder();
  } else if (this.selectedOption === 'Categories') {
    this.getCategories();
  } else if (this.selectedOption === 'Payement') {
    this.getpayementmode();
  }
}
  show(){
    if (this.selectedOption === 'Produit') {
     this.getventes()
    }
    if (this.selectedOption === 'Mode') {
      this.getmodes()
     }
     if (this.selectedOption === 'Status') {
      this.getstatus()
     }
     if (this.selectedOption === 'Order') {
      this.getAllorder()
     }
     if (this.selectedOption === 'Categories') {
      this.getCategories()
     }
     if (this.selectedOption === 'Payement') {
      this.getpayementmode()
     }
     this.refreshData();

  }
  //mode
  modes: any = [];
  getmodes(): void {
    this.VentesService.getventebymode(this.apiservice.getStore(),this.startDate,this.endDate).subscribe(
      (data) => {
        this.modes = data;
       // console.log(data);
        this.modes.forEach((orderItem, index) => {
          this.orderNumber = index + 1;
          orderItem.orderNumber = index + 1;
        });
          this.createChartMode();
        
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }
  sortDirectionmode: string = 'asc'; 
  sortedColumnmode: string = ''; 
  
  sortmodeByTotalSpent() {
    this.sortDirectionmode = this.sortDirectionmode === 'asc' ? 'desc' : 'asc';
    this.sortedColumnmode = 'percentTotalMode';
    this.modes.sort((a, b) => {
      if (this.sortDirectionmode === 'asc') {
        return a.percentTotalMode - b.percentTotalMode;
      } else {
        return b.percentTotalMode - a.percentTotalMode;
      }
    }); 
  }
  createChartMode() {
    const canvas = document.getElementById('salesChartmode') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Context 2D not supported');
      return;
    }
    const chart = new Chart(ctx, {
      type: 'doughnut', 
      data: {
        labels: this.modes.map(mode => mode._id),
        datasets: [{
          label: 'Total Mode',
          data: this.modes.map(mode => mode.totalSales),
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'right', // Position de la légende
          labels: {
            boxWidth: 15, // Largeur de la boîte de la légende
            fontSize: 12 // Taille de la police de la légende
          }
        },
        title: {
          display: true,
          text: 'Répartition des ventes par mode' // Titre du graphique
        }
      }
    });
}
//Mode Status
status: any = [];
getstatus(): void {
  this.VentesService.getventebystatus(this.apiservice.getStore(),this.startDate,this.endDate).subscribe(
    (data) => {
      this.status = data;
     //console.log(data);
      this.status.forEach((orderItem, index) => {
        this.orderNumber = index + 1;
        orderItem.orderNumber = index + 1;
      });
        this.createChartStatus();
    },
    (error) => {
      console.error('Error fetching clients:', error);
    }
  );
} 
sortDirectionstatus: string = 'asc'; 
sortedColumnstatus: string = ''; 
sortStatusByTotalSpent() {
  this.sortDirectionstatus = this.sortDirectionstatus === 'asc' ? 'desc' : 'asc';
  this.sortedColumnstatus = 'percentTotalStatus';
  this.status.sort((a, b) => {
    if (this.sortDirectionstatus === 'asc') {
      return a.percentTotalStatus - b.percentTotalStatus;
    } else {
      return b.percentTotalStatus - a.percentTotalStatus;
    }
  }); 
}
createChartStatus() {
  const canvas = document.getElementById('salesChartstatus') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Context 2D not supported');
    return;
  }
  const chart = new Chart(ctx, {
    type: 'doughnut', 
    data: {
      labels: this.status.map(statu => statu._id),
      datasets: [{
        label: 'Pourcentage total des ventes',
        data: this.status.map(statu => statu.totalstatus),
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'right', // Position de la légende
        labels: {
          boxWidth: 15, // Largeur de la boîte de la légende
          fontSize: 12 // Taille de la police de la légende
        }
      },
      title: {
        display: true,
        text: 'Répartition des ventes par mode' // Titre du graphique
      }
    }
  });
}

//Order
getAllorder() {
  this.apiservice.getOrderByStoreId(this.apiservice.getStore()).subscribe(
    (response) => {
      // Filtrer les commandes avec le statut "accepted"
      this.order = response.filter(orderItem => orderItem.status === "accepted");
     // console.log("order", this.order);

      // Mettre à jour le nombre de commande
      this.apiservice.orders = this.order;
      this.order.forEach((orderItem, index) => {
        orderItem.orderNumber = index + 1;
      });
    },
    error => {
      console.error("Error fetching orders: ", error);
    }
  );
}
calculateTotalSalesorder(): number {
  let totalSales = 0;
  this.order.forEach(order => {
      totalSales += order.price_total;
  });
  return parseFloat(totalSales.toFixed(2)); // Convertir en nombre à virgule flottante avec 2 décimales
}
sortDirectionorder: string = 'asc'; 
sortedColumnorder: string = '';
sortmodeByorder() {
  this.sortDirectionorder = this.sortDirectionorder === 'asc' ? 'desc' : 'asc';
  this.sortedColumnorder = 'dataorder';
  this.order.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (this.sortDirectionorder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  }); 
}
//Categories
categories: any = [];
loadingCategories: boolean = false;
getCategories(){
  this.loadingCategories = true; // Activer le spinner

  this.VentesService.getventebyCategories(this.apiservice.getStore(),this.startDate,this.endDate).subscribe(
    (data) => {
      this.categories = data;
    // console.log(data);
      this.categories.forEach((orderItem, index) => {
        this.orderNumber = index + 1;
        orderItem.orderNumber = index + 1;
      });
        this.createChartCtageorie();
        this.loadingCategories = false; // Désactiver le spinner une fois les données chargées

    },
    (error) => {
      this.loadingCategories = false; // Désactiver le spinner une fois les données chargées
      console.error('Error fetching clients:', error);
    }
  );
}
createChartCtageorie() {
  const canvas = document.getElementById('salesChartCategorie') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Context 2D not supported');
    return;
  }
  const chart = new Chart(ctx, {
    type: 'line', 
    data: {
      labels: this.categories.map(vente => vente.name),
      datasets: [{
        label: 'Total des Categories',
        data: this.categories.map(vente => vente.totalSales),
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red color with 20% opacity
borderColor: 'rgba(255, 99, 132, 1)', // Red color with full opacity
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
sortDirectioncategories: string = 'asc'; 
sortedColumncategories: string = ''; 
sortByTotalSpentCategories() {
  this.sortDirectioncategories = this.sortDirectioncategories === 'asc' ? 'desc' : 'asc';
  this.sortedColumncategories = 'percentageSales';
  this.categories.sort((a, b) => {
    if (this.sortDirectioncategories === 'asc') {
      return a.percentageSales - b.percentageSales;
    } else {
      return b.percentageSales - a.percentageSales;
    }
  }); 
  this.updateDisplayedItems(); // Mettre à jour les éléments affichés

}
calculateTotalcategories(): number {
  let totalSales = 0;
  this.categories.forEach(vente => {
    totalSales += vente.totalSales;
});
  return totalSales;
}
//payement mode
payement: any = [];
getpayementmode(): void {
  this.VentesService.getventebypaymentmode(this.apiservice.getStore(),this.startDate,this.endDate).subscribe(
    (data) => {
      this.payement = data;
     // console.log(data);
      this.payement.forEach((orderItem, index) => {
        this.orderNumber = index + 1;
        orderItem.orderNumber = index + 1;
      });
        this.createChartModepayement();
      
    },
    (error) => {
      console.error('Error fetching clients:', error);
    }
  );
}
sortDirectionpayement: string = 'asc'; 
sortedColumnpayement: string = ''; 
sortmodeByTotalpayement() {
  this.sortDirectionpayement = this.sortDirectionpayement === 'asc' ? 'desc' : 'asc';
  this.sortedColumnpayement = 'percentTotalMode';
  this.payement.sort((a, b) => {
    if (this.sortDirectionpayement === 'asc') {
      return a.percentage - b.percentage;
    } else {
      return b.percentage - a.percentage;
    }
  }); 
}
createChartModepayement() {
  const canvas = document.getElementById('salesChartpayement') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Context 2D not supported');
    return;
  }
  const chart = new Chart(ctx, {
    type: 'doughnut', 
    data: {
      labels: this.payement.map(payement => payement._id),
      datasets: [{
        label: 'Pourcentage total Mode',
        data: this.payement.map(payement => payement.total),
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'right', 
        labels: {
          boxWidth: 15, 
          fontSize: 12 
        }
      },
      title: {
        display: true,
        text: 'Mode Payment.' 
      }
    }
  });
}
calculateTotalpayement(): number {
  let total = 0;
  this.payement.forEach(vente => {
    total += vente.total;
});
  return total;
}
//initializeMonth
initializeMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  this.selectedMonth = `${year}-${(month + 1).toString().padStart(2, '0')}`; // Format YYYY-MM
  this.startDate = this.formatDate(startDate);
  this.endDate = this.formatDate(endDate);
  this.refreshData(); // Vous pouvez appeler refreshData() ici ou à la fin selon vos besoins
}
}
