import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentesService {
  constructor(private http: HttpClient) { }
 //private apiUrl = 'http://localhost:8000/statistique';
  //  private apiUrl = 'https://api.eatorder.fr/statistique';
  private apiUrl = 'https://server.eatorder.fr:8000/statistique';


  //statistique ventes
getventebyproduit(idstore: string,startDate: string, endDate: string){
  return this.http.get(`${this.apiUrl}/products/sales/${idstore}/${startDate}/${endDate}`);
}
getventebymode(idstore: string,startDate: string, endDate: string){
  return this.http.get(`${this.apiUrl}/salesbymode/${idstore}/${startDate}/${endDate}`);
}
getventebystatus(idstore: string,startDate: string, endDate: string){
  return this.http.get(`${this.apiUrl}/salesbystatus/${idstore}/${startDate}/${endDate}`);
}
getventebyCategories(idstore: string,startDate: string, endDate: string){
  return this.http.get(`${this.apiUrl}/salesbycategories/${idstore}/${startDate}/${endDate}`);
}
getventebypaymentmode(idstore: string,startDate: string, endDate: string){
  return this.http.get(`${this.apiUrl}/acceptedpayments/${idstore}/${startDate}/${endDate}`);
}

}
