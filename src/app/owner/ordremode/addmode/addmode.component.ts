import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-addmode',
  templateUrl: './addmode.component.html',
  styleUrls: ['./addmode.component.scss']
})
export class AddmodeComponent implements OnInit {
  consumationModes: any[];
   consumationData = {
    name: '',
    description: '',
    frais: null,  
    taux: null, 
    applyTaux: false, 
    applicationType: '', 
    storeId: '', 
    reduction:'',
    minOrder:null
  };
  successMessage: string = ''; 
  constructor(private apiservice:ApiServices) { }

  ngOnInit(): void {
    $.getScript('./assets/js/form-validations.js');
    $.getScript('./assets/js/bs-custom-file-input.min.js');
  }
  addConsumationMode() {
  
this.consumationData.storeId=this.apiservice.getStore();
    this.apiservice.addConsumationMode(this.consumationData)
      .subscribe(
        response => {
          this.successMessage = 'Mode ajouté avec succès!'; 
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error => {
          console.error('Erreur lors de l\'ajout du mode de consommation :', error);
        }
      );
  }
  addOptionGroup(optionGroupId,parentOptionGroupId,optionId) {
    this.apiservice.addOptionGroupToOG(optionGroupId, parentOptionGroupId, optionId).subscribe(
      (response) => {
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
}
