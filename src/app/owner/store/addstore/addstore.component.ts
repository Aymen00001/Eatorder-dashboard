import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { Store } from 'src/app/models/store';
import * as L from 'leaflet';
import { latLng, LeafletMouseEvent, MapOptions, tileLayer } from 'leaflet';
import * as mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';

import { HttpClient } from '@angular/common/http';
import 'leaflet-control-geocoder';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from '../../menu-setup/toast-service';
@Component({
  selector: 'app-addstore',
  templateUrl: './addstore.component.html',
  styleUrls: ['./addstore.component.scss']
})
export class AddstoreComponent implements OnInit {
  consumationData = {
    name: '',
    description: '',
    frais: null,
    taux: null,
    applyTaux: false,
    applicationType: '',
    storeId: '',
    reduction:''
  };
  menu = {
    name:'',
    store: '',
    currency: '',
    description: '',
  };
  user: User;
  store: Store;
  errorMessage: string;
  ownerId:any;
  primairecolor='';
  secondairecolor='';
  description='';
  name='';
  longitude:any
  address: any;
  phoneNumber: any;
  latitude: any;
  image: File | null = null;
  Data = new FormData();
  currenyData:any={}
  map: L.Map;
  rangeValue: number = 25;
successMessage: string = '';
specialites: any[] = [];
isChecked: boolean = false;
Userrole:any;
  constructor(private authService: ApiServices, private http:HttpClient,private route:Router,private toastService:ToastService) { }
  ngOnInit(): void {
    this.Userrole=localStorage.getItem('role');
console.log(this.Userrole);
    const user = this.authService.getUser();
    if (user !== null) {
      this.user = user;
      this.ownerId=user._id;
    } else {  console.log("error"); }
    this.currenyData={
      companyId:this.companyId,
      ownerId:this.ownerId,
      name:"",
      description:"",
      address:"",
      phoneNumber:"",
      latitude:"",
      longitude:"",
      rangeValue: 7 ,
      secondairecolor:"",
      primairecolor:"",
      image:"",
    }
    this.getSpecialites()
  this.getcompanybyouner()
this.initializeMap()
} 
isManagerRole(): boolean {
  // Vérifie si le rôle de l'utilisateur est 'manager'
  return this.Userrole === 'manager';
}
getSpecialites(): void {
  this.authService.getSpecialites().subscribe(
    (specialites) => { this.specialites = specialites;},
    (error) => {
      console.error('Error fetching specialites:', error);
    }
  );
}
selectedSpecialites: any[] = []; 
onCheckboxChange(specialiteId: string) {
  if (this.selectedSpecialites.includes(specialiteId)) {
    this.selectedSpecialites = this.selectedSpecialites.filter(id => id !== specialiteId);
  } else { this.selectedSpecialites.push(specialiteId); }
}
ngAfterViewInit(): void {   if (!this.map) {
  this.initializeMap();
}}
private currentMarker: L.Marker | null = null;
private initializeMap(): void {
  this.map = L.map('map').setView([46.603354, 1.888334], 6);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{s}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc' // Ajoutez cette ligne pour éviter le cache
  }).addTo(this.map);
  const updateMap = (latitude: number, longitude: number) => {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    const popupContent = this.createPopupContent(latitude, longitude);
    const customMarkerIcon = L.icon({
      iconUrl: 'assets/images/marker-icon-2x-blue.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    this.currentMarker = L.marker([latitude, longitude], { icon: customMarkerIcon })
      .bindPopup(popupContent)
      .addTo(this.map)
      .openPopup();
    this.updateCoordinatesDisplay();
  };
  this.map.on('click', (e: LeafletMouseEvent) => {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    updateMap(this.latitude, this.longitude);
    this.getCoordinatesFromAddress();
  });
  this.map.whenReady(() => {
    if (!this.latitude && !this.longitude) {
      const defaultLatitude = 46.603354;
      const defaultLongitude = 1.888334;
      updateMap(defaultLatitude, defaultLongitude);
    } else {
      this.onAddressInput()
      updateMap(this.latitude, this.longitude);
    }
  });
}
private createPopupContent(latitude: number, longitude: number): string {
  return `<strong>Store Location  </strong><br>` ;
}
updateCoordinatesDisplay(): void {
  this.currenyData.latitude = this.latitude;
  this.currenyData.longitude = this.longitude;
   this.clearError('latitude');
   this.clearError('longitude');
}
  addmenu(name, store,currency,description) {
    this.menu.name=name,
    this.menu.store= store,
    this.menu.currency= currency,
    this.menu.description= description,
             this.authService.addmenu(this.menu)
          .subscribe(
            response => {  },
            error => { console.error('Erreur lors de l\'ajout menu :', error); }
          ); }
      messageerror: string = "";
      messageErrors: { [key: string]: string } = {};
      image2: File | null = null;
      BannerErrorMessage:string;
      isBannerValid:Boolean
      onImageChange2(event: any): void {
        // const files = event.target.files;
        // if (files.length > 0) { this.image2 = files[0]; } 
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const img = new Image();
            img.onload = () => {
              if (img.width > 380 || img.height > 180) {
                this.BannerErrorMessage = 'Banner dimensions should not exceed 380x180 pixels.';
                this.image2 = null;  // Clear the image if invalid
                this.isBannerValid = false;
              } else {
                this.BannerErrorMessage = '';
                this.image2 = file;  // Assign the valid image file
                this.isBannerValid = true;
              }
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
   addStores() {
        if (!this.currenyData.phoneNumber ||!this.currenyData.phoneNumber.number ||
          !this.currenyData.phoneNumber.internationalNumber   ) {
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
          rangeValue: "Range Value",
          email: "email",
        };
              this.messageErrors = {};
              for (const field in requiredFields) {
          if (!this.currenyData[field]) { this.messageErrors[field] = `Please fill in the ${requiredFields[field]} field`; } }
  if (!this.currenyData.latitude) { this.messageErrors['latitude'] = 'Please select a location on the map'; }
  if (!this.currenyData.longitude) { this.messageErrors['longitude'] = 'Please select a location on the map'; }
   // Validate logo image dimensions
   if (!this.isLogoValid) {
    this.messageerror = "Please upload a valid logo image with dimensions not exceeding 300x300 pixels.";

    setTimeout(() => { this.messageerror = ""; }, 2000);
    return;
  }
  if (!this.isBannerValid) {
    this.messageerror = "Please upload a valid logo image with dimensions not exceeding 380x180 pixels.";
    setTimeout(() => { this.messageerror = ""; }, 2000);
    return;
  }
       const errorFields = Object.keys(this.messageErrors);
       if (errorFields.length > 0) {
        this.messageerror = `Please fill in the following fields: ${errorFields.map(field => requiredFields[field]).join(', ')}`;
        setTimeout(() => { this.messageerror = ""; }, 2000);
         } else{
          if (!this.currenyData.primairecolor) { this.currenyData.primairecolor = "#000000";   }
          if (!this.currenyData.secondairecolor) {this.currenyData.secondairecolor = "#000000"; }
          const formData = new FormData();
          const phone=this.currenyData.phoneNumber.internationalNumber;
          formData.append("ownerId", this.currenyData.ownerId);
          formData.append("companyId",  this.companyId);
          formData.append("uberOrganizationStoreId",  this.uberid);
          formData.append("name", this.currenyData.name);
          formData.append("description", this.currenyData.description);
          formData.append("email", this.currenyData.email);
          formData.append("address", this.currenyData.address);
          formData.append("phoneNumber", phone);
          formData.append("latitude", this.currenyData.latitude);
          formData.append("longitude", this.currenyData.longitude);
          formData.append("primairecolor", this.currenyData.primairecolor);
          formData.append("secondairecolor", this.currenyData.secondairecolor);
          formData.append("rangeValue", this.currenyData.rangeValue.toString());
         // formData.append("image", this.image);
         if (this.image) {
          formData.append("image", this.image);
        }
        if(this.image2){
          formData.append("banner", this.image2);
        }
          this.selectedSpecialites.forEach((specialiteId, index) => {
            formData.append(`specialites[${index}]`, specialiteId);
          });
          formData.append("Specialites", JSON.stringify(this.selectedSpecialites));
          this.authService.addStores(formData).subscribe(
            (response) => {
              this.toastService.show('The store has been successfully added.', { classname: 'bg-success text-light' });

             // this.addConsumationMode("Delivery", "Mode Livraison", 0, 0, false, "product", 0, response.store._id);
            //  this.addConsumationMode("Takeaway", "Mode emporter", 0, 0, false, "product", 0, response.store._id);
             // this.addConsumationMode("Dine-in", "Mode Sur Place", 0, 0, false, "product", 0, response.store._id);
              this.addmenu("Menu Item", response.store._id, "USD", "description");
              this.route.navigateByUrl(`/store/allstore`);

            }, (error) => { 
              if (error && error.error && error.error.error === 'Email already exists.') {
                this.erroremail = true;
                this.messageerror = "Email already exists. Please choose a different email.";
                setTimeout(() => {
                  this.erroremail = false;
                }, 2000);
              } else {
                console.error('Error adding Manager', error);
              }
               console.error('Error adding Stores', error); }
          ); }
      }
      erroremail=false;
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
addConsumationMode(name,description,frais,taux,applyTaux,applicationType,reduction,storeId) {
  this.consumationData.name=name,
  this.consumationData.description= description,
  this.consumationData.frais= frais,
  this.consumationData.taux= taux,
  this.consumationData.applyTaux= applyTaux,
  this.consumationData.applicationType= applicationType,
  this.consumationData.reduction=reduction
  this.consumationData.storeId=storeId
      this.authService.addConsumationMode(this.consumationData)
        .subscribe(
          response => {    },
          error => {console.error('Erreur lors de l\'ajout du mode de consommation :', error);    } );
    }
    logoErrorMessage:string;
    isLogoValid: boolean = true;
    onImageChange(event: any): void {
      // const files = event.target.files;
      // if (files.length > 0) { this.image = files[0]; } 
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.onload = () => {
            if (img.width > 300 || img.height > 300) {
              this.logoErrorMessage = 'Logo dimensions should not exceed 300x300 pixels.';
              this.image = null;  // Clear the image if invalid
              this.isLogoValid = false;
            } else {
              this.logoErrorMessage = '';
              this.image = file;  // Assign the valid image file
              this.isLogoValid = true;
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
      companyId:any
      uberid:any
      getcompanybyouner() {
        this.authService.getCompanybyouner(this.ownerId).subscribe(
          (response) => {
            console.log(response)

            this.companyId=response.company._id
            console.log( this.companyId)
            this.uberid=response.company.uberOrganizationId
            console.log("uberid", this.uberid)
          }, error => { } )}
          someCondition: boolean = true;
    getCoordinatesFromAddress() {
            this.authService.getAddressFromCoordinates(this.latitude, this.longitude)
              .subscribe(
                (response: any) => {
                  if (response && response.display_name) {
                    const address = response.display_name;
                    this.currenyData.address = address;
                  } else {}
                },
                (error) => {console.error("Erreur lors de la récupération de l'adresse:", error); }); }
    updateMarker(): void {
      if (this.currentMarker && this.map) {
            const newLatLng = L.latLng(this.currenyData.latitude, this.currenyData.longitude);
        this.currentMarker.setLatLng(newLatLng);
            this.map.panTo(newLatLng);  } }
getCoordinatesFromAddresss(adressestore: any): Observable<any> {
  return this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adressestore)}`);
}
getAddressFromCoordinates(latitude: number, longitude: number): Observable<any> {
  return this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
}
//mapbox
erroradrress:string
mapboxClient = mapboxSdk({ accessToken: "pk.eyJ1Ijoib3Vzc2FtYTAwOSIsImEiOiJjbHJodmFkc3gwMnZ6MmtwYWVqa2x6Yjl6In0.lPX7JfDDroOFDJh_DpSFYQ"});
onAddressInput() {
  this.mapboxClient.forwardGeocode({
    query: this.currenyData.address,
    limit: 1
  })
  .send()
  .then(response => {
    if (response && response.body && response.body.features && response.body.features.length > 0) {
      const feature = response.body.features[0];
      const latitude = feature.center[1];
      const longitude = feature.center[0];
      this.currenyData.latitude = latitude;
      this.currenyData.longitude = longitude;
      this.updateMarker();
    } else {
      this.erroradrress = "No matching address found for the entered address.";
      console.error("No matching address found for the entered address.");
      setTimeout(() => {
        this.erroradrress = '';
      }, 2000);
    }
  })
  .catch(error => {
    alert("Erreur lors du géocodage de l'adresse: " + error.message);
  });
}

        }