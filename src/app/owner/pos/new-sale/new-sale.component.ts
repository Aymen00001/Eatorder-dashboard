import { Component, OnInit } from '@angular/core';
import { ApiServices } from "../../../services/api"
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Order } from 'src/app/models/order';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({

  selector: 'app-new-sale',
  templateUrl: './new-sale.component.html',
  styleUrls: ['./new-sale.component.scss'],


})
export class NewSaleComponent implements OnInit {
  Categorys: any;
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  product: any;
  
  orders: any[] = [];
  selectedSize: string | null = null;
  selectedOptionGroups: any[] = [];
  currentOptionGroupIndex: number = 0;
  currentSizeIndex: number = 0;
  selectedOptions: any[] = [];
  isChecked: boolean = false;
  totale: any = 0;
  sizeprice: any;
  // order: any ={
  //   product:"",
  //   optiongroupe:[],
  //   size:''

  // }
  constructor(private api: ApiServices, private modalService: NgbModal) { }
  //  reset(){
  //   this.currentSizeIndex=0;
  //   this.currentOptionGroupIndex=0;
  //   this.selectedOptionGroups=null;
  //   this.selectedOptions=null;
  //   console.log(this.currentSizeIndex)
  //   console.log(this.currentOptionGroupIndex)
  //   console.log( this.selectedOptionGroups)
  //   console.log(this.selectedOptions)

  //  }

  ngOnInit(): void {
    if (localStorage.getItem('orders') !== null) {
      let value = localStorage.getItem("orders");
     // console.log(value);
     let oldorder = JSON.parse(value!);
     this.orders=oldorder;
    } 
    if(localStorage.getItem('totale')!== null)
    {
     
      
      this.totale=parseInt(localStorage.getItem("totale"))
    }
   

    this.fetchCategorys()
    //console.log(this.Categorys)
    //this.fetchProductsByCategory(this.Categorys._id)
  }
  getProductBystore() {
    this.api.getPoductByStore(this.api.getStore()).subscribe
      (
        Response => {
          this.product = Response
          // console.log(this.product);


        },
        error => {
          console.error(error);
        }

      );
  }
  fetchCategorys() {
    this.api.getCategoriesByStoreOnly(this.api.getStore()).subscribe(
      response => {
        this.Categorys = response.categories;
        console.log(this.Categorys[0]._id)
        this.fetchProductsByCategory(this.Categorys[0])
      },
      error => {
        console.error(error);
      }
    );
  }
  fetchProductsByCategory(category: any) {
    console.log(category)
    // Make an API call to fetch products for the selected category.
    this.api.getProductsByCategory(category._id).subscribe(
      (response) => {
        this.product = response;
        console.log(this.product)
        // Do something with the fetched products.
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onclick(product: any) {
    this.orders.push(product)
  }
  openSm(content, product) {
    this.selectedOptions = [];
    if (product.size.length == 0 && product.optionGroups.length == 0) {
      const existingProductIndex = this.orders.findIndex((orderProduct) => orderProduct.product._id === product._id);
      this.totale += product.price;
      if (existingProductIndex !== -1) {
        // If the product already exists, update its quantity
        this.orders[existingProductIndex].quantity += 1;
      } else {
        // If the product doesn't exist, add it to the orders array with quantity 1
        product.quantity = 1;
        const newOrder = {
          product: product,
          quantity :1,

        };
        localStorage.setItem("totale", (this.totale));
        this.orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(this.orders));
        console.log(this.orders)
      }
    }
    else {
      this.selectedSize = null;
      this.sizeprice = null;
      // this.reset();
      // console.log(product.size);

      this.modalService.open(content, { size: 'sm' });
    }

  }
  isOptionGroupFull(optionGroup: any): boolean {
    if (optionGroup.force_max) {
      const selectedOptionsCount = optionGroup.options.filter((option) => option.selected).length;
      // console.log(selectedOptionsCount)
      return selectedOptionsCount >= optionGroup.force_max;
    }

  }
  
  ischecked(isChecked) {
    if (isChecked == true) {
      // console.log('checkbox is checked');
      return true
    }
    else {
      // console.log('checkbox is unchecked');
      return false
    }

  }
  resetOptions(prod) {
    if (prod && prod.optionGroups.length > 0) {
      prod.optionGroups.forEach(optionGroup => {
        optionGroup.options.forEach(option => {
          option.selected = false;
        });
      });
    }
    else if (prod && prod.size) {
      prod.size.forEach(size => {
        size.optionGroups.forEach(optionGroup => {
          optionGroup.options.forEach(option => {
            option.selected = false;
          });
        });
      });
    }

  }
  filterOptionGroupsBySize(product, sizeName: string | null) {

    if (sizeName) {

      const selectedSizeObj = product.size.find((size) => size.name === sizeName);
      console.log(selectedSizeObj)
      this.sizeprice=selectedSizeObj.price
      if (selectedSizeObj) {
        this.currentSizeIndex++;
        this.selectedOptionGroups = selectedSizeObj.optionGroups;
        this.currentOptionGroupIndex = 0; // Reset the index when size changes
      } else {
        this.selectedSize = null;
        this.selectedOptionGroups = [];
      }
    } else {
      this.selectedSize = null;
      this.selectedOptionGroups = [];
    }
  }
  goToPreviousSize() {
    console.log(this.currentSizeIndex)
    if (this.currentSizeIndex > 0) {
      this.currentSizeIndex--;
      this.selectedSize = null; // Reset the selectedSize when changing sizes
    }
  }

  areMinimumOptionsSelected(product: any): boolean {
    if (product) {
      if (product.optionGroups.length > 0) {
        return this.checkMinimumOptions(product.optionGroups);
      } else if (product.size) {
        for (const size of product.size) {
          if (size.optionGroups) {
            if (!this.checkMinimumOptions(size.optionGroups)) {
              return false;
            }
          }
        }
      }
    }
    return true; // If there are no option groups, return true by default.
  }

  checkMinimumOptions(optionGroups: any[]): boolean {
    for (const optionGroup of optionGroups) {
      if (optionGroup.force_min > 0) {
        const selectedOptionsCount = optionGroup.options.filter(option => option.selected).length;
        if (selectedOptionsCount < optionGroup.force_min) {
          return false;
        }
      }
    }
    return true;
  }

  checkOptions(product: any) {
    const minimumOptionsSelected = this.areMinimumOptionsSelected(product);
    // You can use the `minimumOptionsSelected` boolean value as needed.
  }
  // valider(product: any, selectedOptions: any) {

  //   const newOrder = {
  //     product: product,
  //     optiongroupe: selectedOptions,
  //     size: this.selectedSize
  //   };
  // this.orders.push(newOrder)

  // }
  valider(product: any, selectedOptions: any) {
    // Check if there is an existing product with the same product._id and optiongroupe
    const existingProductIndex = this.orders.findIndex((orderProduct) => {
      
      return (
        orderProduct.product._id === product._id &&
        this.areOptionGroupesEqual(orderProduct.optiongroupe, selectedOptions)
        
      );
    });
console.log(this.orders);

    if (existingProductIndex !== -1) {
      // If the product with the same product._id and optiongroupe exists, update its quantity
      this.orders[existingProductIndex].quantity += 1;
      const optionGroupTotalPrice = selectedOptions.reduce((total, optionGroup) => {
       
        return total + (optionGroup.price || 0); // Replace 'price' with the correct property name in each optionGroup object
      }, 0);
      if(this.selectedSize)
      {
        this.totale+=product.price+optionGroupTotalPrice+this.sizeprice;
      }
      if(!this.selectedSize
       
        ){
          this.totale+=product.price+optionGroupTotalPrice;
        }
      localStorage.setItem("totale", (this.totale));
      localStorage.setItem("orders", JSON.stringify(this.orders));

      
    } else {
      const optionGroupTotalPrice = selectedOptions.reduce((total, optionGroup) => {
       
        return total + (optionGroup.price || 0); // Replace 'price' with the correct property name in each optionGroup object
      }, 0);
      // If the product doesn't exist with the same product._id and optiongroupe, add it to the orders array
      const newOrder = {
        product: product,
        optiongroupe: selectedOptions,
        size: this.selectedSize,
        quantity: 1,
        pricesize:this.sizeprice || null
      };
      if(!this.selectedSize
       
        ){
          this.totale+=product.price+optionGroupTotalPrice;
        }
        if(this.selectedSize)
        {
          this.totale+=product.price+optionGroupTotalPrice+this.sizeprice;
        }
        localStorage.setItem("totale", (this.totale));

      this.orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(this.orders));
   

this.sizeprice=null;

    }
  }
  areOptionGroupesEqual(optiongroupeA, optiongroupeB) {
    const sortedOptiongroupeA = optiongroupeA.slice().sort((a, b) => a._id.localeCompare(b._id));
    const sortedOptiongroupeB = optiongroupeB.slice().sort((a, b) => a._id.localeCompare(b._id));
    console.log(sortedOptiongroupeA);
    console.log(sortedOptiongroupeB);


    // Serialize the objects to JSON and compare them
    const optiongroupeAStr = JSON.stringify(sortedOptiongroupeA);
    const optiongroupeBStr = JSON.stringify(sortedOptiongroupeB);

    // Compare the JSON strings to check for equality
    return optiongroupeAStr === optiongroupeBStr;
  }
  updateSelectedOptions(selectedOption: any, selectedOptions: any[]) {

    if (selectedOption.selected) {
      selectedOptions.push(selectedOption);
    } else {
      const index = selectedOptions.findIndex(option => option._id === selectedOption._id);
      if (index !== -1) {
        selectedOptions.splice(index, 1);
      }
    }
  }

  addToCart(order: any) {
    // Find the order in the cart
    const index = this.orders.findIndex((ord) => ord === order);
  console.log(order);

    if (index !== -1) {
      if( ! this.orders[index].optiongroupe)
       {
        this.orders[index].quantity += 1;
        this.totale+=this.orders[index].product.price
        localStorage.setItem("totale", (this.totale));

  
        localStorage.setItem("orders", JSON.stringify(this.orders));
       }
       else
       {
        const optionGroupTotalPrice = this.orders[index].optiongroupe.reduce((total, optionGroup) => {
    
       
          return total + (optionGroup.price || 0); // Replace 'price' with the correct property name in each optionGroup object
        }, 0);
        if(this.orders[index].pricesize===null      
          ){
            this.orders[index].quantity += 1;
            this.totale+=this.orders[index].product.price+optionGroupTotalPrice
   
          }
         else if(this.orders[index].pricesize)
          {
            this.orders[index].quantity += 1;
            this.totale+=optionGroupTotalPrice+this.orders[index].pricesize;
          }
        // Increase the quantity by 1
     
        
        localStorage.setItem("totale", (this.totale));


        localStorage.setItem("orders", JSON.stringify(this.orders));
       }
     
      // Update the total

    }
  }
  
  removeFromCart(order: any) {
    // Find the order in the cart
    const index = this.orders.findIndex((ord) => ord=== order);

    if(!this.orders[index].optiongroupe)
    {
      if (index !== -1) {
        // Decrease the quantity by 1, and remove if it reaches 0
        if (this.orders[index].quantity > 1) {
          this.orders[index].quantity -= 1;
          this.totale-=this.orders[index].product.price
          localStorage.setItem("totale", (this.totale));

          localStorage.setItem("orders", JSON.stringify(this.orders));
        } else {
          this.totale-=this.orders[index].product.price
          this.orders.splice(index, 1);
          localStorage.setItem("totale", (this.totale));

          localStorage.setItem("orders", JSON.stringify(this.orders));
          
        }
      }
    }
    else
    {
      const optionGroupTotalPrice = this.orders[index].optiongroupe.reduce((total, optionGroup) => {
       
        return total + (optionGroup.price || 0); // Replace 'price' with the correct property name in each optionGroup object
      }, 0);
      console.log(optionGroupTotalPrice);
      
      if (index !== -1) {
        // Decrease the quantity by 1, and remove if it reaches 0
        if (this.orders[index].quantity > 1) {

          if(this.orders[index].pricesize==null ){
              this.orders[index].quantity -= 1;
              this.totale-=this.orders[index].product.price+optionGroupTotalPrice
     
            }
            else if(this.orders[index].pricesize)
            {
              this.orders[index].quantity -= 1;
              this.totale-=optionGroupTotalPrice+this.orders[index].pricesize

            }


 
          localStorage.setItem("totale", (this.totale));

          localStorage.setItem("orders", JSON.stringify(this.orders));
        } else {
          if(this.orders[index].pricesize==null)
          this.totale-=this.orders[index].product.price+optionGroupTotalPrice
       else{
        this.totale-=optionGroupTotalPrice+this.orders[index].pricesize
       }

    
          this.orders.splice(index, 1);
          localStorage.setItem("totale", (this.totale));
          localStorage.setItem("orders", JSON.stringify(this.orders));

          
        }
        // Update the total
  
      }
    }
   
  }
  clear()
  {
    localStorage.removeItem('totale');
    localStorage.removeItem('orders');
    this.orders=[]
    this.totale=0

    
  }

}
