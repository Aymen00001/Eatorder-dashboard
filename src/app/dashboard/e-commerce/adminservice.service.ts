import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {
 // private apiUrl = 'http://localhost:8000/statistique';
  private apiUrl = 'https://server.eatorder.fr:8000/statistique';

  constructor(private http: HttpClient) { }
  getNumberCompany(){
    return this.http.get(`${this.apiUrl}/companies/count`);
  }
  //gettotalstore
  getNumbersStore(){
    return this.http.get(`${this.apiUrl}/totalstores/count`);
  }
  //getstore active
  getNumberStore(){
    return this.http.get(`${this.apiUrl}/stores/count`);
  }
  getNumberOwner(){
    return this.http.get(`${this.apiUrl}/users/count/owners`);
  }
  getnombrestorerejected(){
    return this.http.get(`${this.apiUrl}/storesrejected/count`);

  }
  getnombrestorespending(){
    return this.http.get(`${this.apiUrl}/storespending/count`);

  }
  gettotalstatus(){
    return this.http.get(`${this.apiUrl}/stores/status-percentage`);
  }
}
