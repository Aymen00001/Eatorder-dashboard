// order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

 // private apiUrl = 'http://localhost:8000/statistique';
 // private apiUrl = 'https://api.eatorder.fr/statistique';
 private apiUrl = 'https://server.eatorder.fr:8000/statistique';


  constructor(private http: HttpClient) { }

  getMonthlyOrders(storeId: string, year: number): Observable<any> {
    const url = `${this.apiUrl}/orders/total/${storeId}/${year}`;
    return this.http.get<any>(url);
  }
  getStatue(storeId:string):Observable<any>{
    const url =`${this.apiUrl}/orders/status/${storeId}`;
    return this.http.get<any>(url)
  }
  getWeeklyComparison(startWeek1: string, endWeek1: string, startWeek2: string, endWeek2: string,storeId:string): Observable<any> {
    const url = `${this.apiUrl}/date-range-comparison`;
    const params = {
      startWeek1,
      endWeek1,
      startWeek2,
      endWeek2,
      storeId
    };
    return this.http.get<any>(url, { params, });
  }
  getmonthlyComparison(startMonth1: string, endMonth1: string, startMonth2: string, endMonth2: string,storeId:string): Observable<any> {
    const url = `${this.apiUrl}/monthly-comparison`;
    const params = {
      startMonth1,
       endMonth1, 
       startMonth2, 
       endMonth2,
        storeId
      
    };
    return this.http.get<any>(url, { params, });
  }
  getYearRangeComparison(startYear1: number, endYear1: number, startYear2: number, endYear2: number,   storeId: string): Observable<any> {
    const params = {
      startYear1: startYear1.toString(),
      endYear1: endYear1.toString(),
      startYear2: startYear2.toString(),
      endYear2: endYear2.toString(),
      storeId:storeId,
    };

    return this.http.get<any>(`${this.apiUrl}/year-range-comparison`, { params });
  }
  getSalesData(storeId: string, startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/sales?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`;
      return this.http.get<any>(url);
  }
  getStoreComparison(startDate: string, endDate: string,storeId1:string,storeId2:string): Observable<any> {
    const url = `${this.apiUrl}/date-range-comparison-store`;
    const params = {
      startDate,
      endDate,
      storeId1,
      storeId2,
    };
    return this.http.get<any>(url, { params, });
  }
  
  getchiffrebycompany(idstore: string,startYear1: number,startYear2: number){
    return this.http.get(`${this.apiUrl}/ChiffreAnnee/${idstore}/${startYear1}/${startYear2}`);
  }
  getStoreComparisonparmoi(startDate: string, endDate: string,storeId1:string,storeId2:string): Observable<any> {
    const url = `${this.apiUrl}/comparison-store-parmois`;
    const params = {
      startDate,
      endDate,
      storeId1,
      storeId2,
    };
    return this.http.get<any>(url, { params, });
  }
}
