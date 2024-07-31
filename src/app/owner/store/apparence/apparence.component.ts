import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-apparence',
  templateUrl: './apparence.component.html',
  styleUrls: ['./apparence.component.scss']
})
export class ApparenceComponent implements OnInit {
  baseUrl = 'http://localhost:8000/'
  categorys: Category[] = [];
    store: any[] = []; // Assurez-vous que vous avez initialisé votre tableau store
 
  user: any;
  map: L.Map;

  searchTerm: string = ''; // Ajoutez cette propriété pour stocker le terme de recherche
  currenyData:any=[];


  items: any[] = []; // Your array of items to display
  totalItems: number;
  currentPage: number = 0;  // Initialiser la page actuelle à 0
  itemsPerPage: number = 5;
  displayedItems: Store[] = [];

  p: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 20];
  selectedItemsPerPage: number = 10; // ou la valeur par défaut que vous souhaitez utiliser
  orderNumber:any;
  constructor(private modalService: NgbModal, private http: HttpClient,private authService: ApiServices,private route:Router) { 
  }

  ngOnInit(): void {
    this.user = this.authService.getUser()
this.getAllstore();
this.totalItems = this.filteredStores().length;  // Call the function
this.updateDisplayedItems();
   
   
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

        this.store = response[0];

          console.log(this.store);
              // Iterate through each order and add an order number
        this.store.forEach((orderItem, index) => {
          // Add 1 to the index to start the order number from 1
          this.orderNumber = index + 1;
          orderItem.orderNumber = index + 1;
  
          // Log the order with the order number
         // console.log(`Order ${this.orderNumber}:`, orderItem);
        });

      },
      error => {
      
      }


    )
  }
  deletteStore(storeid:any) {
    console.log("id",storeid)
      this.authService.deleteStores(storeid).subscribe(
        (response: any) => {
          this.getAllstore()
        //console.log(response)
        },
        (error: any) => {
          console.error('Error deleting stores:', error);
          // Handle error
        }
      );
    
  }

  // Dans votre composant TypeScript
getStatusStyle(status: string): { [key: string]: string } {
  switch (status) {
    case 'active':
      return { 'background-color': '#28a745', 'color': '#fff' };
    case 'pending':
      return { 'background-color': '#ffc107', 'color': '#000' };
    case 'rejected':
    case 'suspended':
      return { 'background-color': '#dc3545', 'color': '#fff' };
    default:
      return {}; // Aucun style par défaut si l'état n'est pas reconnu
  }
}
ajouter() {

  this.route.navigateByUrl(`banner/addStore`);
}

modifier(id:any){
  console.log(id)
this.route.navigateByUrl("/banner/editStore/"+id)
}
filteredStores(): any[] {
  // Utilisez la méthode filter pour filtrer la liste en fonction du terme de recherche
  return this.store.filter(store =>
    Object.values(store).some(
      field => {
        if (typeof field === 'string' || field instanceof String) {
          return field.toLowerCase().includes(this.searchTerm.toLowerCase());
        } else if (typeof field === 'number' && field.toString().includes(this.searchTerm)) {
          return true; // Inclure le champ numérique dans la recherche
        }
        return false;
      }
    )
  );
  
}

//details
openModal(content: any, storeId: string) {
  // Appel à votre service ou API pour récupérer les détails par ID
  this.authService.getStroreById(storeId).subscribe(
    (response) => {
      console.log('Store successfully retrieved', response);
      this.currenyData = response;

      // Ouvrir le modal après avoir récupéré les données
      this.modalService.open(content, { size: 'lg' }).result.then(
        (result) => {
          // Traitement à effectuer après la fermeture du modal
          console.log(`Modal closed with: ${result}`);
        },
        (reason) => {
          // Traitement à effectuer si le modal est fermé avec le bouton de fermeture ou en dehors du modal
          console.log(`Modal dismissed with: ${reason}`);
        }
      );

      // Initialiser la carte après l'ouverture du modal
      if (this.currenyData && typeof this.currenyData.latitude === 'number' && typeof this.currenyData.longitude === 'number') {
        this.initializeMap(this.currenyData.latitude, this.currenyData.longitude);
        //this.updateCoordinatesDisplay();
      } else {
        console.error('Latitude and longitude coordinates are not available in currenyData.');
      }
    },
    (error) => {
      console.error('Error retrieving Store', error);
    }
  );
}

private initializeMap(latitude: number, longitude: number): void {
  const map = L.map('map-modal').setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Ajoutez un marqueur à la position actuelle
  L.marker([this.currenyData.latitude, this.currenyData.longitude]).addTo(map)
    .bindPopup('Store Location')
    .openPopup();
}

get paginatedItems() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.items.slice(startIndex, endIndex);
}

}




