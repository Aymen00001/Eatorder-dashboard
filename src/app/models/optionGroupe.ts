

export interface OptionGroup {
  _id?: string;
  name: string;
  options: any[];
  description: string;
  image?: string;
  userId: number;
  storeId:string;
  force_max:number;
  force_min:number;
  allow_quantity:Boolean;
  checked: boolean; 
  taxes:any[],



}
