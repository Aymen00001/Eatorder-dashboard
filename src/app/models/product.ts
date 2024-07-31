export interface Product {

   _id: string;
    name: string;
    description:string;  
    price:number;
    storeId:string,
    image:string;
    category:any;  
    optionGroups:any[];
    size:any[];
    taxes:any[];
  }
