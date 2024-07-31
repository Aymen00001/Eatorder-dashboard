
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { Store } from 'src/app/models/store';
import { FormModule } from 'src/app/form/form.module';
import * as L from 'leaflet';
import { latLng, LeafletMouseEvent, MapOptions, tileLayer } from 'leaflet';

import { HttpClient } from '@angular/common/http';
import 'leaflet-control-geocoder';
import { Router } from '@angular/router';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  
consumationData = {
    name: '',
    description: '',
    frais: null,  // Remplacez par la valeur réelle
    taux: null, // Remplacez par la valeur réelle
    applyTaux: false, // Remplacez par la valeur réelle
    applicationType: '', // Remplacez par 'product' ou 'order'
    storeId: '',
    reduction:'' // Remplacez par l'ID réel du magasin
  };
  user: User;
  store: Store; // Change the type to a single Store object
  errorMessage: string;
  //Data = new FormData();
  ownerId:any;
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
  currenyData:any={}
  map: L.Map;
  rangeValue: number = 25; // Valeur initiale



  constructor(private authService: ApiServices, private http:HttpClient,private route:Router) { 
 
  }
  
  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user !== null) {
      this.user = user;
      this.ownerId=user._id;
      console.log(this.ownerId);
    } else {
      // Handle the case when the user is null
      console.log("error");
    }
    this.currenyData={
      ownerId:this.ownerId,
      name:"",
      description:"",
      address:"",
      phoneNumber:"",
      latitude:"",
      longitude:"",
      rangeValue: 25  // Valeur par défaut
    }
   // this.initMap();
  
}
   
   
ngAfterViewInit(): void {
  this.initializeMap();
}

private currentMarker: L.Marker | null = null;

private initializeMap(): void {
  console.log('Initializing map...');

  const map = L.map('map').setView([51.505, -0.09], 13);

  console.log('Map initialized');

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.on('click', (e: LeafletMouseEvent) => {
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;

    // Remove the current marker if it exists
    if (this.currentMarker) {
      map.removeLayer(this.currentMarker);
    }

    // Dynamically create popup content with the country name
    const countryName = '';  // Remplacez par le vrai nom du pays
    const popupContent = this.createPopupContent(countryName);

    // Specify the URL of your custom marker image
    const customMarkerIcon = L.icon({
      iconUrl: 'assets/images/marker-icon-2x-blue.png', // Adjust the path based on your project structure
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Add a new marker with the custom icon and bind popup
    this.currentMarker = L.marker([this.latitude, this.longitude], { icon: customMarkerIcon })
      .bindPopup(popupContent)
      .addTo(map)
      .openPopup();

    this.updateCoordinatesDisplay();
  });
}

private createPopupContent(countryName: string): string {
  // You can create dynamic content based on the clicked location
  return `<strong>${countryName}</strong><br>` +
         `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
}

updateCoordinatesDisplay(): void {
  this.currenyData.latitude = this.latitude;
  this.currenyData.longitude = this.longitude;
}


  
   /*onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.Data.append('image', file, file.name);
      this.image = file;
    }
  }*/
   addStores(){
    console.log(this.ownerId)
 
console.log(this.ownerId)
console.log(this.name)

    this.authService.addStores(this.currenyData).subscribe(

      (response) => {
        console.log('Stores added successfully', response);
        console.log(response.store._id);
        
        this.addConsumationMode("delivery","Mode Livraison",0,0,false,"product",0,response.store._id)
        this.addConsumationMode("Takeaway","Mode emporter",0,0,false,"product",0,response.store._id)
        this.addConsumationMode("Dine-in","Mode Sur Place",0,0,false,"product",0,response.store._id)
        this.route.navigateByUrl(`/banner/addUnity`);
       

      },
      (error) => {
        console.error('Error adding Stores', error);
        console.log(this.Data);
       
      }
    );
  }
 /* showSuccess() {
    this.toastService.show('Store ajouté avec succès', { classname: 'bg-success text-light', delay: 10000 });
  }
*/
updateRangeValue(event: MouseEvent) {
  // Get the reference to the progress bar element that triggered the event
  const progressBar = event.currentTarget as HTMLElement;

  // Get the bounding rectangle of the progress bar
  const boundingRect = progressBar.getBoundingClientRect();

  // Calculate the horizontal position of the click relative to the left edge of the progress bar
  // to avoid displaying NaN when clicking outside the progress bar bounds
  const clickX = event.clientX - boundingRect.left;

  // Get the width of the progress bar
  const progressBarWidth = boundingRect.width;

  // Ensure the clickX is within the bounds of the progress bar
  if (clickX >= 0 && clickX <= progressBarWidth) {
    // Calculate the new range value based on the click position within the progress bar
    const newRangeValue = (clickX / progressBarWidth) * 100;

    // Update the currenyData.rangeValue with the rounded new range value
    this.currenyData.rangeValue = Math.round(newRangeValue);

    // You can use this.currenyData.rangeValue as needed, for example, send it to a service or perform other operations.
  } else {
    // Handle the case when the click is outside the bounds (optional)
    // Uncomment the line below if you want to log a warning to the console
    // console.warn('Click position outside the progress bar bounds');
  }
}
addConsumationMode(name,description,frais,taux,applyTaux,applicationType,reduction,storeId) {
  this.consumationData.name=name,
  this.consumationData.description= description,
  this.consumationData.frais= frais,  // Remplacez par la valeur réelle
  this.consumationData.taux= taux, // Remplacez par la valeur réelle
  this.consumationData.applyTaux= applyTaux, // Remplacez par la valeur réelle
  this.consumationData.applicationType= applicationType, // Remplacez par 'product' ou 'order'

  this.consumationData.reduction=reduction // Remplacez par l'ID réel du magasin
  this.consumationData.storeId=storeId
  console.log(this.consumationData);
  
      // Appelez le service pour ajouter le mode de consommation
      this.authService.addConsumationMode(this.consumationData)
        .subscribe(
          response => {
            console.log('Mode de consommation ajouté :', response);
           
          },
          error => {
            console.error('Erreur lors de l\'ajout du mode de consommation :', error);
          }
        );
    }
  }


