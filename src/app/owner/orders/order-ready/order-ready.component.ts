import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from '../../menu-setup/toast-service';
import { Order } from 'src/app/models/order';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-ready',
  templateUrl: './order-ready.component.html',
  styleUrls: ['./order-ready.component.scss']
})
export class OrderReadyComponent implements OnInit {
  selectedItem: any;
  showStatusDropdown = true;
    order: any[] = [];
  user: any;
  searchTerm: string = '';
  orderData:any=[];
  items: any[] = [];
  storesId: number;
  totalItems: number;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  displayedItems: Order[] = [];
  p: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 20];
  selectedItemsPerPage: number = 20;
  orderNumber:any;
  searchTermControl = new FormControl();


  constructor(private apiService: ApiServices,
    private route:Router,private toastService: ToastService) { }

  ngOnInit(): void {
    this.getAllorder();
if(this.apiService.orders){this.totalItems = this.filteredStores().length; }
this.updateDisplayedItems();
  }
  getAllorder() {
    this.apiService.getOrderByStoreId(this.apiService.getStore()).subscribe(
      (response) => { 
        // Filtrer les commandes pour ne récupérer que celles avec le statut "ready"
        this.apiService.orders = response.filter(order => order.status === 'ready');
  
        // Mettre à jour les numéros de commande pour chaque commande
        this.apiService.orders.forEach((orderItem, index) => {
          orderItem.orderNumber = index + 1;
          orderItem.lastFourDigits = orderItem._id.toString().slice(-4);

        });
      },
      error => { 
        console.error('Error fetching orders', error); 
      }
    );
  }
  
  
  updateDisplayedItems() {
    if(this.apiService.orders){
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedItems = this.filteredStores().slice(startIndex, endIndex);
    }
  }
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.updateDisplayedItems();
  }
  filteredStores(): any[] {
    if (this.apiService.orders) {
      return this.apiService.orders.filter(order => {
        // Filtrer les commandes acceptées
        if (order.status === 'ready') {
          // Filtrer les commandes en fonction du terme de recherche
          return Object.values(order).some(field => {
            if (typeof field === 'string' || field instanceof String) {
              return field.toLowerCase().includes(this.searchTerm.toLowerCase());
            } else if (typeof field === 'number' && field.toString().includes(this.searchTerm)) {
              return true;
            }
            return false;
          });
        }
        return false; // Si la commande n'est pas "accepted", la filtrer
      });
    }
    return [];
  }
  
          //color 
          getStatusStyle(status: string): { [key: string]: string } {
            switch (status) {
              case 'accepted':
                return { 'background-color': '#28A745', 'color': '#fff' };
              case 'pending':
                return { 'background-color': '#FFC107', 'color': '#000' };
              case 'rejected':
                return { 'background-color': '#DC3545', 'color': '#fff' };
                case 'ready':
                  return { 'background-color': '#4F6F52', 'color': '#fff' };
                  case 'missed':
                    return { 'background-color': '#BF3131', 'color': '#fff' };
              default:
                return {};
            }
          }
          //delettealldelivery
selectedOrders: { [orderId: string]: boolean } = {};
deleteSelectedOrders(): void {
  const isConfirmed = confirm('Are you sure you want to delete this orders?');
  if (isConfirmed) {
  const selectedOrderIds = Object.keys(this.selectedOrders).filter(orderId => this.selectedOrders[orderId]);
  if (selectedOrderIds.length === 0) {
    console.warn('No orders selected for deletion.');
    this.toastService.show('No orders selected for deletion.', { classname: 'bg-secondary text-light' });
    return;
  }
  this.apiService.deleteOrderss(selectedOrderIds)
    .subscribe(
      () => {
        this.getAllorder()
        this.toastService.show('Selected orders deleted successfully.', { classname: 'bg-success text-light' });

        console.log('Selected orders deleted successfully');
        // Réalisez toute autre action nécessaire après la suppression
      },
      error => {
        this.toastService.show('Error deleting selected orders.', { classname: 'bg-danger text-light' });

        console.error('Error deleting selected orders:', error);
        // Gérez les erreurs de suppression
      }
    );
      this.selectedOrders = {};
}
else {  console.log('Deletion canceled'); } 

}
}
