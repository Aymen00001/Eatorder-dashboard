import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from '../toast-service';
import { OptionGroup } from 'src/app/models/optionGroupe';
import { ProductOption } from 'src/app/models/productOption';
import { NgxImageCompressService,DataUrl } from 'ngx-image-compress';

  import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
  import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-options-groups',
  templateUrl: './options-groups.component.html',
  styleUrls: ['./options-groups.component.scss']
})
export class OptionsGroupsComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imgResultAfterResize: DataUrl = '';
  file = '';
  taxes: any[];

  ModeConsumation: any[];
  checkedTaxes: { mode: string, tax: string }[] = [];
  image: any;
  baseUrl = 'https://server.eatorder.fr:8000/'
  optionGroups: OptionGroup[] = [];
  filteredOptionGroups: OptionGroup[];
  optionGroup: OptionGroup = {
    _id: '',
    name: '',
    options: [],
    description: '',
    userId:null,
    storeId: this.apiservice.getStore(),
    force_max: 0,
    force_min: 0,
    allow_quantity:false,
    checked:false,
    taxes:[],

  }
  user:any
  optionProduct: ProductOption[] = [];
  filteredOptions: ProductOption[] = [];
  showaddoption: boolean=true;
  productOption: any = {
    name: '',        // Initialize the name property with an empty string or default value
    price: 0,        // Initialize other properties accordingly
    tax: 0,
    unite: '',
    isDefault: false,
    image: null,
   store:this.apiservice.getStore(),
   taxes:[]
  };
  searchTerm: string = ''; 
  selectedFile: any;
  groupe: any;
  selectedoption: any;
  selectedGroup: any;
og:any
  constructor(private modalService: NgbModal,private imageCompress: NgxImageCompressService, private apiservice: ApiServices, private http: HttpClient,
    private toastService: ToastService,private sanitizer: DomSanitizer,private cdr: ChangeDetectorRef
    ) { 
      
    }

  ngOnInit(): void {
    this.fetchConsumationModes()

    this.fetchOptionGroups()
    this.user = this.apiservice.getUser();
    this.getAllTaxes()
  }
  isHovered = false;

  showOverlay() {
    this.isHovered = true;
  }

  hideOverlay() {
    this.isHovered = false;
  }
  showSuccess(msg) {
    this.toastService.show(`${msg}`, { classname: 'bg-success text-light', delay: 10000 });
  }
  showError(msg) {
    this.toastService.show(`${msg}`, { classname: 'bg-danger text-light', delay: 10000 });
  }
  fetchOptionGroups() {
    this.apiservice.getOptionGroups(this.apiservice.getStore()).subscribe(
      response => {
        this.optionGroups = response.optionGroups;
        this.optionGroups = response.optionGroups.map((group: OptionGroup) => ({
          ...group,
          checked: false // Add the 'checked' property here
        }));
        console.log(this.optionGroups)
       this.filteredOptionGroups = this.optionGroups;

      },
      error => {
        console.error(error);
      }
    );
  }
  openAddOptionsGroups(addOptionsGroups)
  {
       
    this.modalService.open(addOptionsGroups,{size:'lg'})
  }
  fetchConsumationModes(): void {
    this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
      (consumationModes) => {
        this.ModeConsumation=consumationModes;
         console.log("ModeConsumation",this.ModeConsumation)
        this.getAllTaxes();
       // this.populateModePrices(consumationModes);
      
      },
      (error) => {
        console.error('Error fetching consumation modes:', error);
      }
    );
    }

  checkCheckedTaxes() {
    this.checkedTaxes = [];

    this.ModeConsumation.forEach(consumationMode => {
      consumationMode.taxes.forEach(tax => {
        if (tax.isChecked) {
          this.checkedTaxes.push({
            mode: consumationMode.mode._id,
            tax: tax._id
          });
        }
      });
    });

    console.log(this.checkedTaxes);
    // Do whatever you need with the checked taxes
  }
  getAllTaxes(): void {
    this.apiservice.getTax(this.apiservice.getStore()).subscribe(
      data => {
        this.taxes = data.taxes.map(tax => ({ ...tax, isChecked: false }));
        if (this.ModeConsumation) {
          this.ModeConsumation.forEach(mode => {
            mode.taxes = this.taxes.map(tax => ({ ...tax, isChecked: false }));
          });
        } else {
          console.error('ModeConsumation is undefined');
        }
        this.taxeoption=data.taxes;
     
      // Trouver la taxe par défaut
      const defaultTax = this.taxeoption.find(tax => tax.name === 'Default TAX');
     // console.log("defaultTax", defaultTax);

      // Vérifier si selectedTax est déjà défini
      if (!this.selectedMode.selectedTax && defaultTax) {
        // Utiliser defaultTax comme selectedTax si aucun n'est sélectionné
        this.selectedMode.selectedTax = defaultTax._id;
      }
      },
      error => {
        console.error('Error getting taxes:', error);
      }
    );
  }
  addOptionGroup(): void {
    if (this.optionGroup.name.length<24) 
 {
    this.checkCheckedTaxes()
    this.optionGroup.userId = this.user._id;
  this.optionGroup.storeId= this.apiservice.getStore();
  this.optionGroup.taxes=this.checkedTaxes
  console.log(this.optionGroup);
      this.apiservice.addOptionGroup(this.optionGroup).subscribe(
        response => {
          console.log('Groupe d\'options créé avec succès', response);
          this.optionGroups.push(response);
          this.optionGroup = {
            name: '',
            options: [],
            description: '',
            userId: this.user._id,
            storeId: this.apiservice.getStore(),
            force_max: null,
            force_min:null,
            allow_quantity:false,
            checked:true,
            taxes:[],

          };
  
          this.fetchOptionGroups();
          this.showSuccess("option Groupe ajouté avec succés")

  
  
         
        },
        error => {
          console.error('Une erreur est survenue lors de la création du groupe d\'options', error);
          // Gérer l'erreur de création du groupe d'options
        }
      );
      }else{
        this.toastService.show('name must be under 23 caractere!', { classname: 'bg-danger text-light' });

      }
 
  }
  showerror: string;

  deleteOptionGroup(group: OptionGroup): void {
    let confirmMessage = 'Are you sure you want to delete this option group?';
    if (group.options && group.options.length > 0) {
      confirmMessage = 'Are you sure you want to delete this option group with options?';
    }
  
    const confirmDelete = confirm(confirmMessage);
    if (confirmDelete) {
      this.apiservice.deleteOptionGroup(group._id).subscribe(
        () => {
          // Option group deleted successfully, update the optionGroups array
          this.optionGroups = this.optionGroups.filter((g) => g._id !== group._id);
          this.filteredOptionGroups = this.optionGroups;

                    this.showSuccess("Option group deleted successfully.");
     
        },
        (error) => {
          console.error(error);
          // Handle error scenario
          this.showError("Option group Error deleted .");
        }
      );
    }
  }
  openScrollableContent(longContent,groupes) {
    this.productOption.name=""
    this.productOption.price=""
    this.productOption.default=false
    this.image=""
    this.imgResultAfterResize=null;
    this.groupe=groupes;
    // this.getOptions(groupes.options);
    this.getOptionsByStoreId(groupes.options)
    this.showaddoption =true;
    this.modalService.open(longContent, { scrollable: true });
  }
  getOptionsByStoreId(optiongroupe): void {
    this.apiservice.getOptionsByStoreId(this.apiservice.getStore()).subscribe(
      (response: any) => {
        const options = response;
        console.log(options)
        this.optionProduct = response;
      this.filteredOptions= this.deleteDuplicatesFromArray1(options,optiongroupe)
      },
      (error) => {
        console.error('Error fetching options:', error);
        // Handle error, e.g., show an error message to the user
      }
    );
  }
  deleteDuplicatesFromArray1(array1: any[], array2: any[]): any[] {
    // Assuming each item in the array has an 'id' property
    const array2Ids = array2.map(item => item.option);
      console.log( array2);
      
    // Filter array1 to exclude items that have the same 'id' as in array2
    const filteredArray1 = array1.filter(item => !array2Ids.includes(item._id));
    console.log("-----");
    
    console.log(filteredArray1);
    return filteredArray1;
   
    
  }
  showAddOption()
  {
    this.showaddoption =!this.showaddoption;
  }
  searchOptions(): void {
    const searchTerm = this.searchTerm.toLowerCase();
  
    if (searchTerm) {
      this.filteredOptions = this.optionProduct.filter(
        (option: ProductOption) =>
          option.name.toLowerCase().includes(searchTerm) 
         
      );
    } else {
      this.filteredOptions = [...this.optionProduct];
    }
  }
/*  messageErrors: { [key: string]: string } = {};
  errorMessage: string | null = null;
  saveOption(productOption: any, idGroups: string): void {
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

    const price = productOption.price;
    const idgroupe = idGroups;
    productOption.price = 0;

    productOption.taxes = Object.keys(this.modeTaxAssociations).map(modeId => ({
      mode: modeId,
      tax: this.modeTaxAssociations[modeId],
    }));

    console.log("productOptiontaxe", productOption.taxes);

    this.apiservice.addProductOption(productOption, this.selectedFile).subscribe(
      (response) => {
        console.log('Product option added successfully:', response);
        this.addToGroup(idgroupe, response._id, price, productOption.isDefault, response.image, response);
        // Handle success, e.g., show a success message or redirect
      },
      (error) => {
        console.error('Error adding product option:', error);
        // Handle error, e.g., show an error message
      }
    ); 
  }*/
    messageErrors: { [key: string]: string } = {};
    errorMessage: string | null = null;
    saveOption(productOption: any, idGroups: string): void {
      // Reset error messages
      this.messageErrors = {};
      this.errorMessage = null;
  
      // Check if a tax is selected for each mode
      let hasError = false;
      const selectedTaxes = this.ModeConsumation.map(mode => ({
        mode: mode.mode._id,
        tax: mode.selectedTax,
      }));
  
      for (const taxObj of selectedTaxes) {
        if (!taxObj.tax) {
          this.messageErrors[`mode_${taxObj.mode}`] = `Please select a tax for mode ${taxObj.mode}`;
          hasError = true;
        }
      }
  
      // If there are errors, stop the function execution
      if (hasError) {
        //this.errorMessage = 'Please fix the errors before proceeding.';
        this.showError("Please select a tax for mode")
        console.log(this.errorMessage);
        return;
      }
  
      const price = productOption.price;
      const idgroupe = idGroups;
      productOption.price = 0;
      productOption.taxes = selectedTaxes;
  
      console.log("productOptiontaxe", productOption.taxes);
  
      this.apiservice.addProductOption(productOption, this.selectedFile).subscribe(
        (response) => {
          console.log(' Option added successfully:', response);
          this.addToGroup(idgroupe, response._id, price, productOption.isDefault, response.image, response);
          this.showSuccess("Option added successfully");
        },
        (error) => {
          console.error('Error adding product option:', error);
          // Handle error, e.g., show an error message
        }
      );
    }
    
  addToGroup(groupId: string , optionId: string, optionPrice: number ,isDefault:boolean,image:string,option): void {
    // Vérifiez si un groupe d'option est sélectionné
    if (!groupId || !optionId) {
      return;
    }
  
    // Appelez la méthode addToGroup() du service ApiServices en passant l'ID du groupe
    this.apiservice.addOptionToGroup(groupId, optionId, optionPrice,isDefault).subscribe(
      (response: any) => {
       console.log(response);
       console.log(this.filteredOptionGroups);
       
        const groupeIndex = this.filteredOptionGroups.findIndex(groupe => groupe._id === groupId);

        // Update the products array of the corresponding category
        if (groupeIndex !== -1) {
          if (!this.filteredOptionGroups[groupeIndex].options) {
            this.filteredOptionGroups[groupeIndex].options = [];
          }
        console.log(image);
         
         const optiondata = {
           option:option,
          name:response.name,
          image:image,
          price:optionPrice           
                 
          };
          console.warn(optiondata);
                    this.filteredOptionGroups[groupeIndex].options.push(optiondata);
                    console.log(optionId);
                    console.log(   this.filteredOptionGroups[groupeIndex].options);
                    
                    console.log(    this.filteredOptionGroups[groupeIndex].options.findIndex(opt => opt.option === optionId));
                    const optionIndex =this.filteredOptionGroups[groupeIndex].options.findIndex(opt => opt.option === optionId)
                    //console.log(this.filteredOptionGroups[groupeIndex].options[optionIndex].option);
                    
                  //  this.optionGroups[groupeIndex].options[optionIndex].option.image.push(image);
                
        }
        // Gérez la réponse réussie
        console.log(response);
        this.showSuccess("option ajouté avec succés")

        // this.successMessage = 'Option added to group successfully.';
        // this.errorMessage = ''; // Réinitialisez le message d'erreur
      
      },
      (error: any) => {
        // Gérez l'erreur de réponse
        // this.successMessage = ''; // Réinitialisez le message de réussite
        // this.errorMessage = 'Failed to add option to group. Please try again.';
        console.error(error);
      },
      () => {
        console.log('addToGroup completed'); // Log message when the subscription is complete
      }
    );
  }
  onFileSelected(event: any): void {
    const fileInput = event.target;
  
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
    }
  }
  DeleteOptionFromGroupOption(groupeId,optionId)
  {
    this.apiservice.deleteOptionFromGroupsOption(groupeId,optionId).subscribe(
      
      (response)=> {
        const groupeIndex = this.optionGroups.findIndex(groupe => groupe._id === groupeId);
        if (groupeIndex !== -1) {
          this.optionGroups[groupeIndex].options = this.optionGroups[groupeIndex].options.filter(
            (option) => option._id !== optionId)
                 
        }
        console.log(response)
      },
       (error)=> {
        console.log(error)
      }
    )
  }
  openModfiyOptionsInGroupsOptions(modfiyOptionsInGroupsOption, option, groupeId) {
    console.log("option", option);
    this.selectedGroup = groupeId;
    this.selectedoption = { ...option, taxes: {} };

    // Initialize the selected taxes
    option.taxes.forEach(taxItem => {
      this.selectedoption.taxes[taxItem.mode] = taxItem.tax;
    });

    this.modalService.open(modfiyOptionsInGroupsOption, { size: 'sm' });
  }
  /*modifyOpionInGroupeOption(groupeId,optionId,price,isDefault)
  {
    console.log(groupeId);
    console.log(optionId);
    console.log(price);
    console.log(isDefault);
    
    this.apiservice.modifyOpionInGroupeOption(groupeId,optionId,price,isDefault).subscribe(
      (response)=>
      {
            console.log(response)
      },
      (error)=>
      {
        console.log(error)
      }
    )
  }*/
  getCheckedOptions(groupe): void {
    const checkedOptions = this.filteredOptions.filter(option => option.checked);

    // Extract prices and defaults from checked options
    const prices = checkedOptions.map(option => option.price);
    const defaults = checkedOptions.map(option => option.isDefault);
    const image = checkedOptions.map(option => option.image);
    for (let i = 0; i < checkedOptions.length; i++) {
      console.log('Checked Options:', checkedOptions[i]._id);
    console.log('Prices:', prices[i]);
    console.log('Defaults:', defaults[i]);
    this.addToGroup(groupe._id, checkedOptions[i]._id, prices[i], defaults[i],image[i],checkedOptions[i])
  }
    console.log('Checked Options:', checkedOptions);
    console.log('Prices:', prices);
    console.log('Defaults:', defaults);
  
    // Do something with the checked options, prices, and defaults
  }
  openAddGroupsOptionsInOptions( AddGroupsOptionsInOptions,option,groupeId)
  {
    this.selectedGroup=groupeId;
    this.selectedoption=option;
    this.modalService.open( AddGroupsOptionsInOptions,{size:'sm'})
  }
  addOptionGroupToOG(optionGroupId,parentOptionGroupId,optionId) {
   

    this.apiservice.addOptionGroupToOG(optionGroupId, parentOptionGroupId, optionId).subscribe(
      (response) => {
        console.log(response);
        const parentGroup = this.optionGroups.find(g => g._id === parentOptionGroupId);

        if (parentGroup) {
          // Find the option in the parent group
          const optionIndex = parentGroup.options.findIndex(o => o._id === optionId);
  
          if (optionIndex !== -1) {
            // Add the new option group ID to the 'subOptionGroup' array of the existing option
            parentGroup.options[optionIndex].subOptionGroup.push(response.updatedParentOptionGroup);
  
            // Fetch option groups (if needed)
            //this.fetchOptionGroups();
          }
        }
        // Handle success
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
  deleteSubOptionGroup(optionGroupId,optionId,subOptionGroupId) {
    this.apiservice.deleteSubOptionGroup(optionGroupId, optionId, subOptionGroupId)
      .subscribe(
        () => {
          console.log('SubOptionGroup deleted successfully');
          // Handle success, e.g., show a success message or update your component state
        },
        error => {
          console.error('Error deleting SubOptionGroup:', error);
          // Handle error, e.g., show an error message
        }
      );
  }
  selectedTaxes: any = {};
  openupdategroupe( updategroupe,groupe)
  {
    this.selectedGroup=groupe;
  console.log( "selectedGroup",this.selectedGroup);
  this.selectedTaxes = this.selectedGroup.taxes.reduce((acc, tax) => {
    acc[tax.mode] = tax.tax;
    return acc;
  }, {});
  console.log("selectedGroup", this.selectedGroup);
  console.log("selectedTaxes", this.selectedTaxes);
    this.modalService.open( updategroupe,{size:'lg'})
  }
  updateOptionGroup(): void {
    if (!this.selectedGroup) {
      return; // Check if an option is selected
    }
    this.selectedGroup.taxes = Object.keys(this.selectedTaxes).map(modeId => ({
      mode: modeId,
      tax: this.selectedTaxes[modeId]
    }));
    console.log('Updated group:', this.selectedGroup);
    const groupId = this.selectedGroup._id;
    const optionGroupData = {
      name: this.selectedGroup.name,
      description: this.selectedGroup.description,
      force_min: this.selectedGroup.force_min,
      force_max: this.selectedGroup.force_max,
      allow_quantity: this.selectedGroup.allow_quantity,
      taxes: this.selectedGroup.taxes 

    };
console.log("optionGroupData",optionGroupData)
    // Call the API service method to update the option group
    this.apiservice.updateOptionGroup(groupId, optionGroupData ).subscribe(
      (response: any) => {
        // Handle the successful response
        console.log('Option group updated successfully', response);
       this.showSuccess("Option group updated successfully")
        this.fetchOptionGroups(); // Refresh the option groups list
      },
      (error: any) => {
        // Handle the error response
        console.error('Error while updating option group', error);
       this.showError("Error while updating option group")
      }
    );
  }
  uploadAndResize() {
    this.imageCompress.uploadFile().then(
      (response: any) => {
        if (response && response.image) {
          this.image=response.image;
          const { image, orientation, fileName } = response;
          this.file = fileName;
          console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
          console.warn('Compressing and resizing to width 200px height 100px...');

          this.imageCompress.compressFile(image, orientation, 50, 50, 150, 150).then(
            (result: DataUrl) => {
              this.imgResultAfterResize = result;
              console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
              this.convertDataUrlToFile(this.imgResultAfterResize, this.file);
              console.warn(this.selectedFile);
         
            },
            (error) => {
              console.error('Error compressing image:', error);
            }
          );
        } else {
          console.error('No valid response from uploadFile');
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  convertDataUrlToFile(dataUrl: string, fileName: string): void {
    // Extract the base64 data from the Data URL
    const base64Data = dataUrl.split(',')[1];

    // Convert the base64 data to a Blob
    const blob = this.base64ToBlob(base64Data);

    // Create a file from the Blob
    const file = new File([blob], fileName, { type: blob.type });
    this.selectedFile = file;

    // Now, you have the file object that you can use as needed
    console.log(file);
  }

  private base64ToBlob(base64Data: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: 'image/png' }); // Adjust the type based on your data
  
  }
  uploadAndResizeUpdateoption(optionId,groupeId) {
    this.imageCompress.uploadFile().then(
      (response: any) => {
        if (response && response.image) {
          this.image=response.image;
          this.croppedImage = response; 
          const { image, orientation, fileName } = response;
          this.file = fileName;
          console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
          console.warn('Compressing and resizing to width 200px height 100px...');

          this.imageCompress.compressFile(image, orientation, 50, 50, 150, 150).then(
            (result: DataUrl) => {
              this.imgResultAfterResize = result;
              console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
              this.convertDataUrlToFile(this.imgResultAfterResize, this.file);
              console.warn(this.selectedFile);
              this.updateOptionImage(optionId,this.selectedFile,groupeId)
         
            },
            (error) => {
              console.error('Error compressing image:', error);
            }
          );

        } else {
          console.error('No valid response from uploadFile');
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

//   fileChangeEvent(event: any): void {
//     this.imageChangedEvent = event;
// }
// imageCropped(event: ImageCroppedEvent) {
//   this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
//   // event.blob can be used to upload the cropped image
// }
// imageLoaded(image: LoadedImage) {
//     // show cropper
// }
// cropperReady() {
//     // cropper ready
// }
// loadImageFailed() {
//     // show message
// }
updateOptionImage(optionId,image,groupeId): void {

    this.apiservice.updateOptionImage(optionId,image).subscribe(
      (response) => {
        const updatedGroupeIndex = this.optionGroups.findIndex(groupe =>  groupe._id === groupeId);
        console.log(updatedGroupeIndex)
            if (updatedGroupeIndex !== -1) {
            
              
           const updatedProduct = this.optionGroups[updatedGroupeIndex].options.find(option => option.option._id === optionId);
         updatedProduct.option.image=response.image
           
            }
        console.log('Image updated successfully:', response);
      },
      (error) => {
        console.error('Error updating image:', error);
      }
    );
  }
  validateInputLength() {
    if (this.optionGroup.name && this.optionGroup.name.length > 23) {
      // Return an error message
      return 'Input length should not exceed 23 characters.';
    }
    // Return null if validation passes
    return null;
  }
  //tax
  selectedtaxoption:any;
  selectedOption: boolean = true; 
  selectedOption2: boolean = false;
  show(){
    this.selectedOption=true
    this.selectedOption2=false
   }
   taxeoption: any[] = [];
   selectedMode: any = [];

   selectMode(mode: any): void {
    this.selectedMode = mode;
    console.log( "selectedModesssss",this.selectedMode)
  }
  modeTaxAssociations: { [modeId: string]: string } = {}; // Ajoutez cette ligne

  //update
  selectModeupdate(mode) {
    console.log(mode)
    this.selectedMode = mode;
    this.selectedoption.selectedTax = mode.selectedTax ? mode.selectedTax : null;
  }
  
  selectTaxupdate(taxId) {
    const selectedTax = this.taxeoption.find(tax => tax._id === taxId);
    if (this.selectedMode) {
      this.selectedMode.selectedTax = selectedTax;
    }
    this.selectedoption.selectedTax = selectedTax;
  }
  modifyOpionInGroupeOption(groupeId: string, optionId: string, price: number,name:string, isDefault: boolean) {
    // Vérifiez si this.selectedoption.taxes est défini et est un objet
    if (typeof this.selectedoption.taxes !== 'object' || this.selectedoption.taxes === null) {
      console.error('Selected taxes is not an object or is null/undefined:', this.selectedoption.taxes);
      return; // Quitte la fonction si les taxes sélectionnées ne sont pas un objet
    }
  
    // Convertissez l'objet de taxes en un tableau d'objets pour l'envoi au backend
    const selectedTaxes = Object.keys(this.selectedoption.taxes).map(mode => ({
      mode: mode,
      tax: this.selectedoption.taxes[mode]
    }));
  console.log("groupeId, optionId, price,name, isDefault, selectedTaxes",groupeId, optionId, price,name, isDefault, selectedTaxes)
    this.apiservice.modifyOpionInGroupeOption(groupeId, optionId, price,name, isDefault, selectedTaxes).subscribe(
      (response) => {
        console.log(response);
        this.showSuccess("Option  updated successfully");
        const groupe = this.optionGroups.find(group => group._id === groupeId);
        if (groupe) {
          const option = groupe.options.find(opt => opt._id === optionId);
          if (option) {
            option.price = price;
            option.name = name;
            option.isDefault = isDefault;
            option.taxes = selectedTaxes;
          }
        }      
               // Forcer la détection des changements
      this.cdr.detectChanges();  
      },
      (error) => {
        console.error('Error modifying option:', error);
        this.showError("Error while updating option ")
      }
    );
  }
  //
  getModeNameById(modeId: string): string {
    const mode = this.ModeConsumation.find(mode => mode.mode._id === modeId);
    return mode ? mode.mode.name : 'Unknown Mode';
  }

  getTaxRateById(taxId: string): number {
    const tax = this.taxeoption.find(tax => tax._id === taxId);
    return tax ? tax.rate : 0;
  }
  selectTax(modeId: string, taxId: string): void {
    if (!this.selectedoption) {
      this.selectedoption = {};
    }

    if (!this.selectedoption.taxes) {
      this.selectedoption.taxes = {};
    }

    this.selectedoption.taxes[modeId] = taxId;
    this.modeTaxAssociations[modeId] = taxId; // Update modeTaxAssociations
    console.log(this.selectedoption);
  }
  isSelectedTax(modeId: string, taxId: string): boolean {
    return this.selectedoption.taxes[modeId] === taxId;
  }

  //update groupe option
  selectTax2(modeId: string, taxId: string): void {
    this.selectedTaxes[modeId] = taxId;
    console.log(this.selectedTaxes);
  }

  isSelectedTax2(modeId: string, taxId: string): boolean {
    return this.selectedTaxes[modeId] === taxId;
  }
}
