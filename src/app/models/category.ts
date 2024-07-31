export interface Category {

     _id?: any;
    name: string;
    description:string;  
    parentCategory:string;
    image:string;
    storeId:string;  
    userId:string;
    subcategories:any [];
    products:any [];
    availabilitys:any[]
  }
