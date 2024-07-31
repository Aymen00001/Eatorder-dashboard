import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { User } from '../models/user';
import { OptionGroup } from '../models/optionGroupe';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store} from 'src/app/models/store'
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root'
})
export class ApiServices {
  private apiUrlCurency = 'https://api.exchangerate.host/symbols';
 // private baseUrl = 'http://localhost:8000'; // L'URL de votre serveur Node.js
//private baseUrl = 'http://192.168.1.103:8000'; // L'URL de votre serveur Node.js

 //private  baseurlyassine ='https://api.eatorder.fr'
 //private  baseurlyassine ='https://api.eatorder.fr'
 
// private  baseurlyassine='https://server.eatorder.fr:8000'
 //private baseUrl = 'https://server.eatorder.fr:8000'; // L'URL de votre serveur Node.js

private  baseurlyassine='https://server.eatorder.fr:8000'
private baseUrl = 'https://server.eatorder.fr:8000'; 
//private baseUrl='https://api.eatorder.fr'

  private tokenKey = 'jwt_token';
  private userKey = 'user';
  private ownerData = {
    firstName:"",
    lastName: "",
    email: "",
    password: "",
    phoneNumber:"",
    role: "",
    sexe:"",
  };
  iddate: Date;
  roleAs:string;
  idstore: string;
  orders:any;
  constructor(private http: HttpClient,private router: Router) { }
  addCategory(category ,file) {
    const formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('name',category.name);
    formData.append('description',category.description);
    formData.append('availabilitys', JSON.stringify(category.availabilitys));
    formData.append('userId',category.userId);
    formData.append('storeId',category.storeId);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.baseUrl+'/owner/addCategory', formData, { headers })
  }
  getPoductByStore(storeId: string) {
    const url = `${this.baseUrl}/owner/getProductsByStore/${storeId}`;
    return this.http.get<any>(url);
  }
  getCategoriesByStore(storeId: string) {
    const url = `${this.baseUrl}/owner/getCategoriesByStore/${storeId}/details`;
    return this.http.get<any>(url);
  }
  getCategoriesByStoreOnly(storeId: string) {
    const url = `${this.baseUrl}/owner/getCategoriesByStoreOnly/${storeId}`;
    return this.http.get<any>(url);
  }
  changeStatusOrder(orderId: string ,statusch ): Observable<any> {
    const body = { status: statusch };
    return this.http.put<any>(`${this.baseUrl}/owner/changestatusorder/${orderId}`, body);
  }
  getRole() {
    this.roleAs = localStorage.getItem('role');
    return this.roleAs;
  }
  getStore() {
    this.idstore = localStorage.getItem('storeid');
    return this.idstore;
  }
  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/owner/allorders` );
  }
  getFinishedOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/owner/finishedorders` );
  }
  getInProgressOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/owner/inprogressorders` );
  }
  getPendingOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/owner/pendingorders` );
  }
  verification(ownerId: number): Observable<any> {
    const body = { verifid: true };
    return this.http.put<any>(`${this.baseUrl}/admin/verification/${ownerId}`, body);
  }
  resetPassword( password: string ,ownerId :String , token : string) : Observable<any> {
    const body = { password };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/admin/resetPassword/${ownerId}`, body , { headers });
  }
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(this.baseUrl+'/admin/login', body);
  }
  sendVerification(ownerId: string): Observable<any> {
    const body = { ownerId, };
    return this.http.post<any>(`${this.baseUrl}/admin/sendVerification/${ownerId}`, body);
  }
  forgetPassword(email: string): Observable<any> {
    const body = { email, };
    return this.http.post<any>(this.baseUrl+'/admin/forgetPassword', body);
  }
  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
  getUser(): User {
    const userJson = localStorage.getItem(this.userKey);
    return JSON.parse(userJson!) as User;
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/auth/sign-in');
  }
  getTotalOwners(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/admin/getOwners`, { headers });
  }
  getStoresOwner(ownerId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/owner/stores/${ownerId}`, { headers })  .pipe(map(response=> {
      if(response){
         return Object.values(response);
       }
       return []; 
   }));
  }
  getOwners(startIndex: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/admin/getOwners?startIndex=${startIndex}&pageSize=${pageSize}`, { headers });
  }
  disableOwner(ownerId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { status: 'suspended' };
    return this.http.put<any>(`${this.baseUrl}/admin/suspendOwner/${ownerId}`, body, { headers });
  }
  enableOwner(ownerId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { status: 'active' };
    return this.http.put<any>(`${this.baseUrl}/admin/reactivateOwner/${ownerId}`, body, { headers });
  }
  getOwnerName(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/admin/getOwnerName/${storeId}`;
    return this.http.get<any>(url, { headers });
  }
  updateProfile(firstName: string, lastName:string, phoneNumber: string, token:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const profileData = { firstName,lastName, phoneNumber };
    return this.http.put(this.baseUrl+ '/admin/updateAdminProfile', profileData,{ headers });
  }
  getStores(currentPage: number, pageSize: number, selectedStatus: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const startIndex = (currentPage - 1) * pageSize;
    let apiUrl = `${this.baseUrl}/admin/getAllStores`;
    if (selectedStatus !== 'all') {
      apiUrl = `${this.baseUrl}/admin/${selectedStatus}Stores`;
    }
    return this.http.get<any>(`${apiUrl}?startIndex=${startIndex}&pageSize=${pageSize}`, { headers });
  }
  fetchOwnersNames(filteredRestaurants: any[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const requests: Observable<any>[] = [];
    filteredRestaurants.forEach((restaurant: any) => {
      const storeId = restaurant._id;
      const apiUrl = `${this.baseUrl}/admin/getOwnerName/${storeId}`;
      const request = this.http.get<any>(apiUrl, { headers }).pipe(
        map((response: any) => {
          restaurant.ownerName = response.ownerName;
        })
      );
      requests.push(request);
    });
    return forkJoin(requests);
  }
  disableStore(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {}; 
    return this.http.put<any>(`${this.baseUrl}/admin/suspendStores/${storeId}`, body, { headers });
  }
  activateStore(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {}; 
    return this.http.put<any>(`${this.baseUrl}/admin/activateStore/${storeId}`, body, { headers });
  }
  getPendingStores(currentPage: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const startIndex = (currentPage - 1) * pageSize;
    return this.http.get<any>(`${this.baseUrl}/admin/pendingStores?startIndex=${startIndex}&pageSize=${pageSize}`, { headers });
  }
  approveStore(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/admin/approveStore/${storeId}`, null, { headers });
  }
  rejectStore(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/admin/rejeterStore/${storeId}`, null, { headers });
  }
  getRejectedStores(currentPage: number, pageSize: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const startIndex = (currentPage - 1) * pageSize;
    return this.http.get<any>(`${this.baseUrl}/admin/rejectedStores?startIndex=${startIndex}&pageSize=${pageSize}`, { headers });
  }
  deleteStore(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/admin/deleteOwner/${storeId}`, { headers });
  }
  deleteOwner(ownerId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/admin/deleteOwner/${ownerId}`, { headers });
  }
  addOwner(ownerData) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(this.baseUrl+'/admin/addOwner', ownerData, { headers })
  }
  uploadImage(file: File, userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('userId', String(userId)); 
    return this.http.post<any>(`${this.baseUrl}/admin/upload`, formData, { headers });
  }
  uploadImageProfil(file: File, userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('userId', String(userId)); 
    return this.http.post<any>(`${this.baseUrl}/admin/uploadIamgeProfil/${userId}`, formData, { headers });
  }
  getImages(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/admin/images/${userId}`, { headers });
  }
  getAllImages(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any> (`${this.baseUrl}/Allimages`, { headers });
  }
  deleteFile(userId: number, fileName: string) {
    const url = `${this.baseUrl}/admin/deleteFile/${userId}/${fileName}`;
    return this.http.delete(url);
  }
  addOptionGroup(optionGroup: OptionGroup): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/addOptionGroups`;
    const formData = new FormData();
    formData.append('name', optionGroup.name);
    formData.append('options', JSON.stringify(optionGroup.options));
    formData.append('description', optionGroup.description);
    formData.append('storeId', optionGroup.storeId);
    formData.append('force_min', optionGroup.force_min.toString());
    formData.append('force_max', optionGroup.force_max.toString());
    formData.append('allow_quantity', optionGroup.allow_quantity.toString());
    formData.append('taxes',  JSON.stringify(optionGroup.taxes));
    return this.http.post<any>(url, formData, { headers });
  }
  removeOptionGroup(productId: string, optionGroupId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/products/${productId}/optionGroups/${optionGroupId}`;
    return this.http.delete(url);
  }
  getOptionGroups(storeId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/owner/getOptionGroups/${storeId}`, { headers });
  }
  addOptionGroupsToProduct(productId: string, optionGroupId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/${productId}/optionGroups/${optionGroupId}`;
    return this.http.post(url, {headers});
  }
  getProduct(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/owner/getProducts/${productId}`, { headers });
  }
  deleteOptionGroup(groupId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/owner/optionGroups/${groupId}`, { headers });
  }
  addOption(optionData: any, ownerId: number, imageFile: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    Object.keys(optionData).forEach(key => {
      if (Array.isArray(optionData[key])) {
        formData.append(key, JSON.stringify(optionData[key]));
      } else {
        formData.append(key, optionData[key]);
      }
    });
    formData.append('ownerId', ownerId.toString());
    formData.append('image', imageFile);
    return this.http.post<any>(`${this.baseUrl}/owner/addOptions`, formData, { headers });
  }
  getOptions(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/owner/getOptions/${userId}`, { headers });
  }
  getOptionById(optionId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/options/${optionId}`, { headers });
  }
  deleteOption(optionId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/owner/deleteOptions/${optionId}`, { headers });
  }
  updateOption(optionId: string, optionData: any, imageFile: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const formData = new FormData();
      for (const key in optionData) {
      if (optionData.hasOwnProperty(key)) {
        formData.append(key, optionData[key]);
      }}
      formData.append('image', imageFile);
    return this.http.put<any>(`${this.baseUrl}/owner/updateOption/${optionId}`, formData, { headers });
  }
  addToGroup(groupId: string, optionId: string, optionPrice: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/affectOptionToGroup/${groupId}/options/${optionId}`;
    const body = { price: optionPrice, groupId: groupId }; 
    return this.http.post(url, body, { headers });
  }
  addOptionToGroup(groupId: string, optionId: string, optionPrice: number ,isDefault:boolean): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/affectOptionToGroup/${groupId}/options/${optionId}`;
    const body = { price: optionPrice, default:isDefault }; 
    return this.http.post(url, body, { headers });
  }
  getOptionPrice(groupId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/optionGroups/${groupId}/optionPrices`;
    return this.http.get<any>(url, { headers });
  }
  removeOptionFromGroup(groupId: string, optionId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/desaffecteroptionGroups/${groupId}/options/${optionId}`;
    return this.http.delete(url, { headers });
  }
  getOptionGroupById(groupId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/getOptionGroupById/${groupId}`;
    return this.http.get<any>(url, { headers });
  }
  updatePorduct(productId, name, description, price, storeId, category, size,tags): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { productId, name, description, price, storeId, category, size: JSON.stringify(size) ,tags: JSON.stringify(tags)}
    return this.http.put<any>(`${this.baseUrl}/owner/updateProduct/${productId}`, body, { headers });
  }
  deleteCategory(categoryId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/categories/${categoryId}`;
    return this.http.delete<any>(url);
  }
  deleteCategoryWithProduct(categoryId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/categoriesWithProduct/${categoryId}`;
    return this.http.delete<any>(url);
  }
  updateCategory(categoryId: string, name: string, description: string) {
    const categoryData = { name, description };
    const url = `${this.baseUrl}/owner/updateCategory/${categoryId}`;
    return this.http.put<any>(url, categoryData);
  }
  addSubcategoryToCategory(categoryId: string, subcategoryId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/category/${categoryId}/add-subcategory`;
    const body = { subcategoryId };
    return this.http.post<any>(url, body);
  }
  getCategoryById(categoryId: string): Observable<Category> {
    const url = `${this.baseUrl}/owner/category/${categoryId}`;
    return this.http.get<Category>(url);
  }
  deleteSubcategory(categoryId: string, subcategoryId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/category/${categoryId}/delete-subcategory/${subcategoryId}`;
    return this.http.delete(url);
  }
  addTax(name: string, rate: number,storeId): Observable<any> {
    const body = { name, rate,storeId };
    return this.http.post<any>(`${this.baseUrl}/owner/addTax`, body);
  }
  getAllTax(page?: number, limit?: number,store?:string): Observable<any> {
    const storeId =store;
    const params = { page: page ? page.toString() : '1', limit: limit ? limit.toString() : '5' };
    return this.http.get<any>(`${this.baseUrl}/owner/getAllTax/${storeId}`, { params });
  }
  getTax(store:string): Observable<any> {
    const storeId =store;    
    return this.http.get<any>(`${this.baseUrl}/owner/getTaxbystore/${storeId}` );
  }
  getTaxById(taxId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/getTax/${taxId}`;
    return this.http.get<any>(url);
  }
  deleteTax(taxId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/owner/deleteTax/${taxId}`);
  }
  updateTax(taxId: string, name: string, rate: number): Observable<any> {
    const url = `${this.baseUrl}/owner/updateTax/${taxId}`;
    const body = { name, rate };
    return this.http.put<any>(url, body);
  }
  addTaxToProduct(productId: string, taxId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/product/${productId}/addTax/${taxId}`;
    return this.http.post<any>(url, {});
  }
  addTaxToCategory(categoryId: string, taxId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/addTaxToCategory/${categoryId}/${taxId}`;
    return this.http.post(url, null);
  }
  updateAvailability(productId): Observable<any> {
    const url = `${this.baseUrl}/owner/update/${productId}`;
    return this.http.put<any>(url,{});
  }
  getStoreDetails(storeId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/${storeId}/consumation-modes`; 
    return this.http.get(url);
  }
  getConsumationModes(storeId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/stores/${storeId}/consumation-modes`;
    return this.http.get(url);
  }
  toggleConsumationModeEnabled(storeId: string, modeId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/stores/${storeId}/consumation-modes/${modeId}/toggle`;
    return this.http.put(url, {});
  }
  getOptionInGroupe(groupId: string, optionId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/optionGroups/${groupId}/options/${optionId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(url, { headers });
  }
  deleteProduct(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/owner/deleteproduct/${productId}`);
  }
  updateOptionInGroup(groupId: string, optionId: string, optionData: any, imageFile?: File): Observable<any> {
    const formData: FormData = new FormData();
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    formData.append('name', optionData.name);
    formData.append('price', optionData.price);
    formData.append('tax', optionData.tax);
    formData.append('isDefault', optionData.isDefault.toString());
    formData.append('unite', optionData.unite.toString());
    formData.append('promoPercentage', optionData.promoPercentage ? optionData.promoPercentage.toString() : '');
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }
    return this.http.put<any>(`${this.baseUrl}/owner/optionGroups/${groupId}/options/${optionId}`, formData, { headers });
  }
  updateOptionGroup(groupId: string, optionGroupData: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('name', optionGroupData.name);
    formData.append('description', optionGroupData.description);
    formData.append('force_max', optionGroupData.force_max);
    formData.append('force_min', optionGroupData.force_min);
    formData.append('allow_quantity', optionGroupData.allow_quantity);
    formData.append('taxes', JSON.stringify(optionGroupData.taxes));
console.log(optionGroupData.taxes)
    const url = `${this.baseUrl}/owner/modifyOptionGroup/${groupId}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(url, formData, { headers });
  }
  getAllCurrencies() {
    return this.http.get<any>(this.apiUrlCurency);
  }
  updateAcceptedCurrencies(storeId: string, acceptedCurrencies: string[]): Observable<any> {
    const body = { acceptedCurrencies };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/owner/addAcceptedCurrencies/${storeId}`;
    return this.http.post<any>(url, body, { headers });
  }
  addConsumationMode(consumationModeData:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/owner/addConsumationModes`, consumationModeData);
  }
  addProd(productData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/owner/addprod`, productData);
  }
  getCategoriesByStoresOnly(storeId: string, page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/owner/getCategoriesByStoreOnly/${storeId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(url, { params });
  }
  getProductsByStore(storeId: string, page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/owner/getProductsByStore/${storeId}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(url, { params });
  }
  deleteConsumationMode(modeId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/consumation-modes/${modeId}`;
    return this.http.delete(url);
  }
  getProductById(productId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/api/products/${productId}`;
    return this.http.get(url);
  }
  getProductsById(productId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/api/products/${productId}`;
    return this.http.get<any>(url);
  }
  getOptionGroupsWithSizes(productId: string): Observable<any[]> {
    const url = `${this.baseUrl}/owner/api/products/${productId}/option-groups-with-sizes`;
    return this.http.get<any[]>(url);
  }
  addOptionGroupToSize(productId: string, sizeId: string, optionGroupId: string) {
    const url = `${this.baseUrl}/owner/api/products/${productId}/size/${sizeId}/option-groups`;
    const body = { optionGroupId: optionGroupId };
    return this.http.post(url, body);
  }
  deleteOptionGroups(productId: string, sizeId: string, optionGroupId: string) {
    const url = `${this.baseUrl}/owner/products/${productId}/size/${sizeId}/optionGroup/${optionGroupId}`;
    return this.http.delete(url);
  }
  addStore(ownerId: string, name: string, address: string, phoneNumber: string, description: string): Observable<any> {
    const body = { ownerId, name, address, phoneNumber, description };
    return this.http.post(`${this.baseUrl}/owner/addStores`, body );
  }
  addProduct(productData: any) {
    const url = `${this.baseUrl}/owner/addproduct`; 
    return this.http.post(url, productData);
  }
getProductsByCategory(categoryId:any){
  const url = `${this.baseUrl}/owner/ProductsByCategory/${categoryId}`;
  return this.http.get(url);
  }
  addOptionGroupToProduct(productId: string, optionGroupId: string, optionGroupData: any): Observable<any> {
    const url = `${this.baseUrl}/owner/addOptionGroupToProudect/${productId}/addOptionGroup/${optionGroupId}`;
    return this.http.post(url, { optionGroupData });
  }
  deleteOptionGroupsFromProduct(productId: string, optionGroupId: string) {
    const url = `${this.baseUrl}/owner/products/${productId}/optionGroups/${optionGroupId}`;
    return this.http.delete(url);
  }
  getMenuByStore(storeId:string)
  {const url =`${this.baseUrl}/owner/getMenuByStore/${storeId}`;
    return this.http.get(url);
  }
  addBanner(storeId: string, bannerData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/owner/stores/${storeId}/banners`, bannerData);
  }
  getBannerImages(storeId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/owner/stores/${storeId}/banners/images`);
  }
  addProductOption(productOption: any, image: File): Observable<any> {
    console.log("productOption", productOption);
    const formData = new FormData();
  
    // Ajouter les données du produit à formData
    Object.keys(productOption).forEach(key => {
      if (Array.isArray(productOption[key])) {
        formData.append(key, JSON.stringify(productOption[key]));
      } else {
        formData.append(key, productOption[key]);
      }
    });
  
    // Ajouter l'image à formData
    formData.append('image', image);
  
    // Définir les en-têtes de la requête
    const headers = new HttpHeaders();
    return this.http.post(`${this.baseUrl}/owner/product-options`, formData, { headers });
  }
  
  
  
  getOptionsByStoreId(storeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/owner/options/${storeId}`);
  }
  changeCategoryIndex(menuId: string, oldIndex: number, newIndex: number): Observable<any> {
    const url = `${this.baseUrl}/owner/menu/${menuId}/changeCategoryIndex`;
    const body = { oldIndex, newIndex };
    return this.http.put(url, body);
  }
  addOptionGroupToOption(optionGroupId: string, parentOptionGroupId: string, optionId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/addOptionGroupToOG/${optionGroupId}/${parentOptionGroupId}/${optionId}`;
    return this.http.post(url, {});
  }
   toggleAvailability(productId: string, modeId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/products/${productId}/mode/${modeId}/toggle-availability`;
    return this.http.put(url, {});
  }
  toggleAvalabilityCategory(categoryId:string,modeId):Observable<any>{
    const url =`${this.baseUrl}/owner/category/${categoryId}/mode/${modeId}/toggle-availability`;
    return this.http.put(url,{})
  }
  toggleAvailabilityGLobal(productId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/products/${productId}/toggle-availability`;
    return this.http.put(url, {});
  }
  toggleAvailabilityGLobalCategory(categoryId: string): Observable<any> {
    const url = `${this.baseUrl}/owner/categorys/${categoryId}/toggle-availability`;
    return this.http.put(url, {});
  }
  //addStores
  addStores(Data:any): Observable<any> {
    return this.http.post(`${this.baseUrl}/owner/addStores`, Data );
  }
  //ajouter color
  addColor(storeId: string, colorData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/owner/stores/${storeId}/colors`, colorData);
  }
    //getstoreByid
getStroreById(storesId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/owner/getStoresById/${storesId}`, { headers });
}
// updateStore
updateStore(storeId: string, data: any): Observable<any> {
  let phone: string;
  if (data.phone === null || data.phone === undefined) {
    phone = data.phoneNumber || ''; 
  } else {
    phone = data.phone.internationalNumber || ''; 
  }

  const formData = new FormData();
  formData.append('ownerId', data.owner || '');
  formData.append('name', data.name || '');
  formData.append('description', data.description || '');
  formData.append('email', data.email || '');
  formData.append('address', data.address || '');
  formData.append('phoneNumber', phone); 
  formData.append('latitude', data.latitude?.toString() || '');
  formData.append('longitude', data.longitude?.toString() || '');
  formData.append('rangeValue', data.rangeValue?.toString() || '');
  if (data.logo) {
    formData.append('logo', data.logo);
  }
  if (data.StoreBanner) {
    formData.append('StoreBanner', data.StoreBanner);
  }
  console.log("data.StoreBanner", data.StoreBanner);
  formData.append('primairecolor', data.primairecolor);
  formData.append('secondairecolor', data.secondairecolor);
  data.specialites.forEach((specialiteId, index) => {
    formData.append(`specialites[${index}]`, specialiteId);
  });

  const url = `${this.baseUrl}/owner/updateStores/${storeId}`;
  return this.http.put<any>(url, formData);
}

updateMode(storeId: string, data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/updateConsommation/${storeId}`;
  return this.http.put<any>(url, data);
}
getModeById(storesId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/owner/getConsommation/${storesId}`, { headers });
}
//orders
getOrderByStoreId(storesId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/owner/orders/${storesId}`, { headers });
}
getOrderById(storesId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/owner/getOrdersById/${storesId}`, { headers });
}
updateStatusorder(storeId: string, data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/updateOrders/${storeId}`;
  const body = { Data:data };
  return this.http.put<any>(url, body);
}
updateStatusorders( data: any): Observable<any> {
  const url = `${this.baseurlyassine}/socket/order/updatestatus`;
  const body = { status:data.selectedStatus,_id:data.selectedItemId,updatedBy:data.updatedBy  };
  return this.http.put<any>(url, body);
}
//Company
addCompany(Data:any): Observable<any> {
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/owner/addCompany`, Data, { headers } );
  }
deleteStores(storeId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deleteStores/${storeId}`, { headers });
}
duplicateProduct(productId):Observable<any>{
  const token =localStorage.getItem('token')
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept : 'application/json'
  })
  return this.http.post<any>(`${this.baseUrl}/owner/duplicate/${productId}`,{headers });
}
deleteOptionFromGroupsOption(groupeId,optionId):Observable<any>
{
  return this.http.delete<any>(`${this.baseUrl}/owner/option-groups/${groupeId}/options/${optionId}`);
}
modifyOpionInGroupeOption(optionId,groupeId ,price,name,isDefault,selectedTaxId):Observable<any>
{  const body={price,name,isDefault,selectedTaxId};
console.log("selectedTaxId",selectedTaxId)
console.log("body",body)
  return this.http.put<any>(`${this.baseUrl}/owner/option/${optionId}/${groupeId}`,body);
}
addOptionGroupToOG(optionGroupId: string, parentOptionGroupId: string, optionId: string): Observable<any> {
  const url = `${this.baseUrl}/owner/addOptionGroupToOG/${optionGroupId}/${parentOptionGroupId}/${optionId}`;
  return this.http.post(url, {}).pipe(
    catchError((error) => {
     // console.error(error);
      return throwError('An error occurred while adding OptionGroup ID to oG array');
    }) );
}
deleteSubOptionGroup(optionGroupId: string, optionId: string, subOptionGroupId: string): Observable<any> {
  const url = `${this.baseUrl}/owner/${optionGroupId}/options/${optionId}/subOptionGroups/${subOptionGroupId}`;
  return this.http.delete(url);
}
changeOptionGroupIndex(productId: string, oldIndex: number, newIndex: number): Observable<any> {
  const url = `${this.baseUrl}/owner/products/${productId}/changeOptionGroupIndex`;
  const body = { oldIndex, newIndex };
  return this.http.put(url, body);
}
addOptionGroupToCategory(categoryId: string, optionGroupId: string): Observable<any> {
  const url = `${this.baseUrl}/owner/addOptionGroupsWithCategory/${categoryId}`;
  const body = { optionGroup: optionGroupId };
  return this.http.post(url, body);
}
changeSizeOptionGroupIndex(productId: string, sizeIndex: number, oldIndex: number, newIndex: number): Observable<any> {
  const url = `${this.baseUrl}/owner/products/${productId}/changeSizeOptionGroupIndex`;
  const body = { sizeIndex, oldIndex, newIndex };
  return this.http.put<any>(url, body);
}
private eventSource: EventSource;
connectToSse(clientId: string): Observable<MessageEvent> {
  const idFront=new Date();
  this.iddate=idFront;
  this.eventSource = new EventSource(`https://api.eatorder.fr/sse/sse/${clientId}/${idFront}`); 
  return new Observable<MessageEvent>((observer) => {
    this.eventSource.addEventListener('message', (event: MessageEvent) => {
      observer.next(event);
    });
    this.eventSource.onerror = (error) => {
      observer.error(error); };
  });
}
getEventSource(): EventSource {
  return this.eventSource;
}
closeConnection(): void {
  if (this.eventSource) {this.eventSource.close(); }
}
//Api 
updateMod(storeId: string, data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/updateConsommation/${storeId}`;
  return this.http.put<any>(url, data);
}
getMode(storesId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/owner/getConsommation/${storesId}`, { headers });
}
//addopeninghours
addopeninghours(Data:any,storeId: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/owner/update-opening-hours/${storeId}`, Data );
}
getOpeningHours(storeId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/get-opening-hours/${storeId}`, { headers });
}
deletehours(storeId: string,hoursId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deletehours/${storeId}/${hoursId}`, { headers });
}
updatehours(storeId: string,hoursId: string, data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/updatehoraire/${storeId}/${hoursId}`;
  const body = data;
  return this.http.put<any>(url, body);
}
getOpeningHoursbyid(storeId: string,hoursId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/gethoursbyid/${storeId}/${hoursId}`, { headers });
}
addmenu(Data:any): Observable<any> {
  return this.http.post(`${this.baseUrl}/owner/menu`, Data );
}
deletemenu(storeId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/menu/store/${storeId}`, { headers });
}
updateCategoryImage(categoryId: string, image: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', image);

  return this.http.put<any>(`${this.baseUrl}/owner/categories/${categoryId}/update-image`, formData);
}
updateProductImage(productId: string, imageFile: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('image', imageFile);
  return this.http.put<any>(`${this.baseUrl}/owner/products/${productId}/update-image`, formData);
}
updateOptionImage(optionId: string, image: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('image', image);
  return this.http.put<any>(`${this.baseUrl}/owner/options/${optionId}/update-image`, formData);
}
updateopenStore(data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/store/changestatus`;
  const body = data;
  return this.http.put<any>(url, body);
}
//Promo
addpromo(Data:any){
  return this.http.post(`${this.baseUrl}/owner/promo`, Data );
}
getallpromos(storeId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/getpromos/${storeId}`, { headers });
}
deletepromo(promoId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deletePromo/${promoId}`, { headers });
}
updatePromo(promoId: string, data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/updatePromoAvailability/${promoId}`;
  const body = data;
  return this.http.put<any>(url, body);
}
getPromobyId(promoId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/getPromoById/${promoId}`, { headers });
}
getCategoriebyId(Id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/getcategorieById/${Id}`, { headers });
}
updatePromos(promoId: string, data: any): Observable<any> {
const formData = new FormData();
formData.append('storeId', data.storeId );
formData.append('name', data.name );
formData.append('numberGroup', data.numberGroup );
formData.append('number2', data.number2 );
formData.append('discount', data.discount );
formData.append('availability', data.availability );
formData.append('promos', JSON.stringify(data.promos ));
formData.append('availabilitys', JSON.stringify(data.availabilitys ));
formData.append('image', data.image);
  const url = `${this.baseUrl}/owner/updatePromo/${promoId}`;
  const body = formData;
  return this.http.put<any>(url, body);
}
deletepromos(promoId: string,categoryId:string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.baseUrl}/owner/promo/${promoId}/object/${categoryId}`, { headers });
}
addGroupPromo(Data:any){
  return this.http.post(`${this.baseUrl}/owner/AddGrouppromo`, Data );
}
addCoupon(couponData: any): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<any>(this.baseUrl + '/owner/addcoupons', couponData, { headers });
}
getCouponsByStore(storeId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/owner/coupons/${storeId}`);
}
deleteCoupon(couponId: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/owner/coupons/${couponId}`);
}
createStripeAccount(email: string, country: string): Observable<any> {
  const body = { email, country };

  return this.http.post<any>(`${this.baseUrl}/owner/create-account`, body);
}
createAccount(email: string, country: string, storeId: string) {
  const body = { email, country, storeId };
  return this.http.post(`${this.baseUrl}/owner/create-account`, body);
}
getCompanybyouner(Id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/getcompanyByouners/${Id}`, { headers });
}
getProduitbypromo(promoId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/owner/getPromoProducts/${promoId}`, { headers });
}
//finpromo
  //updateorder
  updateOrderPromo( data: any): Observable<any> {
    const url = `${this.baseUrl}/owner/orderPromo`;
    const body = data;
    return this.http.put<any>(url, body);
  }
  //updateordregroup
  updategrouppromo( data: any): Observable<any> {
    const url = `${this.baseUrl}/owner/promogroup`;
    const body = data;
    return this.http.put<any>(url, body);
  }
  //Manager
  addmanager(Data:any){
    return this.http.post(`${this.baseUrl}/owner/addmanager`, Data );
  }
  getmanagerbycompany(Id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/owner/company/${Id}/managers/`, { headers });
  }
  deletemanager(managerId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/owner/user/${managerId}`);
  }
  getmanagerbyid(Id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/owner/getmanagerByid/${Id}`, { headers });
  }
  updateManager(managerId: string, managerData: any): Observable<any> {
    const formData = new FormData();
    formData.append('stores', JSON.stringify(managerData.stores));
    formData.append('company', managerData.company);
    formData.append('firstName', managerData.firstName);
    formData.append('email',  managerData.email);
    formData.append('lastName', managerData.lastName);
    formData.append('password', managerData.password);
    formData.append('phoneNumber',  managerData.phoneNumber );
    formData.append('sexe', managerData.sexe);
    formData.append('status', managerData.status);
  const url = `${this.baseUrl}/owner/updateManager/${managerId}`;
  const body = formData;
  return this.http.put<any>(url, body);
}
updateimagemanager(managerId: string, imagedate:any): Observable<any> {
  const formData = new FormData();
  formData.append('image', imagedate);
  const url = `${this.baseUrl}/owner/updateImage/${managerId}`;
  const body = formData;
  return this.http.put<any>(url, body);
}
private nominatimBaseUrl = 'https://nominatim.openstreetmap.org/search';
  getAddressCoordinates(address: string): Observable<any> {
    const url = `${this.nominatimBaseUrl}?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;
    return this.http.get(url);
  }
  getAddressFromCoordinates(latitude: number, longitude: number): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    return this.http.get(url);
  }
  getallcompany(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/admin/companies`, { headers });
  }
  getUberToken(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/uber/getUberToken`, {});
  }
  getUberToken2(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/uber/getUberToken2`, {});
  }
  getcompanybyid(Id: string){
    return this.http.get(`${this.baseUrl}/owner/getCompanyById/${Id}`);
  }
  //company admin
updateCompany(companyId: string, companyData: any): Observable<any> {
  const url = `${this.baseUrl}/owner/updatecompany/${companyId}`;
  return this.http.put<any>(url, companyData);}
getstorebycompany(companyId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/owner/storesByCompany/${companyId}`);}
deletecompany(companyId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deleteCompany/${companyId}`, { headers });
}
deleteStoress(storeId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deleteStores/${storeId}`, { headers });
} 
getowners(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.baseUrl}/admin/getOwners`, { headers });
}
createSpecialite(specialite: any): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/owner/specialites`, specialite);
}
getSpecialites(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/owner/specialites`);
}
getSpecialitesByid(idspecialite:any): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/owner/specialites/${idspecialite}`);
}
switchUber(storeId: string): Observable<any> {
  const url = `${this.baseUrl}/owner/switchuber/${storeId}`;
  return this.http.put(url, {});}
switchguestmode(storeId: string,guestmode: any): Observable<any> {
  const url = `${this.baseUrl}/owner/switchguestmode/${storeId}`;
  return this.http.put(url,guestmode, {});}
switchautomaticcommande(Data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/managingacceptedorders`;
  return this.http.put(url,Data, {});
}
//automatic uber
switchautomaticuber(Data: any): Observable<any> {
  const data = {
    name : Data.name,
    option : Data.option[0].checked ? Data.option[0].name : Data.option[1].name,
    storeId : Data.storeId
  }
  const url = `${this.baseUrl}/owner/updateorganization`;
  return this.http.put(url,data, {});
}
switchmodeUber(storeId: string): Observable<any> {
  const url = `${this.baseUrl}/owner/switchmodeuber/${storeId}`;
  return this.http.put(url, {});
}
switchPaiement(storeId: string): Observable<any> {
  const url = `${this.baseUrl}/owner/switchpaiement/${storeId}`;
  return this.http.put(url, {});}
//UberDirect
getalllivraison(storeid:any){
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/uber/deliveries/${storeid}`, { headers } );
}
getdeliverybyid(deliveryid:any){
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.baseUrl}/uber/getUberDelivery/${deliveryid}`, { headers } );
}
getOrdersByStoreId(storesId: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/owner/orders/${storesId}/delivery`);
}
Creerdevis(idorder:any){
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.baseUrl}/uber/Creer_devis/${idorder}`, {}, { headers });
}
Creerdelivery(idorder: any, Data: any) {
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.baseUrl}/uber/createdelivery/${idorder}`, Data, { headers });
}
CancelDelivery(iddeliver: any,idorder: any) {
  const token = localStorage.getItem('accessToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.baseUrl}/uber/cancel/${iddeliver}/${idorder}`, {}, { headers });
}
getorderbyiberid(iduber: string){
  return this.http.get(`${this.baseUrl}/owner/orders/${iduber}`);
}
deleteorders(orderId: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deleteOrder/${orderId}`, { headers });
}
deleteOrderss(orderIds: string[]): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.baseUrl}/owner/deleteOrders`, { headers, body: { orderIds } });
}
getallorderbystore(storeid: string){
  return this.http.get(`${this.baseUrl}/owner/orderss/${storeid}`);
}
//Clone Menu
clonemenu(Data: any){
  return this.http.post(`${this.baseUrl}/owner/cloneMenuStore`,Data);
}
//Stipe
switchStripe(data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/stripaccount`;
  return this.http.put(url,data, {});}
//tags
addtags(Data: any){
  return this.http.post(`${this.baseUrl}/owner/tags`,Data);
}
getalltags(storeid: string){
  return this.http.get(`${this.baseUrl}/owner/tags/${storeid}`);
}
deleteTags(TagsId: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/owner/tags/${TagsId}`);
}
updatetags(TagsId: string,data: any): Observable<any> {
  const url = `${this.baseUrl}/owner/tags/${TagsId}`;
  return this.http.put(url,data, {});}
}
