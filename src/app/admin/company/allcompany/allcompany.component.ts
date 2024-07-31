import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiServices } from 'src/app/services/api';
import { forkJoin, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { latLng, LeafletMouseEvent, MapOptions, tileLayer } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import 'leaflet-control-geocoder';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allcompany',
  templateUrl: './allcompany.component.html',
  styleUrls: ['./allcompany.component.scss']
})
export class AllcompanyComponent implements OnInit {
  @ViewChild('modalContent2') modalContent2: TemplateRef<any>;
  @ViewChild('modalContent') modalContent: any;
  searchTerm: string = '';
  company: any[] = [];
  selectedItemsPerPage: number;
  p: number;
  pageSize: number = 8;
  currentPage = 1;
  constructor(private apiService: ApiServices, private route: Router, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.getAllcompany();
    this.totalItems = this.filterCompany().length;
    this.filterCompany()
    this.currenyData = {
      companyId: '',
      ownerId: '',
      name: "",
      description: "",
      address: "",
      phoneNumber: "",
      latitude: "",
      longitude: "",
      rangeValue: 7,
      secondairecolor: "",
      primairecolor: "",
      image: "",
      uberOrganizationStoreId: ""
    }
  }
  store: any[] = [];
  noStoresFound: boolean = false;
  companyid: any;
  getStoresByCompany(companyId: any) {
    this.apiService.getstorebycompany(companyId).subscribe(
      (response) => {
        this.companyid = companyId;
        this.store = response.stores.reverse();
        if (this.store.length === 0) { this.noStoresFound = true;} else {this.noStoresFound = false;}
      },
      error => { console.error(error); }
    );
  }
  openModalAndFetchStores(content: any, companyId: any) {
    this.getStoresByCompany(companyId);
    this.modalService.open(content, { size: 'lg' }).result.then(
      (result) => { },
      (reason) => { console.log(`Modal dismissed with: ${reason}`); }
    );
  }
  getAllcompany() {
    this.apiService.getallcompany().subscribe(
      (response) => {
        this.company = response.reverse();
        const totalItems = this.company.length;
        this.company.forEach((orderItem, index) => {
          orderItem.orderNumber = totalItems - index;
        });
        this.selectedItemsPerPage = 15;
        this.p = 1;
      }, error => { })
  }
  //filter
  totalItems: number;
  itemsPerPage: number = 5;
  displayedItems: any[] = [];
  filterCompany() {
    if (!this.company) { return []; }
    const filteredCompanies = this.company.filter(company =>
      (company.name && company.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.totalItems = filteredCompanies.length;
    return filteredCompanies;
  }
  updateDisplayedItems() {
    const startIndex = (this.p - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedItems = this.filterCompany().slice(startIndex, endIndex);
  }
  pageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.updateDisplayedItems();
  }
  ajouter() { this.route.navigateByUrl(`company/addcompany`); }
  deletecompany(companyid: any) {
    const isConfirmed = confirm('Are you sure you want to delete this Company?');
    if (isConfirmed) {
      this.apiService.deletecompany(companyid).subscribe(
        (response: any) => { this.getAllcompany(); }
      );
    } else { console.log('Deletion canceled'); }
  }
  selectedcompany: any;
  owner: any
  openDetailsModal(content: any, companyId: string) {
    this.apiService.getcompanybyid(companyId).subscribe(
      (companyResponse) => {
        this.selectedcompany = companyResponse;
        const idOwners = this.selectedcompany.owners;
        forkJoin({
          company: of(companyResponse),
          owner: this.apiService.getmanagerbyid(idOwners)
        }).subscribe(
          ({ company, owner }) => {
            this.selectedcompany = company;
            this.owner = owner;
            this.modalService.open(content, { size: 'lg' }).result.then(
              (result) => { },
              (reason) => { console.log(`Modal dismissed with: ${reason}`); }
            );
          },
          (error) => { console.error(error); }
        );
      }, (error) => { console.error(error); }
    );
  }

  selectedcompanys: any = []
  openModal2(content: any, companyId: string) {
    this.apiService.getcompanybyid(companyId).subscribe(
      (companyResponse) => {
        this.selectedcompanys = companyResponse;
        const idOwners = this.selectedcompanys.owners;
        forkJoin({
          company: of(companyResponse),
          owner: this.apiService.getmanagerbyid(idOwners)
        }).subscribe(
          ({ company, owner }) => {
            this.selectedcompanys = company;
            this.owner = owner;
            this.modalService.open(content, { size: 'lg' }).result.then(
              (result) => { },
              (reason) => { console.log(`Modal dismissed with: ${reason}`); }
            );
          },
          (error) => { console.error(error); }
        );
        this.apiService.getowners().subscribe(
          (response: any) => {
            this.owners = response.owners.filter((owner: any) => {
              return !idOwners.includes(owner._id);
            });
          },
          (error: any) => { console.error(error); }
        );
      }, (error) => { console.error(error); }
    );
  }
  owners: any = [];
  image: File | null = null;
  onImageChange(event: any): void { const files: File = event.target.files[0]; this.selectedcompanys.CompanyLogo = files; }
  messageErrors: { [key: string]: string } = {};
  messageerror: string = "";
  phone: any = {}
  // Dans le composant
  updatecompany(companyId: any) {
    if (this.phone === null) {
      this.selectedcompanys.phone_details = this.selectedcompanys.phone_details;
    } else {
      this.selectedcompanys.phone_details = {
        country_code: this.phone.dialCode,
        phone_number: this.phone.number
      };
    }
    const formData = new FormData();
    formData.append("ownerId", this.selectedcompanys.owners);
    formData.append("name", this.selectedcompanys.name);
    formData.append("address", JSON.stringify(this.selectedcompanys.address));
    formData.append("phone_details", JSON.stringify(this.selectedcompanys.phone_details));
    formData.append("duns", this.selectedcompanys.duns);
    formData.append("email", this.selectedcompanys.email);
    formData.append("website", this.selectedcompanys.website);
    formData.append("legalstatus", this.selectedcompanys.legalstatus);
    if (this.selectedcompanys.CompanyLogo) {
      formData.append("image", this.selectedcompanys.CompanyLogo);
    }
    this.apiService.updateCompany(companyId, formData).subscribe(
      (response) => {
        this.modalService.dismissAll('Update Success');
        this.getAllcompany()
      },
      (error) => {
        console.error('Error updating Company', error);
      }
    );
  }
  countries: string[] =
    ["1. Sole Proprietorship",
      "2. Partnership",
      "3. Limited Partnership (LP)",
      "4. Limited Liability Partnership (LLP)",
      "5. Corporation",
      "6. Limited Liability Company (LLC)",
      "7. Cooperative",
      "8. Nonprofit Organization",
      "9. Trust",
      "10. Joint Venture",
      "11. Franchise",
      "12. Public Limited Company (PLC)",
      "13. Private Limited Company (Ltd)",
      "14. Sole Trader",
      "15. Social Enterprise",
      "16. Community Interest Company (CIC)",
      "17. Professional Corporation",
      "18. B-Corporation (B-Corp)",
      "19. Holding Company",
      "20. State-Owned Enterprise (SOE)",
      "21. Mutual Company",
      "22. Not-for-Profit Corporation",
      "23. Foundation",
      "24. Society",
      "25. Special Purpose Vehicle (SPV)",
      "26. General Partnership",
      "27. Silent Partnership",
      "28. Cooperative Corporation",
      "29. Private Unlimited Company",
      "30. Family Limited Partnership (FLP)",
      "31. Professional Limited Liability Company (PLLC)",
      "32. S Corporation",
      "33. Public-Private Partnership (PPP)",
      "34. Community Benefit Society",
      "35. Investment Company",
      "36. Municipal Corporation",
      "37. Public Corporation",
      "38. State-Owned Corporation",
      "39. Employee Stock Ownership Plan (ESOP)",
      "40. Statutory Corporation",
      "41. Simplified Joint Stock Company (SAS)",
      "42. Public Limited Company (SA)",
      "43. General Partnership (SNC)",
      "44. Limited Partnership by Shares (SCA)",
      "45. Limited Liability Company (SARL)",
      "46. Partnership Limited by Shares (SEP)",
      "47. Cooperative Society of Production (SCOP)",
      "48. Civil Society (SC)",
      "49. Professional Services Company (SEL)",
      "50. Variable Capital Investment Company (SICAV)",
      "51. Partnership Limited by Shares (SCA)",
      "52. Financial Company for Professional Liberale (SPFPL)",
      "53. Listed Real Estate Investment Company (SIIC)",
      "54. Variable Capital Investment Company (SICAF)",
      "55. Cooperative Society of Collective Interest (SCIC)",
      "56. Free Partnership (SLP)",
      "57. Special Limited Partnership (SCSp)",
      "58. Simplified Joint Stock Company with a Sole Shareholder (SASU)",
      "59. Simplified Single-Person Limited Liability Company (SASU)",
      "60. Single-Person Limited Liability Company (SARLU)",
      "61. Worker Participation Company (SAPO)",
      "62. Real Estate Investment Company with Variable Capital (SICAV immobilière)",
      "63. Agricultural Grouping for Joint Exploitation (GAEC)",
      "64. Agricultural Land Grouping (GFA)",
      "65. Agricultural Land Company (GAF)",
      "66. Economic Interest Group (GIE)",
      "67. Association under the 1901 Law",
      "68. Single-Person Limited Liability Company (EURL)"];
//Stores
confirmation(storeid: any, companyID: any) {
  let msg = prompt("Please enter code",);
  if (msg === "0000") {
    this.deletteStore(storeid, companyID);
  }
}
deletteStore(storeid: any, companyID: any) {
  const isConfirmed = confirm('Are you sure you want to delete this Store?');
  if (isConfirmed) {
    this.apiService.deleteStores(storeid).subscribe(
      (response: any) => {
        this.apiService.deletemenu(storeid).subscribe(
          (response: any) => { },
          (error: any) => { console.error('Error deleting menu:', error); }
        );
        this.getStoresByCompany(companyID)
      },
      (error: any) => {
        console.error('Error deleting stores:', error);
      }
    );
  } else {
    console.log('Deletion canceled');
  }
}
//AddStore
// Déclarez la variable showAddStoreContent
showAddStoreContent: boolean = false;
addcompany: any
companyOwner: any
uberid: any
// Modifiez la méthode openaddstore
openaddstore(companyid: any) {
this.currenyData = {
  companyId: '',
  ownerId: '',
  name: "",
  description: "",
  address: "",
  phoneNumber: "",
  latitude: "",
  longitude: "",
  rangeValue: 7,
  secondairecolor: "",
  primairecolor: "",
  image: "",
  uberOrganizationStoreId: ""
}
this.showAddStoreContent = true;
this.addcompany = companyid;
console.log(this.addcompany)
this.apiService.getcompanybyid(companyid).subscribe(
  (companyResponse: any) => {
    this.companyOwner = companyResponse.owners;
    this.uberid = companyResponse.uberOrganizationId
    console.log("uberid", this.uberid);
    // Déplacez l'initialisation de la carte ici
    if (this.showAddStoreContent) {
      this.initializeMap();
    }
  }
);
}
/* addcompany: any
companyOwner: any
uberid: any
openaddstore(content: any, company: any) {
  this.addcompany = company;
  this.apiService.getcompanybyid(company).subscribe(
    (companyResponse: any) => {
      this.companyOwner = companyResponse.owners;
      this.uberid = companyResponse.uberOrganizationId
      console.log("uberid", this.uberid)
    }
  );
  // Ouverture du modal une fois que les données sont récupérées
  this.modalService.open(content, { centered: true }).result.then(
    (result) => { this.initializeMap(); },
    (reason) => { console.log(`Modal dismissed with: ${reason}`); }
  );
  // Initialisation de la carte
  this.initializeMap();
}
*/
consumationData = {
  name: '',
  description: '',
  frais: null,
  taux: null,
  applyTaux: false,
  applicationType: '',
  storeId: '',
  reduction: ''
};
menu = {
  name: '',
  store: '',
  currency: '',
  description: '',
};
errorMessage: string;
ownerId: any;
primairecolor = '';
secondairecolor = '';
description = '';
name = '';
longitude: any
address: any;
phoneNumber: any;
latitude: any;
Data = new FormData();
currenyData: any = {}
map: L.Map;
rangeValue: number = 7;
successMessage: string = '';
private currentMarker: L.Marker | null = null;
private initializeMap(): void {
  const map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.on('click', (e: LeafletMouseEvent) => {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    if (this.currentMarker) { map.removeLayer(this.currentMarker); }
    const countryName = '';
    const popupContent = this.createPopupContent(countryName);
    const customMarkerIcon = L.icon({
      iconUrl: 'assets/images/marker-icon-2x-blue.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    this.currentMarker = L.marker([this.latitude, this.longitude], { icon: customMarkerIcon })
      .bindPopup(popupContent)
      .addTo(map)
      .openPopup();
    this.updateCoordinatesDisplay();
    this.getCoordinatesFromAddress();
  });
}
private createPopupContent(countryName: string): string {
  return `<strong>${countryName}</strong><br>` +
    `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
}
updateCoordinatesDisplay(): void {
  this.currenyData.latitude = this.latitude;
  this.currenyData.longitude = this.longitude;
  // Clear error messages for latitude and longitude
  this.clearError('latitude');
  this.clearError('longitude');
}
addmenu(name, store, currency, description) {
  this.menu.name = name,
    this.menu.store = store,
    this.menu.currency = currency,
    this.menu.description = description,
    this.apiService.addmenu(this.menu)
      .subscribe(
        response => { },
        error => { console.error('Erreur lors de l\'ajout menu :', error); }
      );
}
addStores() {
  if (!this.currenyData.phoneNumber || !this.currenyData.phoneNumber.number ||
    !this.currenyData.phoneNumber.internationalNumber) {
    this.messageErrors['phoneNumber'] = 'Please enter a valid phone number';
    setTimeout(() => { this.messageErrors['phoneNumber'] = ''; }, 2000);
    return;
  }
  const requiredFields = {
    name: "Name",
    description: "Description",
    address: "Address",
    phoneNumber: "Phone Number",
    latitude: "Latitude",
    longitude: "Longitude",
    rangeValue: "Range Value"
  };
  this.messageErrors = {};
  for (const field in requiredFields) {
    if (!this.currenyData[field]) { this.messageErrors[field] = `Please fill in the ${requiredFields[field]} field`; }
  }
  if (!this.currenyData.latitude) { this.messageErrors['latitude'] = 'Please select a location on the map'; }
  if (!this.currenyData.longitude) { this.messageErrors['longitude'] = 'Please select a location on the map'; }
  const errorFields = Object.keys(this.messageErrors);
  if (errorFields.length > 0) {
    this.messageerror = `Please fill in the following fields: ${errorFields.map(field => requiredFields[field]).join(', ')}`;
    setTimeout(() => { this.messageerror = ""; }, 2000);
  } else {
    if (!this.currenyData.primairecolor) { this.currenyData.primairecolor = "#000000"; }
    if (!this.currenyData.secondairecolor) { this.currenyData.secondairecolor = "#000000"; }
    const formData = new FormData();
    const phone = this.currenyData.phoneNumber.internationalNumber;
    formData.append("ownerId", this.companyOwner);
    formData.append("companyId", this.addcompany);
    formData.append("uberOrganizationStoreId", this.uberid);
    formData.append("name", this.currenyData.name);
    formData.append("description", this.currenyData.description);
    formData.append("address", this.currenyData.address);
    formData.append("phoneNumber", phone);
    formData.append("latitude", this.currenyData.latitude);
    formData.append("longitude", this.currenyData.longitude);
    formData.append("primairecolor", this.currenyData.primairecolor);
    formData.append("secondairecolor", this.currenyData.secondairecolor);
    formData.append("rangeValue", this.currenyData.rangeValue.toString());
    formData.append("image", this.image);
    this.apiService.addStores(formData).subscribe(
      (response) => {
        this.addConsumationMode("Delivery", "Mode Livraison", 0, 0, false, "product", 0, response.store._id);
        this.addConsumationMode("Takeaway", "Mode emporter", 0, 0, false, "product", 0, response.store._id);
        this.addConsumationMode("Dine-in", "Mode Sur Place", 0, 0, false, "product", 0, response.store._id);
        this.addmenu("Menu Item", response.store._id, "USD", "description");
        // this.modalService.dismissAll('ADD Store Success');
        this.getStoresByCompany(this.addcompany)
         // Définissez showAddStoreContent sur true
this.showAddStoreContent = false;
      }, (error) => { console.error('Error adding Stores', error); }
    );
  }
}
clearError(fieldName: string): void {
  this.messageErrors[fieldName] = '';
}
updateRangeValue(event: MouseEvent) {
  const progressBar = event.currentTarget as HTMLElement;
  const boundingRect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - boundingRect.left;
  const progressBarWidth = boundingRect.width;
  if (clickX >= 0 && clickX <= progressBarWidth) {
    const newRangeValue = (clickX / progressBarWidth) * 100;
    this.currenyData.rangeValue = Math.round(newRangeValue);
  } else { }
}
addConsumationMode(name, description, frais, taux, applyTaux, applicationType, reduction, storeId) {
  this.consumationData.name = name,
    this.consumationData.description = description,
    this.consumationData.frais = frais,
    this.consumationData.taux = taux,
    this.consumationData.applyTaux = applyTaux,
    this.consumationData.applicationType = applicationType,
    this.consumationData.reduction = reduction
  this.consumationData.storeId = storeId
  this.apiService.addConsumationMode(this.consumationData)
    .subscribe(
      response => { },
      error => { console.error('Erreur lors de l\'ajout du mode de consommation :', error); });
}
onImageChanges(event: any): void {
  const files = event.target.files;
  if (files.length > 0) { this.image = files[0]; }
}
companyId: any
getcompanybyouner() {
  this.apiService.getCompanybyouner(this.ownerId).subscribe(
    (response) => {
      this.companyId = response.companyId
    }, error => { })
}
getCoordinatesFromAddress() {
  this.apiService.getAddressFromCoordinates(this.latitude, this.longitude)
    .subscribe(
      (response: any) => {
        if (response && response.display_name) {
          const address = response.display_name;
          this.currenyData.address = address;
        } else {
          console.log("Aucune adresse trouvée.");
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération de l'adresse:", error);
      }
    );
}
someCondition: boolean = true;
updateMarker(): void {
  if (this.currentMarker && this.map) {
    const newLatLng = L.latLng(this.currenyData.latitude, this.currenyData.longitude);
    this.currentMarker.setLatLng(newLatLng);
    this.map.panTo(newLatLng);
  }
}
//edit store
group:any
getstorebyid(storeId: any): void {
  this.apiService.getStroreById(storeId).subscribe(
    (response) => {
      this.currenyData = response;
this.group=this.currenyData.companyId
console.log(this.group)
      console.log(this.currenyData.phoneNumber);
      if (this.currenyData && typeof this.currenyData.latitude === 'number' && typeof this.currenyData.longitude === 'number') {
        console.log(document.getElementById('map'));
        if (document.getElementById('map')) {
          this.initializeMapp(this.currenyData.latitude, this.currenyData.longitude);
        } else {
          console.error('Map container not found in the DOM.');
        }
      } else {
        console.error('Latitude and longitude coordinates are not available in currenyData.');
      }
    },
    (error) => {
      console.error('Error fetching store details', error);
    }
  );
}
stoores: any
openeditstore(content: any, storeId: any) {
  console.log("storeId", storeId);
  this.getstorebyid(storeId);
this.stoores=storeId;
  // Open modal once data is fetched
  this.modalService.open(content, { centered: true }).result.then(
    (result) => {},
    (reason) => {
      //console.log(`Modal dismissed with: ${reason}`);
    }
  );
}
private initializeMapp(latitude: number, longitude: number): void {
  const map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  this.currentMarker = L.marker([latitude, longitude], {
    icon: L.icon({
      iconUrl: 'assets/images/marker-icon-2x-blue.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }).addTo(map).bindPopup('Store Location').openPopup();
  map.on('click', (e: LeafletMouseEvent) => {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    this.currentMarker.setLatLng([this.latitude, this.longitude]);
    const countryName = '';
    const popupContent = this.createPopupContentt(countryName);
    this.currentMarker.bindPopup(popupContent).openPopup();
    this.updateCoordinatesDisplayy();
    this.getCoordinatesFromAddress();
  });
}
private createPopupContentt(countryName: string): string {
  return `<strong>${countryName}</strong><br>` +
    `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
}
updateCoordinatesDisplayy(): void {
  this.currenyData.latitude = this.latitude;
  this.currenyData.longitude = this.longitude;
}
updateRangeValuee(event: MouseEvent) {
  const progressBar = event.currentTarget as HTMLElement;
  const boundingRect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - boundingRect.left;
  const progressBarWidth = boundingRect.width;
  if (clickX >= 0 && clickX <= progressBarWidth) {
    const newRangeValue = (clickX / progressBarWidth) * 100;
    this.currenyData.rangeValue = Math.round(newRangeValue);
  } else { }
}
onImageChangess(event: any): void { const files: File = event.target.files[0]; this.currenyData.logo = files; }
phones: any = {}
UpdateStores() {
  if (this.currenyData.phone === null) {
    this.phone = this.currenyData.phoneNumber;
  } else { this.phone = this.currenyData.phone; }
  this.apiService.updateStore(this.stoores, this.currenyData).subscribe(
    (response) => {
      this.getStoresByCompany(this.group)
    },
    (error) => {
      console.error('Error updating Stores', error);
    }
  );
}











}
