import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from 'src/app/toast-service';

@Component({
  selector: 'app-allmanager',
  templateUrl: './allmanager.component.html',
  styleUrls: ['./allmanager.component.scss']
})
export class AllmanagerComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;
  company: any;
  manager: any;
  selectedItemsPerPage: number;
  p: number;
  searchTerm: string = '';
  ownerId: any;
  totalItems: number;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  displayedItems: any[] = [];
  selectedStores: any;
  Userrole:any;
  constructor(private modalService: NgbModal, private http: HttpClient,private authService: ApiServices,private route:Router,private toastService:ToastService) {
  }
  ngOnInit(): void {
    this.Userrole=localStorage.getItem('role');

    const user = this.authService.getUser();
    if (user !== null) {
      this.ownerId=user._id;
         this.company=user.company
    } else {  console.log("error"); }
  this.getAllManager()
  this.get()
  this.totalItems = this.filterManagers().length;
  this.updateDisplayedItems();
  }
  isManagerRole(): boolean {
    // Vérifie si le rôle de l'utilisateur est 'manager'
    return this.Userrole === 'manager';
  }
  ajouter() {this.route.navigateByUrl(`store/addmanager`);}
  nomanagerFound: boolean = false;
  getAllManager() {
    this.authService.getmanagerbycompany(this.company).subscribe(
      (response) => {
        this.manager = response.reverse();
        const totalItems = this.manager.length;
        this.manager.forEach((orderItem, index) => {
          orderItem.orderNumber = totalItems - index;
          // Récupérer les noms des magasins associés à chaque manager
          orderItem.companyNames = [];
          orderItem.stores.forEach(storeId => {
            this.authService.getStroreById(storeId).subscribe((responsestores) => {
              orderItem.companyNames.push(responsestores.name);
            });
          });
        });
        this.selectedItemsPerPage = 15;
        this.p = 1;
        if (this.manager.length === 0) {
      // this.nomanagerFound = true;
      this.toastService.show('Manager non trouvé', { classname: 'bg-danger text-light' });
    } else {
        //  this.nomanagerFound = false;
        }
      },
      error => { }
    );
  }
  filterManagers() {
  if (!this.manager) { return [];}
  const filteredManagers = this.manager.filter(manager =>
    (manager.firstName && manager.firstName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
    (manager.lastName && manager.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
    (manager.firstName && manager.lastName && (manager.firstName + ' ' + manager.lastName).toLowerCase().includes(this.searchTerm.toLowerCase())) ||
    (manager.email && manager.email.toLowerCase().includes(this.searchTerm.toLowerCase()))||
    (manager.phoneNumber && manager.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
    (manager.status && manager.status.toLowerCase().includes(this.searchTerm.toLowerCase()))||
    (manager.companyName && manager.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()))
  );
  this.totalItems = filteredManagers.length;
  return filteredManagers;
  }
  updateDisplayedItems() {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedItems = this.filterManagers().slice(startIndex, endIndex);
  }
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.updateDisplayedItems();
  }
 
  deletemanager(managerid: any) {
    const isConfirmed = confirm('Are you sure you want to delete this Manager?');
    if (isConfirmed) {
      this.authService.deletemanager(managerid).subscribe(
        (response: any) => { this.getAllManager();
        }
      ); } else {  console.log('Deletion canceled'); } }
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
      selectedmanager: any;
      openDetailsModal(coupon: any) {
        const modalRef: NgbModalRef = this.modalService.open(this.modalContent, { size: 'lg' });
        this.selectedmanager = coupon; }
      //editMANAGER
      store: any=[];
      get(){
        this.authService.getStoresOwner(this.ownerId).subscribe(
          (response) => {this.allStores = response[0];},
          error => {  } ) }
      manageredit:any={}
      companyName:any
      openModal2(content: any, managerId: string) {
        this.phoneNumber = null;
        this.authService.getmanagerbyid(managerId).subscribe(
            (response) => {
                this.manageredit = response;
                this.selectedStores = [...this.manageredit.stores];
                this.get();
                this.modalService.open(content, { size: 'lg' }).result.then(
                    (result) => {},
                    (reason) => {}
                );
            },
            (error) => {
                console.error('Error loading Manager data:', error);
            }
        );
    }
    allStores: any[] = [];
    toggleSelection(storeId: string) {
        if (this.selectedStores.includes(storeId)) {
            this.selectedStores = this.selectedStores.filter(id => id !== storeId);
        } else {this.selectedStores.push(storeId);}
    }
    updateSelectedStore(storeId: string) {
      const selectedStore = this.allStores.find(store => store._id === storeId);
      if (selectedStore) {this.companyName = selectedStore.name;        }}
        image: File | null = null;
        images:any
        openImageSelector(): void {
          const fileInput = document.getElementById('fileInput');
          if (fileInput) { fileInput.click(); }
        }
        onImageChange(event: any, managerId: string): void {
          const files: File = event.target.files[0];
          this.images = files;
          this.authService.updateimagemanager(managerId, this.images).subscribe(
            (response) => {
              if (response && response.user && response.user.image) {
                this.manageredit.image = response.user.image;
                this.getImageSrc(); }
            },
            (error) => {  console.error("Error updating image:", error);}
          ); }
        getImageSrc(): string {
          if (this.manageredit.image) { return 'http://localhost:8000/' + this.manageredit.image;
          } else {  return 'URL_PAR_DEFAUT';   }
        }
          isHovered: boolean = false;
          showOverlay(): void { this.isHovered = true;}
          hideOverlay(): void {this.isHovered = false;}
          phoneNumber:any
          password:any
          erroremail=false
          messageerror:any;
          errorMessage:any;
          updateManager(idmanager: any) {
            // Vérifier si au moins un magasin est sélectionné
            if (this.selectedStores.length === 0) {
              // Afficher un message d'erreur
              this.errorMessage = "Please select at least one store.";
              return; // Arrêter l'exécution de la fonction
            }
          
            // Mise à jour du gestionnaire avec les magasins sélectionnés
            this.manageredit.stores = this.selectedStores;
          
            // Vérifier et préparer le numéro de téléphone
            if (this.phoneNumber == null) {
              this.manageredit.phoneNumber = this.manageredit.phoneNumber;
            } else {
              this.manageredit.phoneNumber = this.phoneNumber.internationalNumber;
            }
          
            // Appel du service pour mettre à jour le gestionnaire
            this.authService.updateManager(idmanager, this.manageredit).subscribe(
              (response) => {
                this.getAllManager();
                // Fermer la modal lors de la mise à jour réussie
                this.modalService.dismissAll('Update Success');
              },
              (error) => {
                console.error("Error updating user:", error);
                if (error && error.error && error.error.error === 'Email already exists.') {
                  this.errorMessage = "Email already exists. Please choose a different email.";
                  setTimeout(() => {
                    this.errorMessage = ''; // Effacer le message d'erreur après un certain temps
                  }, 2000);
                } else {
                  console.error('Error updating Manager', error);
                }
              }
            );
          }
          
}
