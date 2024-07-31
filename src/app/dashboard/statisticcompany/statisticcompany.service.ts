import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticcompanyService {
 private apiUrl = 'http://localhost:8000/statistique';
 // private apiUrl = 'https://api.eatorder.fr/statistique';
// private apiUrl = 'https://server.eatorder.fr:8000/statistique';

  constructor(private http: HttpClient) { }
  //statistiqueCompany
 /* getstoresbycompany(idStores: string[], year: any) {
    console.log("idStores",idStores)
    return this.http.post(`${this.apiUrl}/top-stores`, { idStores, year });
  }*/
  getStoreOrders(idStores: string[], year: number) {
   // console.log("service",idStores)
    return this.http.post(`${this.apiUrl}/store-orders/${year}`, { idStores });
}

getstoresbycompanyy(idcompany: string,yers:any){
  return this.http.get(`${this.apiUrl}/top-stores/${idcompany}/${yers}`);
}
getchiffrebycompany(storeIds: string[], year: number) {
  console.log("service",storeIds)
  const url = `${this.apiUrl}/total-revenue/${year}`;
  return this.http.post<any>(url, { storeIds });
}

}
