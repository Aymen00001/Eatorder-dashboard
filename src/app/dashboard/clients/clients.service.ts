import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }
  //private apiUrl = 'http://localhost:8000/statistique';
  private apiUrl = 'https://server.eatorder.fr:8000/statistique';


  getStoreClients(storeId: string, page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('storeId', storeId)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}/store/${storeId}/clients`, { params });
  }
}