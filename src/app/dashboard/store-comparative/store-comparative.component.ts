import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';
import { ApiServices } from 'src/app/services/api';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-store-comparative',
  templateUrl: './store-comparative.component.html',
  styleUrls: ['./store-comparative.component.scss']
})
export class StoreComparativeComponent implements OnInit {
  type = 'line';
  options = {
     responsive: true,
     maintainAspectRatio: true,
     scales: {
         yAxes : [{
             ticks : {
                 max : 100,    
                 min : 0
             }
         }]
     },
     legend: {
      position: 'bottom', 
    }
 };
 barchart: any[] = []; 
 data: any = {};
 chartOptions: any = {}; 
 updateFlag = false;
 user: any;
 store: any[];
 selectedOption: boolean = true; 
 selectedOption2: boolean = false;
  startDate: any;
  selectedWeek: string = '';
  selectedMonth: string = '';
  Userrole:any;
  constructor(private analyticsservice: AnalyticsService, private apiservice: ApiServices,private http:HttpClient, private apiService: ApiServices) {  }
  cumulativeAmountsRange1: any;
  cumulativeAmountsRange2: any;
  ngOnInit(): void {
    this.Userrole=localStorage.getItem('role');

    this.user = this.apiService.getUser();
    this.getallstores();
    this.initializeSelectedweek(); 
    this.initializeSelectedMonth();

  }
  isManagerRole(): boolean {
    // Vérifie si le rôle de l'utilisateur est 'manager'
    return this.Userrole === 'manager';
  }
  getWeeklyComparison(){
    const { startDate, endDate } = this.parseWeekInput(this.selectedWeek);
  const formattedStartDate = this.formatDate(startDate);
  const formattedEndDate = this.formatDate(endDate);
      this.analyticsservice.getStoreComparison(formattedStartDate, formattedEndDate, this.selectedStore1, this.selectedStore2).subscribe(
        (data) => {
          console.log("data",data);
          this.cumulativeAmountsRange1 = Object.values(data.cumulativeAmountsStore1);
          this.cumulativeAmountsRange2 = Object.values(data.cumulativeAmountsStore2);
          console.log( this.cumulativeAmountsRange1);
          console.log(this.cumulativeAmountsRange2);
      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              max: data.overallMaxCumulativeAmount,
              min: 0 }
          }],
        },
        legend: {
          position: 'bottom', 
        }
      };
      this.type="line"
          this.data = {
            labels: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
       
            datasets: [{
              label: data.storeNameStore1,
              
              data: this.cumulativeAmountsRange1,
              borderColor:"rgb(51, 180, 116)", // Set line color
              fill: false // Don't fill the area under the li
             // backgroundColor: "#f38b4a",
            },
            {
              label: data.storeNameStore2,
              data: this.cumulativeAmountsRange2,
            //  backgroundColor: "#f3ffff",
            borderColor:"slategray", // Set line color
            fill: false // Don't fill the area under the line
            } ]
          };
          this.updateFlag = true; 
        },
        (error) => {
          console.error(error);
        });
  }
  endDate: string;   
  selectedStore2:any
  selectedStore1:any
  getallstores() {
    this.apiService.getStoresOwner(this.user._id).subscribe(
      (response) => {
        this.store = response[0];
      },
      error => {    }
    )
  }
  
  show(){
   this.selectedOption=true
   this.selectedOption2=false
  }
  show2(){
    this.selectedOption=false
    this.selectedOption2=true
   }
   //par semaine
   parseWeekInput(weekInput: string) {
    const year = +weekInput.substring(0, 4);
    const weekNumber = +weekInput.substring(6);
    const startDate = new Date(year, 0, (weekNumber - 1) * 7 + 1);
    const endDate = new Date(year, 0, weekNumber * 7);
    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    return { startDate: formattedStartDate, endDate: formattedEndDate };
  }
  formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2); 
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  onWeekChange() {
    const year = +this.selectedWeek.substring(0, 4);
  const weekNumber = +this.selectedWeek.substring(6);
  const startDate = new Date(year, 0, (weekNumber - 1) * 7 + 1);
  const endDate = new Date(year, 0, weekNumber * 7);
  this.startDate =  this.formatDate(startDate);
  this.endDate= this.formatDate(endDate);
}

//initialisation week
initializeSelectedweek() {
  const currentDate = new Date();
    const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
  this.selectedWeek = this.formatWeek(currentWeekStart);
  this.onWeekChange();
}
formatWeek(date: Date): string {
  const year = date.getFullYear();
  const week = this.getISOWeek(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}
getISOWeek(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
//fin initialisation week
//par mois
selectedStartMonth: string; 
selectedEndMonth: string; 
onMonthChange(event: any, type: string) {
    const parsedDate: Date = new Date(event);
    const startOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
    const lastDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);

    if (type === 'start') {
        this.startDate = startOfMonth.toLocaleDateString(); // Format as "YYYY-MM-DD" pour le mois de début
    } else if (type === 'end') {
        this.endDate = lastDay.toLocaleDateString(); // Format as "YYYY-MM-DD" pour le mois de fin
    }

    console.log("startDate", this.startDate);
    console.log("endDate", this.endDate);
}

getMonthComparison() {
  console.log( this.startDate)
  console.log( this.endDate)
  this.analyticsservice.getStoreComparisonparmoi(this.startDate.toString(),  this.endDate.toString(), this.selectedStore1, this.selectedStore2).subscribe(
    (data) => {
      console.log("data", data);
      // Récupérer les montants cumulatifs pour chaque mois
      this.cumulativeAmountsRange1 = Object.values(data.cumulativeAmountsStore1);
      this.cumulativeAmountsRange2 = Object.values(data.cumulativeAmountsStore2);

      // Mettre à jour les options du graphique
      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              max: data.overallMaxCumulativeAmount,
              min: 0
            }
          }]
        },
        legend: {
          position: 'bottom',
        }
      };

      // Mettre à jour les données du graphique
      this.type = "line";
      this.data = {
        labels: Object.keys(data.cumulativeAmountsStore1), // Utiliser les clés (mois) comme labels
        datasets: [{
          label: data.storeNameStore1,
          data: this.cumulativeAmountsRange1,
          borderColor: "rgb(51, 180, 116)", // Couleur de la ligne
          fill: false // Ne pas remplir la zone sous la ligne
        },
        {
          label: data.storeNameStore2,
          data: this.cumulativeAmountsRange2,
          borderColor: "slategray", // Couleur de la ligne
          fill: false // Ne pas remplir la zone sous la ligne
        }]
      };
      this.updateFlag = true;
    },
    (error) => {
      console.error(error);
    });
}

//initialisation mois
initializeSelectedMonth(){
  const currentDate = new Date();
  const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  this.selectedStartMonth = this.formatMonth(previousMonth);
  this.selectedEndMonth = this.formatMonth(currentDate);
  this.onMonthChange(this.selectedStartMonth, 'start'); 
  this.onMonthChange(this.selectedEndMonth, 'end'); 
}
formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Les mois sont 0-indexés, donc on ajoute 1
  return `${year}-${month.toString().padStart(2, '0')}`;
}
}
