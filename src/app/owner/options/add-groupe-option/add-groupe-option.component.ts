import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiServices } from 'src/app/services/api';
import { OptionGroup } from '../../../models/optionGroupe';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-groupe-option',
  templateUrl: './add-groupe-option.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./add-groupe-option.component.scss']
})
export class AddGroupeOptionComponent implements OnInit {
  user: User = {} as User; // Initialize with an empty User object

  userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée
  optionGroup: OptionGroup = {
    _id: '',
    name: '',
    options: [],
    description: '',
    userId: this.userId,
    storeId: this.apiService.getStore(),
    force_max: 0,
    force_min: 0,
    allow_quantity:false,
    checked:false,
    taxes:[],

  };
  imageFile: File;
  optionGroups: OptionGroup[] = [];
  searchTerm: string = ''; // Assurez-vous que cette ligne est ajoutée
  filteredOptionGroups: OptionGroup[] = [];

  constructor(private formBuilder: FormBuilder, private apiService: ApiServices) {

  }

  ngOnInit() {
    this.optionGroup.storeId= this.apiService.getStore();
    console.log( this.optionGroup.storeId)
    const user = this.apiService.getUser();
    if (user !== null) {
      this.user = user;
      this.userId = this.user._id;

      console.log(this.userId)
    } else {
      // Handle the case when the user is null
    }

    this.fetchOptionGroups();
  }

  fetchOptionGroups() {
    this.apiService.getOptionGroups(this.apiService.getStore()).subscribe(
      response => {
        this.optionGroups = response.optionGroups;
        this.filteredOptionGroups = this.optionGroups;

      },
      error => {
        console.error(error);
      }
    );
  }

  addOptionGroup(): void {
    this.optionGroup.userId = this.userId;
  this.optionGroup.storeId= this.apiService.getStore();
  console.log(this.optionGroup);
      this.apiService.addOptionGroup(this.optionGroup).subscribe(
        response => {
          console.log('Groupe d\'options créé avec succès', response);
          this.optionGroups.push(response);
          this.optionGroup = {
            name: '',
            options: [],
            description: '',
            userId: this.userId,
            storeId: this.apiService.getStore(),
            force_max: null,
            force_min:null,
            allow_quantity:false,
            checked:false,
            taxes:[],

          };
          this.imageFile = null;
          this.fetchOptionGroups();
  
  
         
        },
        error => {
          console.error('Une erreur est survenue lors de la création du groupe d\'options', error);
          // Gérer l'erreur de création du groupe d'options
        }
      );
    
 
  }
  allowQuantityCheckboxChange()
  {
    this.optionGroup.allow_quantity=!this.optionGroup.allow_quantity;
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

 

  searchOptionGroups(): void {
    const searchTerm = this.searchTerm.toLowerCase();
  
    if (searchTerm) {
      this.filteredOptionGroups  = this.optionGroups.filter(
        (group: OptionGroup) =>
          group.name.toLowerCase().includes(searchTerm) ||
          group.description.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredOptionGroups  = [...this.optionGroups];
    }
  
  }




}
