import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { OptionGroup } from 'src/app/models/optionGroupe';
import { Product } from 'src/app/models/product';
import { ProductOption } from 'src/app/models/productOption';
import { ToastService } from 'src/app/owner/menu-setup/toast-service';
import { ApiServices } from 'src/app/services/api';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgxImageCompressService, DataUrl } from 'ngx-image-compress';

@Component({
  selector: 'app-menu-setup',
  templateUrl: './menu-setup.component.html',
  styleUrls: ['./menu-setup.component.scss']
})
export class MenuSetupComponent implements OnInit {
  isHovered = false;
  showerror: string;

  showOverlay() {
    this.isHovered = true;
  }

  hideOverlay() {
    this.isHovered = false;
  }
  ModeConsumation: any[];
  availabilitys: any[] = [];
  taxes: any[];
  //image
  //baseUrl='https://api.eatorder.fr'
  baseUrl='https://server.eatorder.fr:8000/combined-uploads/'

 // baseUrl = 'http://localhost:8000/'
  categorys: Category[] = [];
  selectedCategory:Category
  name: any
  description: any
  products: any;
  hidden: boolean = false;
  hiddenaddcategory: boolean = false;
  hiddenaddproduct: boolean = false;
  isPriceHidden: boolean = true;
  hiddenupdateProduct: boolean = false;
  sizes: any[] = [];
  default:boolean;
  productData = {
    name: "",
    description: "",
    availabilitys:[],
    price: null,
    size: [],
    storeId: this.apiservice.getStore(),
    category: '',
    image: '',
    taxes:[],
    optionGroups:[],
    tags:[],


  };
  id: any;
  selectedFile: any;
  category: Category = {
    name: "",
    description: "",
    parentCategory: "",
    image: "",
    availabilitys: [],
    storeId: this.apiservice.getStore(),
    userId: null,
    subcategories: [],
    products: [],

  }
  user: any;
  selectedProduct: any;
  searchTerm: string = ''; // Assurez-vous que cette ligne est ajoutée
  filteredOptionGroups: OptionGroup[] = [];
  optionGroups: OptionGroup[] = [];
  optionProduct: ProductOption[] = [];
  filteredOptions: ProductOption[] = [];
  successMessage: string;
  errorMessage: string;
  groupe: any;
  showaddoption: boolean=true;
  productOption: any = {
    name: '',        // Initialize the name property with an empty string or default value
    price: 0,        // Initialize other properties accordingly
    tax: 0,
    unite: '',
    isDefault: false,
    image: null,
   store:this.apiservice.getStore(),

  };
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
  imageFile: File;
  idMenu: any;
  checkedTaxes: { mode: string, tax: string }[] = [];
  categoryId: any;
   tabsData = [
    { id: 'primaryhome', icon: 'bx-home', title: 'Home', content: '...' },
    { id: 'primaryprofile', icon: 'bx-user-pin', title: 'Profile', content: '...' },
    { id: 'primarycontact', icon: 'bx-microphone', title: 'Contact', content: '...' },
  ];
  imgResultAfterResize: DataUrl = '';
  file = '';

  image: any;
  addSizeupdateproduct() {
    this.selectedProduct.size.push({ name: '', price: null });

  }
  removeSizeupdateproduct(index: number) {
    this.selectedProduct.size.splice(index, 1);
  }

  constructor(private modalService: NgbModal, private apiservice: ApiServices, private http: HttpClient,private toastService: ToastService,private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    this.fetchConsumationModes()
    this.user = this.apiservice.getUser()


   // this.fetchCategorys();
    this.fetchOptionGroups()
    this.getMenuByStore();
    this.getalltags();
  }
  getMenuByStore()
  {
    this.apiservice.getMenuByStore(this.apiservice.getStore()).subscribe(
      (response)=>{
       // console.log(response);
        this.idMenu=response[0]._id
        this.categorys= response[0].categorys;
        console.warn(this.categorys);
        console.log(this.categorys);  
      },
      error =>  { console.error(error);}
    )
  }
  fetchCategorys() {
    this.apiservice.getCategoriesByStoreOnly(this.apiservice.getStore()).subscribe(
      response => {
        this.categorys = response.categories;
        console.log(this.categorys)
      },
      error => { console.error(error);}
    );
  }
  fetchProductsByCategory(category: any) {
    category.userId = this.user._id
    // Make an API call to fetch products for the selected category.
    this.apiservice.getProductsByCategory(category._id).subscribe(
      response => {
        this.products = response;
        console.log(this.products)
      },
      (error) => { console.error(error); }
    );
  }
  updateCategory(categoryId: string, name: string, description: string) {
    const categoryData = new FormData();
    categoryData.append('name', name);
    categoryData.append('description', description);
    for (const [key, value] of categoryData.entries()) {
      console.log(`${key}: ${value}`);
    }
   // categoryData.append('image',this.selectedFile)
    this.apiservice.updateCategory(categoryId, name,description).subscribe(
      (response) => {
        console.log(response);
        const categoryIndex = this.categorys.findIndex((category) => category._id === categoryId);
        // Update the category properties in the array
        if (categoryIndex !== -1) {
          this.categorys[categoryIndex].name = name;
          this.categorys[categoryIndex].description = description;
         // this.categorys[categoryIndex].image=response.category.image;
        }
        this.hidden = !this.hidden;
        // console.log('Category updated successfully:', response);
        // Handle success, show a success message, or perform other actions
      },
      (error) => { console.error('Error updating category:', error); }
    );
  }
  openupdate(category) {
    this.hidden = true;
    this.id = category._id;
    this.name = category.name;
    this.description = category.description;

  }
  // openupdateProduct(product) {
  //   this.hiddenupdateProduct = true;
  //   console.log(product);
  //   this.selectedProduct = product;
  //   console.log(this.selectedProduct)
  // }
  // Annuler() {
  //   this.hidden = !this.hidden
  // }
  // Annulerupdateproduct() {
  //   this.hiddenupdateProduct = !this.hiddenupdateProduct

  // }
  // showaddcategory() {
  //   this.hiddenaddcategory = !this.hiddenaddcategory;
  // }
  // showaddproduct() {
  //   this.hiddenaddproduct = !this.hiddenaddproduct;
  // }
  add() {
    this.checkCheckboxStatus()
    this.category.userId = this.user._id
    this.category.availabilitys=this.availabilitys;
    const file = this.selectedFile;
   // console.log(this.category.availabilitys);
    // Vérification des mots de passe correspondants
    this.apiservice.addCategory(this.category, file).subscribe(
      response => {
        this.showSuccess("categorie ajouté avec succés")  
        console.log(response.category);
        // console.log(this.category);
        this.categorys.push(response.category); // Assuming the API returns the added category in the response
        this.category = {
          name: "",
          description: "",
          parentCategory: "",
          image: "",
          availabilitys: [],
          storeId: this.apiservice.getStore(),
          userId: null,
          subcategories: [],
          products: [],
      
        }
        this.availabilitys=[];
      //   for (let i = 0; i < this.ModeConsumation.length; i++) {
      //     this.ModeConsumation[i].isChecked = false;
      // }
       // this.ModeConsumation=[]
       // console.log(this.availabilitys)
        // Gérer la réponse de succès
        // console.log(response);

      },
      error => {
        // Gérer les erreurs
        if (error.error && error.error.message) {
          console.error(error.error.message);
        } else {
          console.error('An error occurred during login.');
        }
      }
    );
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    console.log(  this.selectedFile);
  }
  deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.apiservice.deleteCategory(categoryId).subscribe(
        (response: any) => {
          // console.log('Category deleted successfully');
          // Optionally, navigate to a different route after successful deletion
          this.categorys = this.categorys.filter(category => category._id !== categoryId);
          // console.log(categoryId);
          this.showSuccess("Category deleted successfully.");

        },
        (error: any) => { console.error('Error deleting category:', error);
          this.showError("Error deleting category.");

        }
      );
    }
  }
  addSize() {
    this.sizes.push({ name: '', price: null });
    this.isPriceHidden = false;
  }
  removeSize(index: number) {
    this.sizes.splice(index, 1);
    if (this.sizes.length === 0) {this.isPriceHidden = true;   }
  }
  addSizeupdate() {
    this.selectedProduct.size.push({ name: '', price: null });
    this.isPriceHidden = false;
  }
  removeSizeupdate(index: number) {
    this.selectedProduct.size.splice(index, 1);
    if (this.sizes.length === 0) {
      this.isPriceHidden = true; 
    }
  }

  validateInputLength() {
    if (this.productData.name && this.productData.name.length > 29) {
      return 'Input length should not exceed 29 characters.';
    }
    return null;
  }
  addProduct(categoryid) {
 if (this.productData.name.length<30) 
 {  this.checkCheckboxStatus();this.checkCheckedTaxes();this.getCheckedItems();
    this.productData.category = categoryid;
    //console.log("hhhh")
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post('https://server.eatorder.fr:8000/owner/uploadImage', formData).subscribe(
        (imageResponse: any) => {
          // Handle successful image upload, response may contain image details
       //   console.log('Image uploaded successfully:', imageResponse);

          // Now, add the product data with the image details
          this.productData.size = this.sizes;
          this.productData.availabilitys=this.availabilitys;
          this.productData.taxes=this.checkedTaxes;
          this.productData.image = imageResponse.imageURL;// Replace 'imageURL' with the actual key in your image response
          this.productData.tags = this.selectedtags;
             console.log(this.productData);

          this.sizes.unshift({ name: 'standard', price:  this.productData.price });
          console.log(this.productData);

         this.apiservice.addProduct(this.productData).subscribe(
            (productResponse) => {
            //  console.log('Product added successfully:', productResponse);
              const categoryIndex = this.categorys.findIndex(category => category._id === categoryid);
              this.showSuccess("produit ajouté avec succés")
              // Update the products array of the corresponding category
              if (categoryIndex !== -1) {
                if (!this.categorys[categoryIndex].products) {
                  this.categorys[categoryIndex].products = [];
                }
                this.categorys[categoryIndex].products.push(productResponse);
              }
              this.hiddenaddproduct = !this.hiddenaddproduct;
              this.productData = {
                name: "",
                description: "",
                availabilitys:[],

                price: null,
                size: [],
                storeId: this.apiservice.getStore(),
                category: '',
                image: '',
                taxes:[],
                optionGroups:[],
                tags:[]


              };
              this.checkedTaxes=[]
              this.availabilitys=[];
              this.sizes = [];
              this.selectedtags=[]
             // this.getMenuByStore();

            },
            (error) => {
              this.showError("Error adding the product")
              console.error('Error adding the product:', error);
              this.productData = {
                name: "",
                description: "",
                availabilitys:[],

                price: null,
                size: [],
                storeId: this.apiservice.getStore(),
                category: '',
                image: '',
                taxes:[],
                optionGroups:[],
                tags:[]


              };
              this.checkedTaxes=[]
              this.availabilitys=[];
              this.sizes = [];
              this.selectedtags=[]
            }
          );
        },
        (error) => {
          this.productData = {
            name: "",
            description: "",
            availabilitys:[],

            price: null,
            size: [],
            storeId: this.apiservice.getStore(),
            category: '',
            image: '',
            taxes:[],
            optionGroups:[],
            tags:[]
          };
          this.checkedTaxes=[]
          this.availabilitys=[];
          this.sizes = [];
          this.selectedtags=[]
          this.showError("Error adding the product")
          console.error('Error uploading image:', error);
        }
      );
    }
    else{
      this.productData = {
        name: "",
        description: "",
        availabilitys:[],

        price: null,
        size: [],
        storeId: this.apiservice.getStore(),
        category: '',
        image: '',
        taxes:[],
        optionGroups:[],
        tags:[]


      };
      this.showError("selecte image");
      this.checkedTaxes=[]
              this.availabilitys=[];
              this.sizes = [];
              this.selectedtags=[]
    }}
    else{
      this.showerror="name must be under 29 caractere "
    }
  }
  deleteProduct(prod: Product): void {
    // Show confirmation dialog/modal if needed
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.apiservice.deleteProduct(prod._id).subscribe(
        () => {
          const categoryIndex = this.categorys.findIndex(category => category._id === prod.category);

          if (categoryIndex !== -1) {
            const productIndex = this.categorys[categoryIndex].products.findIndex(p => p._id === prod._id);

            if (productIndex !== -1) {
              // Remove the product from the category's products array
              this.categorys[categoryIndex].products.splice(productIndex, 1);
            }
          }
          this.showSuccess("Product deleted successfully.");

        },
        (error) => {
          console.error(error);
          // Handle error scenario
          this.showError("Error deleting Product.");

        }
      );
    }
  }

  updateProduct(selectedProduct) {
    //selectedProduct.size=this.size;
    console.log(selectedProduct);

    console.log(selectedProduct.tags);
    //console.log(selectedProduct.image);
   //console.log(selectedProduct.category);

    this.apiservice.updatePorduct(selectedProduct._id, selectedProduct.name, selectedProduct.description, selectedProduct.price, selectedProduct.storeId, selectedProduct.category, selectedProduct.size,selectedProduct.tags).subscribe
      (
        Response => {
          if (Response.imageURL) { selectedProduct.image = Response.imageURL;
           // console.log(selectedProduct.image)
      }
         // this.hiddenupdateProduct = !this.hiddenupdateProduct;
          console.log(Response)
        },
        error => {  console.error(error);
        });
  }
  searchOptionGroups(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm) {
      this.filteredOptionGroups = this.optionGroups.filter(
        (group: OptionGroup) =>
          group.name.toLowerCase().includes(searchTerm) ||
          group.description.toLowerCase().includes(searchTerm)
      );
    } else {
      this.filteredOptionGroups = [...this.optionGroups];
    }

  }
  fetchOptionGroups() {
    this.apiservice.getOptionGroups(this.apiservice.getStore()).subscribe(
      response => {
        this.optionGroups = response.optionGroups;
        this.optionGroups = response.optionGroups.map((group: OptionGroup) => ({
          ...group,
          checked: false 
        }));
        // console.log(this.optionGroups)
        this.filteredOptionGroups = this.optionGroups;
      },
      error => { console.error(error);}
    );
  }
  handleDragStart(event: any, optionGroupId: string): void {
    event.dataTransfer.setData('text/plain', optionGroupId);
  }
  handleDragOver(event: any): void { event.preventDefault(); }
  handleDrop(event: any, Product: any, sizeId: any): void {
    event.preventDefault();
    const optionGroupId = event.dataTransfer.getData('text/plain');
    //console.log(sizeId);
   // console.log(sizeId);
    const size = Product.size.find((s) => s._id === sizeId);
   // console.log(size)
    if (size) {
      const optionGroup = this.optionGroups.find((group) => group._id === optionGroupId);
    //  console.log(optionGroup)
      if (optionGroup) {
        size.optionGroups.push(optionGroup);
        this.addOptionGroupToSize(Product._id, sizeId, optionGroupId)
      }
    }
  }
  handleDroptosize(event: any, Product: any, sizeId: any): void {
    event.preventDefault();
    const optionGroupId = event.dataTransfer.getData('text/plain');
    //console.log(sizeId);
    //console.log(sizeId);
    // Find the size within the product's sizes array by its ID
    const size = Product.size.find((s) => s._id === sizeId);
   // console.log(size)
    if (size) {
      // Find the dropped option group by its ID
      const optionGroup = this.optionGroups.find((group) => group._id === optionGroupId);
    //  console.log(optionGroup)
      if (optionGroup) {
        // Add the option group to the size's optionGroups array
        size.optionGroups.push(optionGroup);

        // Update the size on the server by calling the API
        this.addOptionGroupToSize(Product._id, sizeId, optionGroupId)
      }
    }
  }
  addOptionGroupToSize(productId: string, sizeId: string, optionGroupId: string) {
    this.apiservice.addOptionGroupToSize(productId, sizeId, optionGroupId)
      .subscribe(
        (response) => {
          console.log('Option group added successfully:', response);
          // Handle success, update UI, etc.
        },
        (error) => {
          console.error('Error adding option group:', error);
          // Handle error, display error message, etc.
        }
      );
  }
  deleteOptionGroup(productId: string, sizeId: string, optionGroupId: string, event: Event) {
   // console.log(productId)
    //console.log(sizeId)
    //console.log(optionGroupId)
    this.apiservice.deleteOptionGroups(productId, sizeId, optionGroupId).subscribe(
      (response) => {
        console.log('Option group deleted successfully:', response);
        this.showSuccess("Option group deleted successfully.");

        // Handle success, update UI, etc.
        // Perform any additional actions after successful removal
        const element = (event.target as HTMLElement).parentElement;
        if (element) {
          element.style.display = 'none';
        }
      },
      (error) => {
        console.error('Error deleting option group:', error);
        // Handle error, display an error message, etc.
        this.showError("Error deleting option group.");

      }
    );
  }
  handleDroptocatgory(event: any, Category: any): void {
    event.preventDefault();
    const optionGroupId = event.dataTransfer.getData('text/plain');
    const optionGroup = this.optionGroups.find((group) => group._id === optionGroupId);
   // console.log(optionGroup)
    Category.products.forEach(product => {
      product.optionGroups.push( optionGroup)})
this.addOptionGroupToCategory(Category._id,optionGroupId)

  }
  handleDroptoproduct(event: any, Product: any): void {
    event.preventDefault();
    const optionGroupId = event.dataTransfer.getData('text/plain');

    // Find the size within the product's sizes array by its ID

    // Find the dropped option group by its ID
    const optionGroup = this.optionGroups.find((group) => group._id === optionGroupId);
   // console.log(optionGroup)
    if (optionGroup) {
      Product.optionGroups.push(optionGroup);
      this.addOptionGroupToproudect(Product._id, optionGroupId, optionGroup)

    }
  }
  addOptionGroupToproudect(productId: string, optionGroupId: string, optionGroupData: any): void {
    this.apiservice.addOptionGroupToProduct(productId, optionGroupId, optionGroupData)
      .subscribe(
        response => {
          console.log('Option group added successfully', response);
          this.showSuccess("Option group added successfully.");

        },
        error => {
          console.error('Error adding option group', error);
          this.showError("Error adding option group.");

        }
      );
  }
  deleteOptionGroupFromProduct(productId: string, optionGroupId: string, event: Event) {
    this.apiservice.deleteOptionGroupsFromProduct(productId, optionGroupId).subscribe(
      (response) => {
        console.log('Option group deleted successfully:', response);
        this.showSuccess("Option group deleted successfully.");

        // Handle success, update UI, etc.
        // Perform any additional actions after successful removal
        const element = (event.target as HTMLElement).parentElement;
        if (element) {
          element.style.display = 'none';
        }
      },
      (error) => {
        console.error('Error deleting option group:', error);
        this.showError("Error deleting option group.");

        // Handle error, display an error message, etc.
      }
    );
  }
  openScrollableContent(longContent,groupes) {
    this.groupe=groupes;
    // this.getOptions(groupes.options);
    this.getOptionsByStoreId(groupes.options)
    this.showaddoption =true;
    this.modalService.open(longContent, { scrollable: true });
  }
  deleteDuplicatesFromArray1(array1: any[], array2: any[]): any[] {
    const array2Ids = array2.map(item => item.option);
    const filteredArray1 = array1.filter(item => !array2Ids.includes(item._id));
    return filteredArray1;
  }
  getOptions(optiongroupe): void {
    this.apiservice.getOptions(String(this.user._id)).subscribe(
      (response: any) => {
        const options = response.options;
        this.optionProduct = response.options;
      this.filteredOptions= this.deleteDuplicatesFromArray1(options,optiongroupe);
      },
      (error: any) => {
        // Handle any errors
        console.error(error);
      }
    );
  }
  getOptionsByStoreId(optiongroupe): void {
    this.apiservice.getOptionsByStoreId(this.apiservice.getStore()).subscribe(
      (response: any) => {
        const options = response;
        this.optionProduct = response;
      this.filteredOptions= this.deleteDuplicatesFromArray1(options,optiongroupe)
      },
      (error) => { console.error('Error fetching options:', error); }
    );
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
   getCheckedOptions(groupe): void {
    const checkedOptions = this.filteredOptions.filter(option => option.checked);
    const prices = checkedOptions.map(option => option.price);
    const defaults = checkedOptions.map(option => option.isDefault);
    for (let i = 0; i < checkedOptions.length; i++) {
    this.addToGroup(groupe._id, checkedOptions[i]._id, prices[i], defaults[i])
  }
  }
  addToGroup(groupId: string , optionId: string, optionPrice: number ,isDefault:boolean): void {
    if (!groupId || !optionId) {
      return;
    }
      this.apiservice.addOptionToGroup(groupId, optionId, optionPrice,isDefault).subscribe(
      (response: any) => {
        const groupeIndex = this.optionGroups.findIndex(groupe => groupe._id === groupId);
        if (groupeIndex !== -1) {
          if (!this.optionGroups[groupeIndex].options) {
            this.optionGroups[groupeIndex].options = [];
          }
         const optiondata = {
           option:optionId,
          name:response.name,
          price:optionPrice           
                 
          };
         this.optionGroups[groupeIndex].options.push(optiondata);
        }
        this.showSuccess("option ajouté avec succés")
        this.successMessage = 'Option added to group successfully.';
        this.errorMessage = ''; 
      
      },
      (error: any) => {
        this.successMessage = ''; 
        this.errorMessage = 'Failed to add option to group. Please try again.';
        console.error(error);
      },
      () => {
        console.log('addToGroup completed'); 
      }
    );
  }
  removeOptionFromGroup(groupId: string, optionId: string): void {
    const confirmRemove = confirm('Are you sure you want to remove this option from the group?');
    if (confirmRemove ) {
      this.apiservice.removeOptionFromGroup(groupId, optionId).subscribe(
        () => {
          console.log('Option removed successfully');
          this.showSuccess("Option removed successfully.");
        const groupIndex = this.filteredOptionGroups.findIndex(group => group._id === groupId);
        if (groupIndex !== -1) {
          // Find the option within the group
          const optionIndex = this.filteredOptionGroups[groupIndex].options.findIndex(option => option.option === optionId);
          if (optionIndex !== -1) {
            // Remove the option locally
            this.filteredOptionGroups[groupIndex].options.splice(optionIndex, 1);

            console.log('Option removed from the local array:', this.filteredOptionGroups[groupIndex].options);
          }
        }
        },
        (error) => {
          console.error(error);
          this.showError("Error Option removed .");
        }
      );
    }
  }
  showAddOption()
  {  this.showaddoption =!this.showaddoption; }
  saveOption(productOption: any, idGroups): void {
    const price=productOption.price;
    const idgroupe=idGroups;
    productOption.price=0;
    this.apiservice.addProductOption(productOption, this.selectedFile).subscribe(
      (response) => {
        console.log('Product option added successfully:', response);
       this.addToGroup(idgroupe,response._id,price,productOption.isDefault);
       this.showSuccess("Product option added successfully.");
      },
      (error) => {
        console.error('Error adding product option:', error);
        this.showError("Error adding product option.");
      }
    );
  }
  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
    }
  }
  openupdateproduct(updateproduct,product)
  {
    this.selectedProduct=product;
    this.selectedFile=this.selectedProduct.image
    this.imgURL=this.baseUrl+this.selectedProduct.image
   //console.log(this.selectedProduct); 
    this.modalService.open(updateproduct,{size:'lg'})
  }
  openupdatecategory(updatecategory,category) {
    this.selectedCategory=category;
    console.warn(category)
    // this.imageCompress.compressFile(category.image, ).then(
    //   (result: DataUrl) => {
    //     this.image= result;
    //     console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
      
    //     console.warn(this.selectedFile);
   
    //   },
    //   (error) => {
    //     console.error('Error compressing image:', error);
    //   }
    // );
  
    //console.log( this.image)
    this.modalService.open(updatecategory, { size: 'lg' });
  }
  openLg(content) {
    const videavailabilitys: any[] = [];
    for (let i = 0; i < this.ModeConsumation.length; i++) {
        this.ModeConsumation[i].isChecked = false;
     }

this.availabilitys =videavailabilitys;
    this.modalService.open(content, { size: 'lg' });
  }
  addOptionGroup(): void {
    this.optionGroup.userId = this.user._id;
  this.optionGroup.storeId= this.apiservice.getStore();
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
          this.selectedFile = null;
          this.fetchOptionGroups();
          this.showSuccess("option Groupe ajouté avec succés")
        },
        error => {
          console.error('Une erreur est survenue lors de la création du groupe d\'options', error);
          // Gérer l'erreur de création du groupe d'options
        }
      );
  }
  showSuccess(msg) {
    this.toastService.show(`${msg}`, { classname: 'bg-success text-light', delay: 3000 });
  }
  showError(msg) {
    this.toastService.show(`${msg}`, { classname: 'bg-danger text-light', delay: 5000 });
  }
  changeCategoryIndex(menuId,oldIndex,newIndex) {
    this.apiservice.changeCategoryIndex(menuId, oldIndex, newIndex).subscribe(
      response => {
        console.log('Success:', response);
        this.showSuccess("Change Success.");
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
  dropCategory(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categorys, event.previousIndex, event.currentIndex);
    this.changeCategoryIndex( this.idMenu,event.previousIndex,event.currentIndex)
  }
  addOptionGroupToOption(optionGroupId: string, parentOptionGroupId: string, optionId: string): void {
    this.apiservice.addOptionGroupToOption(optionGroupId, parentOptionGroupId, optionId)
      .subscribe(
        response => {
          console.log('Success:', response);
        },
        error => { console.error('Error:', error);  }
      );
  }
  fetchConsumationModes(): void {
    this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
      (consumationModes) => {
        this.ModeConsumation=consumationModes;
        console.log(   this.ModeConsumation)
        this.getAllTaxes();      
      },
      (error) => {
        console.error('Error fetching consumation modes:', error);
      }
    );
    }
  checkCheckboxStatus() {
    this.ModeConsumation.forEach(consumationMode => {
      if(consumationMode.isChecked==undefined)
      {
        this.availabilitys.push({availability:false,mode:consumationMode.mode._id})
      console.log(`${consumationMode.mode.name}: false`);} 
    else{
      {
        this.availabilitys.push({availability:consumationMode.isChecked,mode:consumationMode.mode._id})
    //  console.log(`${consumationMode.mode.name}:  ${consumationMode.isChecked}`);
    }
    }});
    //console.log(this.availabilitys)
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
  }
  getAllTaxes(): void {
    this.apiservice.getTax(this.apiservice.getStore()).subscribe(
      data => {
        this.taxes = data.taxes.map(tax => ({ ...tax, isChecked: false }));
        this.ModeConsumation.forEach(mode => {
          mode.taxes = this.taxes.map(tax => ({ ...tax, isChecked: false }));
        });
      },
      error => {  console.error('Error getting taxes:', error);}
    );
  }
  openAddGroupeOption(content,groupeoption) {
    this.optionGroups=groupeoption;
    this.modalService.open(content, { size: 'lg' });
  }
 openModalAddProduct(addproduct,idcategory)
 {  this.checkedTaxes=[]
  this.availabilitys=[];
  this.sizes = [];
  this.selectedtags=[];
  this.imgResultAfterResize=null;
  this.imgURL="";
  const videavailabilitys: any[] = [];
      for (let i = 0; i < this.ModeConsumation.length; i++) {
          this.ModeConsumation[i].isChecked = false; }
  this.availabilitys =videavailabilitys;
  this.categoryId=idcategory;
  this.modalService.open(addproduct, { size: 'lg' });
 }
 public imagePath;
 imgURL: any;
 preview(files) {
  if (files.length === 0)
    return;
  var mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
   return;
  }
  var reader = new FileReader();
  this.imagePath = files;
  reader.readAsDataURL(files[0]); 
  reader.onload = (_event) => { 
    this.imgURL = reader.result; 
  }
  //console.log(this.imagePath);
  //console.log(this.imagePath[0].size);
 // console.log(files[0]);
  this.selectedFile=files[0]

}
toggleAvailability(productId,modeId,availabilitys:any) {
  this.apiservice.toggleAvailability(productId, modeId).subscribe(
    (response) => {
      console.log('Availability toggled successfully', response);
     availabilitys.availability=response.etat;
    // console.log( availabilitys.availability)
    },
    (error) => {
      console.error('Error toggling availability', error);
      // Handle error, display error message, etc.
    }
  );
}
toggleAvailabilityCategory(categoryId,modeId,availabilitys:any) {
  this.apiservice.toggleAvalabilityCategory(categoryId, modeId).subscribe(
    (response) => {
      console.log('Availability toggled successfully', response);
     availabilitys.availability=response.etat;
    },
    (error) => {
      console.error('Error toggling availability', error);
      // Handle error, display error message, etc.
    }
  );
}
toggleAvailabilityglobale(product: any): void {
  this.apiservice.toggleAvailabilityGLobal(product._id).subscribe(
    (updatedProduct) => {
      console.log('Product availability toggled successfully', updatedProduct);
           product.availability=!product.availability
    },
    (error) => {
      console.error('Error toggling product availability', error);
    }
  );
}
toggleAvailabilityglobalecategory(category: any): void {
  this.apiservice.toggleAvailabilityGLobalCategory(category._id).subscribe(
    (updatedCategory) => {
      console.log('Category availability toggled successfully', updatedCategory);
           category.availability=!category.availability
    },
    (error) => {
      console.error('Error toggling category availability', error);
    }
  );
}
duplicateProduct(productId):void{
  console.log(productId)
  this.apiservice.duplicateProduct(productId).subscribe(
    (Response)=>{
      console.log('Product duplicated successfully',Response);
       const categoryIndex = this.categorys.findIndex(category => category._id === Response.duplicatedProduct.category);
              this.showSuccess("Product duplicated successfully")
              if (categoryIndex !== -1) {
                if (!this.categorys[categoryIndex].products) {
                  this.categorys[categoryIndex].products = [];
                }
                this.categorys[categoryIndex].products.push(Response.duplicatedProduct);
              }
    },
    (error)=>
    {
      console.log('Error while duplicate product',error);
      this.showError("Error while duplicate product.");

    }
  )
}
updateChecked(checkboxItem: any) {
  //console.log("1"+checkboxItem.checked);
  checkboxItem.checked = !checkboxItem.checked;
 // console.log("2"+checkboxItem.checked); 
}
getCheckedItems() {
 // console.log("here" +JSON.stringify(this.optionGroup))
  const checkedItems = this.optionGroups.filter(item => item.checked);
  const checkedIds = checkedItems.map(item => item._id);
 // console.log('Checked Items:', checkedIds);
  this.productData.optionGroups=checkedIds
}
openviewproduct(viewproduct,product) {
  this.selectedProduct=product;
  // this.getOptions(groupes.options);
  this.modalService.open(viewproduct,{  size: 'xl',scrollable: true });
}
dropoptionGroups(product,event: CdkDragDrop<string[]>) {
  moveItemInArray(product.optionGroups, event.previousIndex, event.currentIndex);
  this.changeIndex(product._id,event.previousIndex,event.currentIndex)
}
changeIndex(productId,oldIndex,newIndex) {
  this.apiservice.changeOptionGroupIndex(productId, oldIndex, newIndex).subscribe(
    (response) => {
      console.log('Index changed successfully', response);
      // Handle success, if needed
    },
    (error) => {
      console.error('Error changing index', error);
      // Handle error, if needed
    }
  );
}
addOptionGroupToCategory(categoryId,optionGroupId) {
  this.apiservice.addOptionGroupToCategory(categoryId, optionGroupId).subscribe(
    response => console.log(response),
    error => console.error(error)
  );
}
onChangeOptionGroupIndex(productId: string, sizeIndex: number, oldIndex: number, newIndex: number): void {
  this.apiservice.changeSizeOptionGroupIndex(productId, sizeIndex, oldIndex, newIndex).subscribe(
    (response) => {
      console.log(response); // Handle success response
    },
    (error) => {
      console.error(error); // Handle error response
    }
  );

}
dropoptionGroupssize(product,sizeIndex,event: CdkDragDrop<string[]>) {
  moveItemInArray(product.size[sizeIndex].optionGroups, event.previousIndex, event.currentIndex);
  this.onChangeOptionGroupIndex(product._id,sizeIndex,event.previousIndex,event.currentIndex)
}
/*uploadAndResize() {
  this.imageCompress.uploadFile().then(
    (response: any) => {
      if (response && response.image) {
        this.image=response.image;
        const { image, orientation, fileName } = response;
        console.warn(orientation);
        const imgElement = new Image();
        imgElement.src = image;
        imgElement.onload = () => {
          // Original width and height of the image
          const originalWidth = imgElement.width;
          const originalHeight = imgElement.height;
          console.warn('Original Width:', originalWidth);
          console.warn('Original Height:', originalHeight);
          const Width=originalWidth;
          const Height=originalHeight;
          if(originalWidth>=250){
        const Width=250;
        const Height=(Width/originalWidth)*originalHeight;
       // console.log(Width);
       // console.log(Height);
      }
      //console.log(Width);
     // console.log(Height);
       
 
   
        this.file = fileName;
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
        console.warn('Compressing and resizing to width 200px height 100px...');

        this.imageCompress.compressFile(image, orientation, 50, 50, Width, Height).then(
          (result: DataUrl) => {
            this.imgResultAfterResize = result;
            console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
            this.convertDataUrlToFile(this.imgResultAfterResize, this.file);
            console.warn(this.selectedFile);
       
          },
          (error) => {
            console.error('Error compressing image:', error);
          }
        ); }
      } else {
        console.error('No valid response from uploadFile');
      }
    },
    (error) => {
      console.error('Error uploading file:', error);
    }
  );
}*/
uploadAndResize() {
  this.imageCompress.uploadFile().then(
    (response: any) => {
      if (response && response.image) {
        this.image = response.image;
        const { image, orientation, fileName } = response;
        console.warn(orientation);
        const imgElement = new Image();
        imgElement.src = image;
        imgElement.onload = () => {
          // Original width and height of the image
          const originalWidth = imgElement.width;
          const originalHeight = imgElement.height;
          console.warn('Original Width:', originalWidth);
          console.warn('Original Height:', originalHeight);

          if (originalWidth > 50 || originalHeight > 50) {
            console.error('Image dimensions exceed the maximum allowed size of 50x50.');
            this.errorMessage = 'Image dimensions exceed the maximum allowed size of 50x50.';
            this.showError("Image dimensions exceed the maximum allowed size of 50x50")
            return;
          } else {
            this.errorMessage = ''; // Clear any previous error messages
          }

          const width = originalWidth > 250 ? 250 : originalWidth;
          const height = (width / originalWidth) * originalHeight;

          this.file = fileName;
          console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
          console.warn('Compressing and resizing to fit within 50x50...');

          this.imageCompress.compressFile(image, orientation, 50, 50, width, height).then(
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
        };
      } else {
        console.error('No valid response from uploadFile');
      }
    },
    (error) => {
      console.error('Error uploading file:', error);
    }
  );
}

uploadAndResizeproduct() {
  this.imageCompress.uploadFile().then(
    (response: any) => {
      if (response && response.image) {
        this.image = response.image;
        const { image, orientation, fileName } = response;
        console.warn(orientation);
        const imgElement = new Image();
        imgElement.src = image;
        imgElement.onload = () => {
          // Original width and height of the image
          const originalWidth = imgElement.width;
          const originalHeight = imgElement.height;
          console.warn('Original Width:', originalWidth);
          console.warn('Original Height:', originalHeight);

          if (originalWidth > 300 || originalHeight > 300) {
            console.error('Image dimensions exceed the maximum allowed size of 300x300.');
            this.errorMessage = 'Image dimensions exceed the maximum allowed size of 300x300.';
            this.showError("Image dimensions exceed the maximum allowed size of 300x300")
            return;
          } else {
            this.errorMessage = ''; // Clear any previous error messages
          }

          const width = originalWidth > 250 ? 250 : originalWidth;
          const height = (width / originalWidth) * originalHeight;

          this.file = fileName;
          console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
          console.warn('Compressing and resizing to fit within 50x50...');

          this.imageCompress.compressFile(image, orientation, 50, 50, width, height).then(
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
        };
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
 // console.log(file);
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
  return new Blob(byteArrays, { type: 'image/png' }); 
} 
uploadAndResizeUpdateCategory(categoryId){
  this.imageCompress.uploadFile().then(
    (response: any) => {
      if (response && response.image) {
        this.image=response.image;
        const { image, orientation, fileName } = response;
        console.warn(orientation);
        const imgElement = new Image();
        imgElement.src = image;
        imgElement.onload = () => {
          // Original width and height of the image
          const originalWidth = imgElement.width;
          const originalHeight = imgElement.height;
          console.warn('Original Width:', originalWidth);
          console.warn('Original Height:', originalHeight);
        let Width =0
        let Height=0
          if(originalWidth>=250){
             Width=250;
              Height=(Width/originalWidth)*originalHeight;
      
     
      }  else{
         Width=originalWidth;
         Height=originalHeight;
      }
     // console.log(Width);
    //  console.log(Height);
        this.file = fileName;
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
        console.warn('Compressing and resizing to width 200px height 100px...');

        this.imageCompress.compressFile(image, orientation, 50, 50, Width, Height).then(
          (result: DataUrl) => {
            this.imgResultAfterResize = result;
            console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
            this.convertDataUrlToFile(this.imgResultAfterResize, this.file);
            console.warn(this.selectedFile);
            this.updateCategoryImage(categoryId,this.selectedFile)
       
          },
          (error) => {
            console.error('Error compressing image:', error);
          }
        );}
      } else {
        console.error('No valid response from uploadFile');
      }
    },
    (error) => {
      console.error('Error uploading file:', error);
    }
  );

}
uploadAndResizeUpdateProduct(productId,categorieId){
  this.imageCompress.uploadFile().then(
    (response: any) => {
      if (response && response.image) {
        this.image=response.image;
        const { image, orientation, fileName } = response;
        console.warn(orientation);
        const imgElement = new Image();
        imgElement.src = image;
        imgElement.onload = () => {
          // Original width and height of the image
          const originalWidth = imgElement.width;
          const originalHeight = imgElement.height;
          console.warn('Original Width:', originalWidth);
          console.warn('Original Height:', originalHeight);
        let Width =0
        let Height=0
          if(originalWidth>=250){
             Width=250;
              Height=(Width/originalWidth)*originalHeight;
      }  else{
         Width=originalWidth;
         Height=originalHeight;
      }
        this.file = fileName;
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
        console.warn('Compressing and resizing to width 200px height 100px...');

        this.imageCompress.compressFile(image, orientation, 50, 50, Width, Height).then(
          (result: DataUrl) => {
            this.imgResultAfterResize = result;
            console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
            this.convertDataUrlToFile(this.imgResultAfterResize, this.file);
            console.warn(this.selectedFile);
            this.updateProductImage(productId,this.selectedFile,categorieId)
            
          },
          (error) => {
            console.error('Error compressing image:', error);
          }
        );}
      } else {
        console.error('No valid response from uploadFile');
      }
    },
    (error) => {  console.error('Error uploading file:', error); }
  );
}
uplode()
{
  const formData = new FormData();
formData.append('image', this.selectedFile);
  this.http.post('https://server.eatorder.fr:8000/owner/uploadImage', formData).subscribe(
    (imageResponse: any) => {
      console.log('Image uploaded successfully:', imageResponse);
    },
    (error) => {
      console.error('Error uploading image:', error);
      // Log the specific error details from the HttpErrorResponse
      if (error instanceof HttpErrorResponse) {
        console.error('Status:', error.status);
        console.error('Response body:', error.error);
      }
    }
  );
}
updateCategoryImage(categoryId: string, image: File): void {
  this.apiservice.updateCategoryImage(categoryId, image).subscribe(
    (response) => {
      console.log('Category updated successfully', response);
      const updatedCategory = this.categorys.find(category => category._id === categoryId);
      if (updatedCategory) {updatedCategory.image = response.image;}
    },
    (error) => { console.error('Error updating category', error);}
  );
}
updateProductImage(productId: string,image:File,categorieId:string): void {
    this.apiservice.updateProductImage(productId, image).subscribe(
      (response) => {
        console.log('Image updated successfully:', response);
        this.showSuccess("Image updated successfully");
        const updatedCategoryIndex = this.categorys.findIndex(category =>  category._id === categorieId);
   // console.log(updatedCategoryIndex)
        if (updatedCategoryIndex !== -1) {
       const updatedProduct = this.categorys[updatedCategoryIndex].products.find(product => product._id === productId);
     updatedProduct.image=response.image
        }
        
      },
      (error) => {
        console.error('Error updating image:', error);
        this.showError("Error updating image");
      }
    );
 
}
//Tags
tags:any=[]
getalltags(){
  const storeId = localStorage.getItem('storeid');
  this.apiservice.getalltags(storeId).subscribe((response:any)=>{
    this.tags = response;    
       console.log(response)
       
  },
(error)=>{
  console.error('Error  Tag:', error)
})
}

selectedtags: any[] = []; 
onCheckboxChange(tagsId: string) {
  if (this.selectedtags.includes(tagsId)) {
    this.selectedtags = this.selectedtags.filter(id => id !== tagsId);
  } else { this.selectedtags.push(tagsId); }
  console.log("selectedtags",this.selectedtags)
}
isChecked(tagsId: string): boolean {
  return this.selectedtags.includes(tagsId);
}
isChecked2(tagId: string): boolean {
  return this.selectedProduct.tags.includes(tagId);
}

onCheckboxChange2(tagId: string): void {
  if (this.selectedProduct.tags.includes(tagId)) {
    // Si le tag est déjà sélectionné, le retirer de la liste des tags sélectionnés
    this.selectedProduct.tags = this.selectedProduct.tags.filter(id => id !== tagId);
  } else {
    // Sinon, ajouter le tag à la liste des tags sélectionnés
    this.selectedProduct.tags.push(tagId);
  }
}

//drag and drop 
dropProduct(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.category.products, event.previousIndex, event.currentIndex);
}
drop(event: CdkDragDrop<string[]>, category: any): void {
  moveItemInArray(category.products, event.previousIndex, event.currentIndex);
  // Mettez à jour l'ordre des produits dans la base de données si nécessaire
}

dropoptionGroups2(product: any, event: CdkDragDrop<string[]>): void {
  moveItemInArray(product.optionGroups, event.previousIndex, event.currentIndex);
  // Mettez à jour l'ordre des groupes d'options dans la base de données si nécessaire
}

dropoptionGroupssize2(product: any, index: number, event: CdkDragDrop<string[]>): void {
  moveItemInArray(product.size[index].optionGroups, event.previousIndex, event.currentIndex);
  // Mettez à jour l'ordre des groupes d'options dans les tailles dans la base de données si nécessaire
}

handleDragOver2(event: DragEvent): void {
  event.preventDefault();
}

handleDroptoproduct2(event: DragEvent, product: any): void {
  event.preventDefault();
  // Gérer le drop pour les produits
}

handleDroptosize2(event: DragEvent, product: any, sizeId: string): void {
  event.preventDefault();
  // Gérer le drop pour les tailles de produits
}

toggleAvailabilityglobale2(product: any): void {
  product.availability = !product.availability;
  // Mettez à jour la disponibilité du produit dans la base de données
}

}
