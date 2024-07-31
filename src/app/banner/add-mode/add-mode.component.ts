import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-add-mode',
  templateUrl: './add-mode.component.html',
  styleUrls: ['./add-mode.component.scss']
})
export class AddModeComponent implements OnInit {
  taxForm: FormGroup;

  Categorys: any;
  ModeConsumation: any[];
  availabilitys: any[] = [];
  taxes: any[];;
  constructor( private apiservice: ApiServices,  private fb: FormBuilder, private http: HttpClient) {  this.taxForm = this.fb.group({});
}
  selectedImage: File | null = null;
  sizes: any[] = [];
  isPriceHidden= false
   productData = {
    name:"",
    description:"",
    availabilitys:[],
    price:null,   
    size:[],
    storeId:this.apiservice.getStore(),
    category: '',
    image:'',
    taxes:[],

  };
  checkedTaxes: { mode: string, tax: string }[] = [];
  checkCheckboxStatus() {
    this.ModeConsumation.forEach(consumationMode => {
      if(consumationMode.isChecked==undefined)
      {
        this.availabilitys.push({availability:false,mode:consumationMode.mode._id})
      console.log(`${consumationMode.mode.name}: false`);}
      
    else{
      {
        this.availabilitys.push({availability:consumationMode.isChecked,mode:consumationMode.mode._id})

      console.log(`${consumationMode.mode.name}:  ${consumationMode.isChecked}`);
    }
    }});
    console.log(this.availabilitys)
  }
  addSize() {
    this.sizes.push({name: '', price: null});
    this.isPriceHidden=true;
  }
  fetchConsumationModes(): void {
    this.apiservice.getConsumationModes(this.apiservice.getStore()).subscribe(
      (consumationModes) => {
        this.ModeConsumation=consumationModes;
        console.log(this.ModeConsumation)
        this.getAllTaxes();
       // this.populateModePrices(consumationModes);
      
      },
      (error) => {
        console.error('Error fetching consumation modes:', error);
      }
    );
    }
  removeSize(index: number) {
    this.sizes.splice(index, 1);
    if (this.sizes.length === 0) {
      this.isPriceHidden = false; // Show the "Last Name" input if there are no sizes
    }
  }
  addProduct() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('image', this.selectedImage, this.selectedImage.name);

      this.http.post('http://localhost:8000/owner/uploadImage', formData).subscribe(
        (imageResponse:any) => {
          // Handle successful image upload, response may contain image details
          console.log('Image uploaded successfully:', imageResponse);

          // Now, add the product data with the image details
          this.productData.size = this.sizes;
          this.productData.availabilitys=this.availabilitys;
          this.productData.taxes=this.checkedTaxes
          this.productData.image = imageResponse.imageURL; // Replace 'imageURL' with the actual key in your image response
          console.log(this.productData);

          this.apiservice.addProduct(this.productData).subscribe(
            (productResponse) => {
              console.log('Product added successfully:', productResponse);
             this.availabilitys=[];


            },
            (error) => {
              console.error('Error adding the product:', error);
              this.availabilitys=[];
            }
          );
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
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

  fetechCatrgory() {
    this.apiservice.getCategoriesByStoreOnly(this.apiservice.getStore()).subscribe(
      (response: any) => {
        this.Categorys = response.categories;
        //const Categorys = categories.map((categoryWithProducts) => categoryWithProducts.category.name);
         console.log(this.Categorys)
  
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
  }
  getAllTaxes(): void {
    this.apiservice.getTax(this.apiservice.getStore()).subscribe(
      data => {
        this.taxes = data.taxes.map(tax => ({ ...tax, isChecked: false }));
        this.ModeConsumation.forEach(mode => {
          mode.taxes = this.taxes.map(tax => ({ ...tax, isChecked: false }));
    
        });
      },
      error => {
        console.error('Error getting taxes:', error);
      }
    );
  }
  ngOnInit(): void {
    this.fetechCatrgory()
    this.fetchConsumationModes()
   
    
  }


}
