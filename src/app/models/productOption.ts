export interface ProductOption {
  _id?: string;
  name: string;
  price: number;
  tax?: number;
  isDefault?: boolean;
  promoPercentage?: number;
  unite: string;
  image: string;
  userId: number;
  optionGroups: string[]; // Updated property: array of strings
  isPromoChecked: boolean; // Add this property
  checked: boolean; // Add this line
taxes:[];

}

