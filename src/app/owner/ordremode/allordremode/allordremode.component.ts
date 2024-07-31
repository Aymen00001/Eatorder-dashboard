import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-allordremode',
  templateUrl: './allordremode.component.html',
  styleUrls: ['./allordremode.component.scss']
})
export class AllordremodeComponent implements OnInit {
  consumationModes: any[];
   consumationData = {
    name: '',
    description: '',
    frais: null,  
    taux: null,
    applyTaux: true, 
    applicationType: '', 
    storeId: '646f8214ae315a69bd54851e' 
  };
  constructor( private apiservice:ApiServices,private modalService: NgbModal ) { }
  ngOnInit(): void {
    this.fetchConsumationModes();
  }
  fetchConsumationModes(): void {
    this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
      (consumationModes) => {
        this.consumationModes = consumationModes;
      },
      (error) => {
        console.error('Error fetching consumation modes:', error);
      }
    );
  }
  confirmDelete(modeId: string,idmode:string): void {
    const result = window.confirm('Êtes-vous sûr de vouloir supprimer ce mode de consommation ?');
    if (result) {
      // L'utilisateur a confirmé la suppression
      this.deleteMode(modeId,idmode);
    }
  }
  deleteMode(modeId: string ,idmode:string): void {
    this.apiservice.deleteConsumationMode(modeId).subscribe(
      response => {
        // Find the index of the deleted mode in the array
        const index = this.consumationModes.findIndex(mode => mode._id === idmode);
        if (index !== -1) {
          // Remove the mode from the array
          this.consumationModes.splice(index, 1);
        }
      },
      error => {
        console.error('Erreur lors de la suppression du mode de consommation', error);
      }
    );
  }
  toggleModeEnabled( modeId: string, ): void {
    this.apiservice.toggleConsumationModeEnabled(this.apiservice.getStore(), modeId).subscribe(
      () => {
        // Update the local data or refresh the data from the API as needed
      },
      (error) => {
        console.error('Error toggling consumation mode:', error);
      }
    );
  }
  addConsumationMode() {  
this.consumationData.storeId=this.apiservice.getStore();
    this.apiservice.addConsumationMode(this.consumationData)
      .subscribe(
        response => {
          this.fetchConsumationModes()
        },
        error => {
          console.error('Erreur lors de l\'ajout du mode de consommation :', error);
        }
      );
  }
//edit Mode
private modalReference: NgbModalRef;
openModal(content: any, storeId: string) {
  this.apiservice.getMode(storeId).subscribe(
    (response) => {
      this.consumationData = response;
      this.modalService.open(content, { size: 'lg' }).result.then(
        (result) => {
          console.log(`Modal closed with: ${result}`);
        },
        (reason) => {
          console.log(`Modal dismissed with: ${reason}`);
        }
      );
    },
    (error) => {
      console.error('Error retrieving Store', error);
    }
  );
}
updateMode(modeId:any): void {
  this.apiservice.updateMod(modeId, this.consumationData).subscribe(
    (response) => {
      this.fetchConsumationModes()
   if (this.modalService) {
   // this.modalService.close('Update successful');
  }
    },
    (error) => {
      console.error('Error updating Mode', error);
    }
  );
}
}
