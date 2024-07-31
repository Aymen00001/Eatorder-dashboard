import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-option',
  templateUrl: './add-option.component.html',
  styleUrls: ['./add-option.component.scss']
})
export class AddOptionComponent implements OnInit {

  user: User = {} as User; // Initialize with an empty User object

  userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée

  isPromoChecked: boolean = false;
  imageFile: File;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private apiService: ApiServices, private router: Router) { }

  ngOnInit(): void {
    const user = this.apiService.getUser();
    console.log(user)
    if (user !== null) {
      this.user = user;
      this.userId = this.user._id;

      console.log(this.userId)
    } else {
      // Handle the case when the user is null
    }
this.fetchConsumationModes();
this.getAllTaxes();
  }



  onPromoCheckboxChange(): void {
    this.isPromoChecked = !this.isPromoChecked;
  }
  saveOption(): void {
    const name = (document.getElementById('inputName') as HTMLInputElement).value;
    const price = parseFloat((document.getElementById('inputPrice') as HTMLInputElement).value);
  //  const tax = parseFloat((document.getElementById('inputTax') as HTMLInputElement).value);
    const isDefault = (document.getElementById('inputDefault') as HTMLInputElement).checked;
    const promoPercentage = this.isPromoChecked
      ? parseFloat((document.getElementById('inputPromoPercentage') as HTMLInputElement).value)
      : null;
    const unitSelect = (document.getElementById('inputUnit') as HTMLSelectElement);
    const unite = unitSelect.options[unitSelect.selectedIndex].text;
    console.log(this.modeTaxAssociations);
    const selectedTaxes = Object.keys(this.modeTaxAssociations).map(modeId => ({
      mode: modeId,
      tax: this.modeTaxAssociations[modeId],
    }));
      // Vérifier si une taxe est sélectionnée pour chaque mode
  for (const taxObj of selectedTaxes) {
    if (!taxObj.tax) {
      this.errorMessage = `Please select a tax for mode `;
      return; // Arrêter l'exécution de la fonction si une taxe n'est pas sélectionnée
    }
  }
    const store= localStorage.getItem('storeid');
    console.log(store)
      const optionData = {
      name,
      price,
      store:store,
      unite,
      isDefault,
      promoPercentage,
      userId: this.userId ,
      taxes:selectedTaxes
    };
console.log("optionData",optionData)
    this.apiService.addOption(optionData,this.userId, this.imageFile).subscribe(
      (response) => {
        console.log('Option ajoutée avec succès:', response.option);
        this.successMessage = 'Option added successfully'; // Set the success message
        this.errorMessage = null; // Clear any existing error message
        this.router.navigate(['/options/allOptions']);

        // Réinitialiser les valeurs des champs ou effectuer d'autres actions après avoir ajouté l'option
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'option:', error);
        this.successMessage = null; // Clear any existing success message
      this.errorMessage = 'Error adding option'; // Set the error message
        // Gérer l'erreur ou afficher un message d'erreur à l'utilisateur
      }
    );
  }

  
  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
  }

  selectedMode: any = [];
  selectMode(mode: any): void {
    this.selectedMode = mode;
  }
  modeTaxAssociations: { [modeId: string]: string } = {}; // Ajoutez cette ligne
  selectTax(taxId: string): void {
    if (this.selectedMode) {
      this.selectedMode.selectedTax = taxId;
      this.modeTaxAssociations[this.selectedMode.mode._id] = taxId;
      
    }
    console.log("selectedMode",this.selectedMode)
    console.log("modeTaxAssociations",this.modeTaxAssociations)

  }
  ModeConsumation: any[];
  fetchConsumationModes(): void {
    this.apiService.getConsumationModes(this.apiService.getStore()).subscribe(
      (consumationModes) => {
        this.ModeConsumation=consumationModes;
         console.log(this.ModeConsumation)
         this.ModeConsumation.forEach(mode => {
          this.modeTaxAssociations[mode._id] = null;
        });
        console.log("modeTaxAssociations",this.modeTaxAssociations)

      },
      (error) => {
        console.error('Error fetching consumation modes:', error);
      }
    );
    }
    taxes: any[];
    taxeoption: any[] = [];

    getAllTaxes(): void {
      this.apiService.getTax(this.apiService.getStore()).subscribe(
        (data) => {
          this.taxes = data.taxes.map(tax => ({ ...tax, isChecked: false }));
          if (this.ModeConsumation) {
            this.ModeConsumation.forEach(mode => {
              mode.taxes = this.taxes.map(tax => ({ ...tax, isChecked: false }));
            });
          } else {
            console.error('ModeConsumation is undefined');
          }
          this.taxeoption = data.taxes;
  
          const defaultTax = this.taxeoption.find(tax => tax.name === 'Default TAX');
          console.log("defaultTax", defaultTax);
  
          if (defaultTax) {
            this.ModeConsumation.forEach(mode => {
              if (!this.modeTaxAssociations[mode._id]) {
                this.modeTaxAssociations[mode._id] = defaultTax._id;
                mode.selectedTax = defaultTax._id;
              }
            });
          }
        },
        (error) => {
          console.error('Error getting taxes:', error);
        }
      );
    }
}
