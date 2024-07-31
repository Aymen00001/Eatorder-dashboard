import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiServices } from 'src/app/services/api';
import { ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'; // Make sure this import is present
import { Order } from 'src/app/models/order';
import { ToastService } from 'src/app/toast-service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
  @ViewChild('statusModalContent') statusModalContent: any;
  searchForm: FormGroup;
  searchTermControl = new FormControl();
  selectedItem: any;
  showStatusDropdown = true;
    order: any[] = [];
  user: any;
  modalContent2: NgbModalRef;
  searchTerm: string = '';
  orderData:any=[];
  items: any[] = [];
  storesId: number;
  modalRef: NgbModalRef | undefined;
  totalItems: number;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  displayedItems: Order[] = [];
  p: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 20];
  selectedItemsPerPage: number = 20;
  orderNumber:any;
  socket:any
  uber: any;
  constructor(private modalService: NgbModal,private apiService: ApiServices,
    private route:Router,private cdr: ChangeDetectorRef ,private zone: NgZone,private toastService: ToastService) {
      //this.socket = io('https://api2.eatorder.fr');
      this.searchForm = new FormGroup({
        searchTerm: new FormControl(''),
      });
      window.addEventListener('load', () => {
      //  this.reloadAndReconnectSockets();
    });
    this.updateBadgeNumbers()
  }
  message: string = '';  clientId: string ;
  messagezz:any
  connectToSocket(uberWebhook: any[]): void {
    const connectListener = () => {
      for (let i = 0; i < uberWebhook.length; i++) {
        window.socket.emit("join_room", uberWebhook[i].uberId);
      }  };
  }
  //socketnumber
badgeNumber: number = 0;
badgeNumbers: { [uberId: string]: number } = {};
updateBadgeNumbers() {
  const receivedDataArray = JSON.parse(localStorage.getItem('receivedata') || '[]');
  const badgeNumbers = {}; 
  receivedDataArray.forEach(item => {
    if (item.data && item.data.delivery_id) {
      const deliveryId = item.data.delivery_id;
      badgeNumbers[deliveryId] = (badgeNumbers[deliveryId] || 0) + 1;}
  });
  this.badgeNumbers = badgeNumbers; 

}
socketIds: any[] = [];
ownerbloque:any;
connectemobile:any
  ngOnInit(): void {
    if (window.socket) {
      //mobile
      window.socket.on('check_user', (data: any) => {
        console.log("data", data);
        console.log("data", data.device );
        console.log("data", data.state);
this.connectemobile=data.state;
      });
    } else {console.error("Socket is not initialized!"); }
    let receivedDataArray: any[] = [];
    window.socket.on('receive_data', (data: any) => {
      let receivedDataArray = JSON.parse(localStorage.getItem('receivedata') || '[]');
      receivedDataArray.push(data);
      data.socketId =  window.socket.id; 
      localStorage.setItem('receivedata', JSON.stringify(receivedDataArray));
      this.badgeNumber = data.delivery_id;
      this.updateBadgeNumbers(); 
    });
    this.getstorebyid()
this.getAllorder();
if(this.apiService.orders){this.totalItems = this.filteredStores().length; }
this.updateDisplayedItems();
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
  commande:Boolean
  dataorder:any=[]
  getAllorder() {
    this.apiService.getOrderByStoreId(this.apiService.getStore()).subscribe(
      (response) => { this.apiService.orders = response;
        console.log(this.apiService.orders)
        this.apiService.orders.forEach((orderItem, index) => {
          this.orderNumber = index + 1;
          orderItem.orderNumber = index + 1;
          orderItem.lastFourDigits = orderItem._id.toString().slice(-4);
        });
      },
      error => { console.error('Error fetching orders', error); }
    );
  }
  filteredStores(): any[] {
if(this.apiService.orders){
  return this.apiService.orders.filter(store =>
    Object.values(store).some(
      field => {
        if (typeof field === 'string' || field instanceof String) { return field.toLowerCase().includes(this.searchTerm.toLowerCase());
        } else if (typeof field === 'number' && field.toString().includes(this.searchTerm)) {
          return true; }
        return false;
      } 
      ));}}
  //details
  openModal(content: any, storeId: string) {
    this.apiService.getOrderById(storeId).subscribe(
      (response) => {
        this.orderData = response;
        this.modalService.open(content, { size: 'lg' }).result.then(
          (result) => { console.log(`Modal closed with: ${result}`); },
          (reason) => {
            console.log(`Modal dismissed with: ${reason}`);
          });
      },
      (error) => {
        console.error('Error retrieving Store', error);
      }
    );
  }
  getStatusList(currentStatus: string): string[] {
    const allStatuses = ['','accepted', 'pending', 'rejected','ready','missed'];
    return allStatuses.filter(status => status !== currentStatus);}
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
  selectedStatus: string = '';
  //Update Status
  onStatusClick2(item: any): void {
    this.showStatusDropdown = !this.showStatusDropdown;
    if (item && item.id) {
      this.selectedItem = item;
      this.openStatusModal2(item.id);
    } else {
      console.error('Error: Item does not contain a valid id');}
  }
  openStatusModal2(itemId: string): void {
    const selectedItem = this.filteredStores().find(p => p._id === itemId);
    if (selectedItem) {
      this.selectedItem = selectedItem;
      this.modalRef = this.modalService.open(this.statusModalContent, { size: 'lg' });
    } else {
      console.error('Error: Item not found.');
    }
  }
  iduser:any={}
  onStatusSelection2(selectedItemId: string, selectedStatus: string): void {
    this.iduser=localStorage.getItem('user')
    if (selectedItemId) {
      this.showStatusDropdown = false;
 const data ={
  selectedItemId:selectedItemId,
  selectedStatus:selectedStatus,
  iddate:this.apiService.iddate,
 updatedBy:JSON.parse(this.iduser)._id.toString()
 }
      this.apiService.updateStatusorders(data).subscribe(
        (response) => {
          this.getAllorder();
          this.modalRef?.close();
        },
        (error) => {
          console.error('Error updating order', error);
        }
      );
    } else {
      console.error('Error: Selected item ID is undefined');
    }
  }
  //delivery
  deliveryData:any=[]
  idorderr:any
 detaildelivery(content: any, deliveryId: any,idorder:any) {
   this.apiService.getdeliverybyid(deliveryId).subscribe(
      (response) => {
        this.deliveryData = response;
        this.idorderr=idorder
        this.modalService.open(content, { size: 'lg' }).result.then(
          (result) => { },
          (reason) => { });
      }, (error) => {console.error('Error retrieving Store', error); }
    );
  }
  CancelDelivery(iddelivery: any,idorder: any){
    const isConfirmed = confirm('Are you sure you want to cancel this delivery?');
    if (isConfirmed) {
      this.apiService.CancelDelivery(iddelivery, idorder).subscribe(
        (response: any) => {
          this.getAllorder();
          this.modalService.dismissAll(); }
      );
    } else {console.log('Cancellation canceled'); }
  }
///////Crerr delivery
errorMessage: any
errordevice: string
afficherbutton = false
devis: any = []
numero: any
creation = false
storeid: any
delivery(content: any,id: any) {
  this.numero=id
  this.creation = true;
  this.apiService.Creerdevis(id).subscribe(
    (response) => {
      this.devis = response;
      this.getorderbyid(this.numero)
      this.modalService.open(content, { size: 'lg' }).result.then(
        (result) => { },
        (reason) => {        });
    },
    (error) => {
      console.error('Erreur lors de la création du devis :', error);
      this.toastService.show('Error occurred while creating the quote', { classname: 'bg-danger text-light' });
    }
  );
}
orders: any = [];
getorderbyid(numero:any) {
  this.apiService.getOrderById(numero).subscribe(
    (response) => {
      this.orders = response;
      this.apiService.getStroreById(this.orders.storeId).subscribe(
        (response) => {this.stores = response;
        }, (error) => { console.error('Error retrieving Store', error); }
      );
      this.addDelivery();
    },
    (error) => { console.error(error); });
}
ProductArray: any = []
async addDelivery() {
  let productArray = [];
  const items = this.orders.items || [];
  const promoItems = this.orders.promo.reduce((acc, curr) => acc.concat(curr.items), []);
  for (let i = 0; i < items.length; i++) {
    const obj = {
      must_be_upright: true,
      size: items[i].size === "S" ? "small" : items[i].size === "M" ? "medium" : "large",
      name: items[i].name,
      quantity: items[i].quantity
    };
    productArray.push(obj);
  }
  for (let j = 0; j < promoItems.length; j++) {
    const obj = {
      must_be_upright: true,
      size: promoItems[j].size === "S" ? "small" : promoItems[j].size === "M" ? "medium" : "large",
      name: promoItems[j].name,
      quantity: promoItems[j].quantity
    };
    productArray.push(obj);
  }
  this.ProductArray = productArray
}
stores: any = []
joinRoom(roomName: string): void {
  window.socket.emit('join_room', roomName);
}
adddelivery() {
  const createdelivery = {
    external_store_id: this.orders.storeId,
    quote_id: this.devis.uberDirectData.id,
    pickup_name: this.stores.name,
    pickup_address: this.orders.restaurantAdress,
    pickup_phone_number: this.stores.phoneNumber,
    dropoff_name: this.orders.client_first_name,
    dropoff_address: this.orders.deliveryAdress,
    dropoff_phone_number: this.orders.client_phone,
    manifest_items: this.ProductArray,
    test_specifications: {
      robo_courier_specification: {
        mode: "auto",
      }
    }
  }
  this.apiService.Creerdelivery(this.numero, createdelivery).subscribe(
    (response:any) => {
      this.joinRoom(response.updatedOrder.uberId)
      this.devis = response;
      this.toastService.show('Delivery created successfully ', { classname: 'bg-success text-light' });
      this.modalService.dismissAll();
      this.getAllorder()
            this.ProductArray=[]
    },
    (error) => {
      this.toastService.show('Error occurred during the creation of the delivery', { classname: 'bg-danger text-light' });
    }
  );
}
//trie
sortDirection: string = 'asc'; 
sortedColumn: string = ''; 
sortordersByTotalSpent() {
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.sortedColumn = 'price_total';
 
  this.apiService.orders.sort((a, b) => {
    if (this.sortDirection === 'asc') {
      return a.price_total - b.price_total;
    } else {
      return b.price_total - a.price_total;
    }
  });

}
//deletedelivery
deleteorder(id:any){
  const isConfirmed = confirm('Are you sure you want to delete this order?');
  if (isConfirmed) {
    this.apiService.deleteorders(id).subscribe(
      (response: any) => {  this.getAllorder() 
        this.toastService.show('Orders deleted successfully.', { classname: 'bg-success text-light' });
      },
      (error: any) => { console.error('Error deleting order:', error);}
    );} else {  console.log('Deletion canceled'); } 

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
      },
      error => {
        this.toastService.show('Error deleting selected orders.', { classname: 'bg-danger text-light' });
        console.error('Error deleting selected orders:', error);
      }
    );
      this.selectedOrders = {};
}else {  console.log('Deletion canceled'); } 
}
//verifieruber
deliveryuber:Boolean
automaticuber:Boolean
getstorebyid(){
  this.apiService.getStroreById(this.apiService.getStore()).subscribe(
    (data) => {this.deliveryuber=data.uberDirect;
      const options = data.organizations[0].options;
      const automaticOption = options.find(option => option.name === 'Automatic');
      this.automaticuber = automaticOption ? automaticOption.checked : false;
      console.log('Automatic is', this.automaticuber ? 'true' : 'false');
        }, error => { console.error('Error deleting selected orders:', error); }
  );
}
}
