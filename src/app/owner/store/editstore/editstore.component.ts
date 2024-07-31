import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Store } from 'src/app/models/store';
import { FormModule } from 'src/app/form/form.module';
import * as L from 'leaflet';
import { latLng, LeafletMouseEvent, MapOptions, tileLayer } from 'leaflet';
import { NgModule } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import 'leaflet-control-geocoder';
import { ApiServices } from 'src/app/services/api';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';


@Component({
  selector: 'app-editstore',
  templateUrl: './editstore.component.html',
  styleUrls: ['./editstore.component.scss']
})
export class EditstoreComponent implements OnInit {
  user: User;
  store: Store;
  errorMessage: string;
  ownerId:any;
  storesId:any;
  primairecolor='';
  secondairecolor='';
  description='';
  link='';
  name='';
  longitude:any
  address: any;
  phoneNumber: any;
  latitude: any;
  image: File | null = null;
  Data = new FormData();
  currenyData:any=[];
  map: L.Map;
  rangeValue: number = 25;
  numero: any;
  selectedfile: any;
  specialites: any[];
  initialLatitude: any;
  initialLongitude: any;
  constructor(private authService: ApiServices, private http:HttpClient,private ac:ActivatedRoute,private route:Router) {
    this.numero = this.ac.snapshot.params?.id;
   
 this.currenyData={
  ownerId:this.ownerId,
  name:"",
  description:"",
  address:"",
  phoneNumber:"",
  latitude:"",
  longitude:"",
  rangeValue: 25 ,
  image:"",
  email:""
}
  }
  ngOnInit(): void {
    this.getStoresById()
    this.getSpecialites()
    const user = this.authService.getUser();
    if (user !== null) {
      this.user = user;
      this.storesId=user._id;
    } else {   console.log("error"); }
    if (this.currenyData.phoneNumber && this.currenyData.phoneNumber.nationalNumber) {
      // Set initial value for ngx-intl-tel-input
      this.currenyData.phoneNumber = {
        nationalNumber: this.currenyData.phoneNumber.nationalNumber
      }; }    
}
selectedSpecialites: any[] = []; 
onCheckboxChange(specialiteId: string) {
  if (this.selectedSpecialites.includes(specialiteId)) {
    this.selectedSpecialites = this.selectedSpecialites.filter(id => id !== specialiteId);
  } else {
    this.selectedSpecialites.push(specialiteId);
  }
}

getSpecialites(): void {
  this.authService.getSpecialites().subscribe(
    (specialites) => {
      this.specialites = specialites;
    },
    (error) => {
      console.error('Error fetching specialites:', error);
    }
  );
}
isChecked(specialiteId: string): boolean {
  return this.selectedSpecialites.includes(specialiteId);
}
private currentMarker: L.Marker | null = null;
private initializeMap(latitude: number, longitude: number): void {
  this.map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
  // Appeler updateMap avec les coordonnées initiales
  updateMap(latitude, longitude);
  const handleMapClick = (e: LeafletMouseEvent) => {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    updateMap(this.latitude, this.longitude);
    this.getCoordinatesFromAddress();
  };
  this.map.on('click', handleMapClick);
}
private createPopupContent(latitude: number, longitude: number): string {
  return `<strong>Store Location </strong><br>` ;
}
updateCoordinatesDisplay(): void {
  this.currenyData.latitude = this.latitude;
  this.currenyData.longitude = this.longitude;
}
   getStoresById(){
    this.authService.getStroreById(this.numero).subscribe(
      (response) => {
        this.currenyData=response;
        this.selectedSpecialites = this.selectedSpecialites.concat(this.currenyData.specialites);
      console.warn(this.selectedSpecialites);
      // Initialisation des coordonnées
      this.initialLatitude = response.latitude;
     this.initialLongitude = response.longitude;
       if (this.currenyData && typeof this.currenyData.latitude === 'number' && typeof this.currenyData.longitude === 'number') {
        this.initializeMap(this.currenyData.latitude, this.currenyData.longitude);
      } else { console.error('Latitude and longitude coordinates are not available in currenyData.');}
      },
      (error) => {  console.error('Error adding Stores', error);   });
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
onImageChange(event: any): void {const files:File = event.target.files[0];  this.currenyData.logo = files;}
onImageChange2(event: any): void {const files:File = event.target.files[0];  this.currenyData.StoreBanner = files;}
phone:any
UpdateStores() {
  if (this.currenyData.latitude === undefined || this.currenyData.longitude === undefined || this.currenyData.latitude === null || this.currenyData.longitude === null) {
    this.currenyData.latitude = this.initialLatitude;
    this.currenyData.longitude = this.initialLongitude;
    this.currenyData.specialites = this.selectedSpecialites;
  }
  console.log(this.currenyData)
  this.authService.updateStore(this.numero, this.currenyData).subscribe(
    (response) => {
      this.route.navigateByUrl(`/store/allstore`);
    },
    (error) => {
      console.error('Error updating Stores', error);
    }
  );
}
erroremail=false;
messageerror: string = "";


getCoordinatesFromAddress() {
  this.authService.getAddressFromCoordinates(this.latitude, this.longitude)
    .subscribe(
      (response: any) => {
        if (response && response.display_name) {
          const address = response.display_name;
          this.currenyData.address = address;
        } else { }
      },
      (error) => {
        console.error("Erreur lors de la récupération de l'adresse:", error);
      }
    );
}
someCondition: boolean = true;
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
updateMarker(): void {
  if (this.currentMarker && this.map) {
        const newLatLng = L.latLng(this.currenyData.latitude, this.currenyData.longitude);
    this.currentMarker.setLatLng(newLatLng);
        this.map.panTo(newLatLng);  } }
}
