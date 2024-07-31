import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { Category } from 'src/app/models/category';
import { OptionGroup } from 'src/app/models/optionGroupe';
import { Product } from 'src/app/models/product';
import { Store } from 'src/app/models/store';
import { ApiServices } from 'src/app/services/api';
import * as L from 'leaflet';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/toast-service';

@Component({
  selector: 'app-allstore',
  templateUrl: './allstore.component.html',
  styleUrls: ['./allstore.component.scss']
})
export class AllstoreComponent implements OnInit {
  categorys: Category[] = [];
  store: any[] = [];
user: any;
map: L.Map;
searchTerm: string = '';
currenyData:any=[];
items: any[] = [];
totalItems: number;
currentPage: number = 0;
itemsPerPage: number = 5;
displayedItems: Store[] = [];
p: number = 1;
itemsPerPageOptions: number[] = [5, 10, 20];
selectedItemsPerPage: number = 15;
orderNumber:any;
searchTermControl = new FormControl();
searchForm: FormGroup;
Userrole:any
constructor(private modalService: NgbModal, private http: HttpClient,private authService: ApiServices,private route:Router,private toastService:ToastService) {
  this.searchForm = new FormGroup({
    searchTerm: new FormControl(''),
  });
}
ngOnInit(): void {
this.Userrole=localStorage.getItem('role');
console.log(this.Userrole)
  this.user = this.authService.getUser();
  if (this.user?.hasOwnProperty('_id')) {
    this.getAllstore();
    this.totalItems = this.filteredStores().length;
    this.updateDisplayedItems();
  }
}
isManagerRole(): boolean {
  // Vérifie si le rôle de l'utilisateur est 'manager'
  return this.Userrole === 'manager';
}
updateDisplayedItems() {
  const startIndex = this.currentPage * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedItems = this.filteredStores().slice(startIndex, endIndex);
}
pageChanged(event: PageEvent) {
  this.currentPage = event.pageIndex;
  this.updateDisplayedItems();
}
getAllstore() {
  this.authService.getStoresOwner(this.user._id).subscribe(
    (response) => {
      this.store = response[0].reverse();
      console.log( this.store )
      const totalItems = this.store.length;
    // Mettez à jour le numéro d'ordre pour chaque élément dans la liste inversée
    this.store.forEach((orderItem, index) => {
      orderItem.orderNumber = totalItems - index;
    });
      this.selectedItemsPerPage = 15;
      this.p = 1;
    },
    error => {})
}
// confirmation(storeid:any) {
//   let msg = prompt("Please enter code",);
//   if (msg === "0000") {this.deletteStore(storeid) }
// }
deletteStore(storeid: any) {
  this.authService.getStoresOwner(this.user._id).subscribe(
    (response: any) => {
      console.log("response",response)
      if (response[0].length <= 1) {
        this.toastService.show('You must have at least one store.', { classname: 'bg-warning text-light' });
        return;
      }

      const isConfirmed = confirm('Are you sure you want to delete this Store?');
      if (isConfirmed) {
        this.authService.deleteStores(storeid).subscribe(
          (response: any) => {
            this.getAllstore();
            this.toastService.show('The store has been successfully deleted', { classname: 'bg-success text-light' });

            this.authService.deletemenu(storeid).subscribe(
              (response: any) => { },
              (error: any) => {
                console.error('Error deleting menu:', error);
              }
            );
          },
          (error: any) => {
            this.toastService.show('Error deleting store', { classname: 'bg-danger text-light' });
            console.error('Error deleting stores:', error);
          }
        );
      } else {
        console.log('Deletion canceled');
      }
    },
    (error: any) => {
      console.error('Error fetching stores:', error);
      this.toastService.show('Error fetching stores', { classname: 'bg-danger text-light' });
    }
  );
}

getStatusStyle(status: string): { [key: string]: string } {
switch (status) {
  case 'active':
    return { 'background-color': '#28A745', 'color': '#fff' };
  case 'pending':
    return { 'background-color': '#FFC107', 'color': '#000' };
  case 'rejected':
  case 'suspended':
    return { 'background-color': '#DC3545', 'color': '#fff' };
  default:
    return {};
}
}
ajouter() {this.route.navigateByUrl(`store/addstore`);}
modifier(id:any){this.route.navigateByUrl("/store/editstore/"+id)}
filteredStores(): any[] {
  // Vérifier si this.store est défini et qu'il contient des valeurs
  if (!this.store || this.store.length === 0) {
    return []; // Retourner un tableau vide si this.store est null, undefined ou vide
  }

  return this.store.filter(store =>
    Object.values(store).some(
      field => {
        if (typeof field === 'string' || field instanceof String) {
          return field.toLowerCase().includes(this.searchTerm.toLowerCase());
        } else if (typeof field === 'number' && field.toString().includes(this.searchTerm)) {
          return true;
        }
        return false;
      }
    )
  );
}

//details

openModal(content: any, storeId: string) {
this.authService.getStroreById(storeId).subscribe(
  (response) => {
    this.currenyData = response;
    
    this.modalService.open(content, { size: 'lg' }).result.then(
      (result) => {
        //console.log(`Modal closed with: ${result}`);
       },
      (reason) => {
        //console.log(`Modal dismissed with: ${reason}`);
      });
    if (this.currenyData && typeof this.currenyData.latitude === 'number' && typeof this.currenyData.longitude === 'number') {
      this.initializeMap(this.currenyData.latitude, this.currenyData.longitude);
    } else {console.error('Latitude and longitude coordinates are not available in currenyData.');}
  }, (error) => {console.error('Error retrieving Store', error); }
);
}
private initializeMap(latitude: number, longitude: number): void {
const map = L.map('map-modal').setView([latitude, longitude], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.marker([this.currenyData.latitude, this.currenyData.longitude]).addTo(map)
  .bindPopup('Store Location')
  .openPopup();
}
get paginatedItems() {
const startIndex = (this.currentPage - 1) * this.itemsPerPage;
const endIndex = startIndex + this.itemsPerPage;
return this.items.slice(startIndex, endIndex);
}
UpdateopenStores(_id:any,active:any) {
const open={_id,active}
this.authService.updateopenStore(open).subscribe(
  (response) => { },
  (error) => { console.error('Error updating Stores', error); }
);
}
switchUber(storeId: string): void {
  this.authService.switchUber(storeId).subscribe(
    (response) => {
      console.log('Store properties switched successfully', response);
    },
    (error) => {
      console.error('Error switching store properties', error);
    }
  );
}
switchPaiement(storeId: string): void {
  this.authService.switchPaiement(storeId).subscribe(
    (response) => {
      console.log('Store properties switched successfully', response);
    },
    (error) => {
      console.error('Error switching store properties', error);
    }
  );
}

switchmodeUber(storeId: string): void {
  this.authService.switchmodeUber(storeId).subscribe(
    (response) => {
      this.toastService.show('Store properties switched successfully mode', { classname: 'bg-success text-light' });
      console.log('Store properties switched successfully mode', response);
    },
    (error) => {
      this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });
      console.error('Error switching store properties', error);
    }
  );
}
// switchguestmode(storeId: string): void {
//   this.authService.switchguestmode(storeId).subscribe(
//     (response) => {
//       this.toastService.show('Store properties switched successfully ', { classname: 'bg-success text-light' });
//       // console.log('Store properties switched successfully ', response);
//     },
//     (error) => {
//       this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });
//       console.error('Error switching store properties', error);
//     }
//   );
// }


}