import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  UploadResponse } from 'ngx-image-compress';
import { NgxImageCompressService,DataUrl } from 'ngx-image-compress';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from 'src/app/toast-service';

@Component({
  selector: 'app-add-unity',
  templateUrl: './add-unity.component.html',
  styleUrls: ['./add-unity.component.scss']
})
export class AddUnityComponent implements OnInit {
  storeData: any;
  mode: boolean; 
  store: any;
  uber: boolean; 
  gest: any=[]; 
  guestMode: any;
  commande: any=[]; 
  ubers: any; // Assurez-vous que le type correspond à celui renvoyé par votre API

  constructor(private apiService: ApiServices, private route: Router, private toastService: ToastService,private router: Router) {}
  
  ngOnInit(): void {
    this.store = localStorage.getItem('storeid');
    this.apiService.getStroreById(this.store).subscribe(
      (response) => {
        this.storeData = response;
        this.mode = response.modeUberdirect; 
        this.uber=response.uberDirect
       this.commande=response.managingacceptedorders
       this.preparationTime=this.commande.preparationTime;
       this.isAutomatic=this.commande.Automatic;
        this.guestMode = response.guestmode; 
        //console.log("commande",this.commande); //
        this.ubers = response.organizations;

        console.log("ubers",this.ubers)
        // Initialise les options de l'organisation
        this.initializeOrganizationOptions();
        console.log(response)
        if (this.ubers && this.ubers.options) {
          // Initialise les options de l'organisation ici
          this.ubers.options.forEach(option => {
            console.log(option.name + ': ' + option.checked);
            // Vous pouvez faire ce que vous voulez avec les valeurs ici
          });
        }
      },
      (error) => { console.error('Error retrieving Store', error); }
    );
  }
  
  switchmodeUber(): void {
    this.apiService.switchmodeUber(this.store).subscribe(
      (response) => {
        this.toastService.show('Store properties switched successfully mode', { classname: 'bg-success text-light' });
        // console.log('Store properties switched successfully mode', response);
      },
      (error) => {
        this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });
        // console.error('Error switching store properties', error);
      }
    );
  }
  switchUber(): void {
    this.apiService.switchUber(this.store).subscribe(
      (response) => {
        this.toastService.show('Store properties switched successfully Uber', { classname: 'bg-success text-light' });
        // console.log('Store properties switched successfully', response);
      },
      (error) => {
        this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });
        console.error('Error switching store properties', error);
      }
    );
  }
  automatic: boolean;
  isAutomatic: boolean;
  preparationTime:any;
  switchcommande(): void {
    if (this.isAutomatic && !this.preparationTime) {
      console.error('Please enter preparation time');
      this.toastService.show('Please enter preparation time for automatic mode', { classname: 'bg-danger text-light' });
    } else {
      this.updateStoreSettings();
    }
  }

  updatePreparationTime(): void {
    this.updateStoreSettings();
  }
  private updateStoreSettings(): void {
    const preparationTimeToSend = this.isAutomatic ? this.preparationTime : null;
    const updatedSettings = {
      preparationTime: preparationTimeToSend,
      Manual: !this.isAutomatic,
      Automatic: this.isAutomatic,
      storeId: this.store
    };
    //console.log('updatedSettings', updatedSettings);
    this.apiService.switchautomaticcommande(updatedSettings).subscribe(
      (response) => {
        // Vérifie si la réponse de l'API indique le succès de l'opération
        if (response !== undefined || response !== null) {
          this.toastService.show('Store properties switched successfully', { classname: 'bg-success text-light' });
          // Ajoute un délai de 2 secondes avant de recharger la page
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          // Affiche un message d'erreur si l'API retourne une réponse vide ou invalide
          this.toastService.show('Erreur switched ', { classname: 'bg-danger text-light' });
          console.error('Empty or invalid response from API');
        }
      },
      (error) => {
        this.toastService.show('Erreur lors du changement des propriétés du magasin', { classname: 'bg-danger text-light' });
        console.error('Error switching store properties', error);
      }
    );
  }
  
  //sgow guest mode
  switchguestmode(): void {
   console.log(this.guestMode)
    /*this.apiService.switchguestmode(this.store,this.guestMode).subscribe(
      (response) => {
        this.toastService.show('Store properties switched successfully ', { classname: 'bg-success text-light' });
        // console.log('Store properties switched successfully ', response);
      },
      (error) => {
        this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });
        console.error('Error switching store properties', error);
      }
    );*/
  }
  updateProperty(propertyType: string, key: string): void {
    if (propertyType === 'guestmode') {
        // Inverse la valeur de guestmode
        this.guestMode[0].guestmode = !this.guestMode[0].guestmode;
        console.log("Updated guest mode:", this.guestMode[0].guestmode);
    } else if (propertyType === 'kiosk') {
        // Assurez-vous que la clé existe dans kiosk et modifiez sa valeur
        if (this.guestMode && this.guestMode[0].kiosk && this.guestMode[0].kiosk.hasOwnProperty(key)) {
            this.guestMode[0].kiosk[key] = !this.guestMode[0].kiosk[key]; // Inversez la valeur
            console.log("Updated kiosk property:", key, this.guestMode[0].kiosk[key]);
        }
    } else if (propertyType === 'other') {
        // Assurez-vous que la clé existe dans other et modifiez sa valeur
        if (this.guestMode && this.guestMode[0].other && this.guestMode[0].other.hasOwnProperty(key)) {
            this.guestMode[0].other[key] = !this.guestMode[0].other[key]; // Inversez la valeur
            console.log("Updated other property:", key, this.guestMode[0].other[key]);
        }
    }

    console.log("Updating property:", propertyType, key);
    console.log("Updated guestMode:", this.guestMode);
    
    // Appel à l'API pour mettre à jour la valeur sur le backend
     this.apiService.switchguestmode(this.store, this.guestMode).subscribe(
        (response) => {
            this.toastService.show('Store properties switched successfully ', { classname: 'bg-success text-light' });
        },
        (error) => {
            this.toastService.show('Erreur deleted', { classname: 'bg-danger text-light' });
            console.error('Error switching store properties', error);
        }
    );
}
//put uber new 

switchUber2() {
  if (!this.ubers) {
    // Réinitialise le mode à false lorsque Uber est désactivé
    this.mode = false;
  }
  this.sendUpdateRequest();
}

switchModeUber() {
  this.sendUpdateRequest();
}

sendUpdateRequest() {
  const payload = {
    name: 'Uber direct',
    storeId: this.store,
    option: [
      { name: 'Manual', checked: !this.uberstatus },
      { name: 'Automatic', checked: this.uberstatus }
    ]
  };
  console.log("payload", payload);
  console.log("payload", payload);
  this.apiService.switchautomaticuber(payload).subscribe(
    (response) => {
      // Vérifie si la réponse de l'API indique le succès de l'opération
      if (response !== undefined || response !== null) {
        this.toastService.show('Store properties switched successfully', { classname: 'bg-success text-light' });
        // Ajoute un délai de 2 secondes avant de recharger la page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Affiche un message d'erreur si l'API retourne une réponse vide ou invalide
        this.toastService.show('Erreur switched ', { classname: 'bg-danger text-light' });
        console.error('Empty or invalid response from API');
      }
    },
    (error) => {
      this.toastService.show('Erreur lors du changement des propriétés du magasin', { classname: 'bg-danger text-light' });
      console.error('Error switching store properties', error);
    }
  );
}
uberstatus:any

initializeOrganizationOptions(): void {
  if (this.ubers && this.ubers.length > 0 && this.ubers[0].options) {
    const automaticOption = this.ubers[0].options.find(option => option.name === 'Automatic');
    const manualOption = this.ubers[0].options.find(option => option.name === 'Manual');
    
    if (automaticOption && manualOption) {
      // Assuming 'Automatic' and 'Manual' are mutually exclusive and only one can be checked
      this.uberstatus = automaticOption.checked ? true : manualOption.checked ? false : null;
    }
  }
}


  
}
