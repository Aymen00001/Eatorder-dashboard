import { Component, OnInit } from '@angular/core';
import * as highchartsData from '../../shared/data/analytics.highchartsData';
import * as Highcharts from 'highcharts';
import { AnalyticsService } from './analytics.service';
import { ApiServices } from 'src/app/services/api';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  type = 'line';
  options = {
     responsive: true,
     maintainAspectRatio: true,
     scales: {
         yAxes : [{
             ticks : {
                 max : 100,    
                 min : 0
             }  }]
     }, legend: {
      position: 'bottom', 
    }};
 barchart: any[] = []; 
 data: any = {};
 chartOptions: any = {}; 
 selectedYear1: number = new Date().getFullYear()-1;
 selectedYear2: number = new Date().getFullYear();
 selectedOption: string = 'week';
  updateFlag = false;
  errorMsg: string;
  totalHT: number;
  totalTTC: number;
  totalHT2: number;
  totalTTC2: number;
  constructor(private analyticsservice: AnalyticsService, private apiservice: ApiServices,private http:HttpClient) {
    this.initializeSelectedMonths();
    this.initializeSelectedweek()
   }
  selectedWeek1: string = '';
  selectedWeek2: string = '';
  selectedmonth1: string = '';
  selectedmonth2: string = '';
  startDate1: string | null = null;
  endDate1: string | null = null;
  startDate2: string | null = null;
  endDate2: string | null = null;
  week: boolean=true;
  month: boolean=false;
  year: boolean= false;
 
  calculateDatesmonth1(){
    const parsedDate: Date = new Date(this.selectedmonth1);
    const startOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
    this.startDate1 = startOfMonth.toLocaleDateString(); // Format as "YYYY-MM-DD"
    const lastDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);
    this.endDate1 = lastDay.toLocaleDateString(); // Format as "YYYY-MM-DD"
    console.log( this.startDate1,this.endDate1 )
}
onRadioChange() {
if(this.selectedOption=="week")
{
  this.week=true;
  this.month=false;
  this.year=false;
}
else if(this.selectedOption=="month")
{
  this.week=false;
  this.month=true;
  this.year=false;
}
else if(this.selectedOption=="year")
{
  this.week=false;
  this.month=false;
  this.year=true;
}
  //console.log('Radio button changed. Selected option:', this.selectedOption);
}
calculateDatesmonth2(){
  const parsedDate: Date = new Date(this.selectedmonth2);
  const startOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
  this.startDate2 = startOfMonth.toLocaleDateString(); // Format as "YYYY-MM-DD"
  const lastDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);
  this.endDate2 = lastDay.toLocaleDateString(); // Format as "YYYY-MM-DD"
}
  calculateDates1() {
    const year = +this.selectedWeek1.substring(0, 4);
    const weekNumber = +this.selectedWeek1.substring(6);
    const startDate = new Date(year, 0, (weekNumber - 1) * 7 + 1);
    const endDate = new Date(year, 0, weekNumber * 7);
    this.startDate1 =  this.formatDate(startDate);
    this.endDate1 = this.formatDate(endDate);
  }
  calculateDates2() {
    const year = +this.selectedWeek2.substring(0, 4);
    const weekNumber = +this.selectedWeek2.substring(6);

    const startDate = new Date(year, 0, (weekNumber - 1) * 7 + 1);
    const endDate = new Date(year, 0, weekNumber * 7);

    this.startDate2 =  this.formatDate(startDate);
    this.endDate2 = this.formatDate(endDate);
  

  }
  cumulativeAmountsRange1: any;
  cumulativeAmountsRange2: any;
  ngOnInit(): void {
  const startdate =  Date.now()  
  
  }
  //initialisation Month
  initializeSelectedMonths() {
    const currentDate = new Date();
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    this.selectedmonth1 = this.formatMonth(previousMonth);
    this.selectedmonth2 = this.formatMonth(currentDate);
    this.calculateDatesmonth1()
    this.calculateDatesmonth2()
}
  formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Les mois sont 0-indexés, donc on ajoute 1
    return `${year}-${month.toString().padStart(2, '0')}`;
}
//fin
   formatDate(inputDate) {
    const date = new Date(inputDate);
      const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2); 
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  getWeeklyComparison(){
  if(this.selectedWeek1&&this.selectedWeek2){
    this.errorMsg=null
    this.analyticsservice.getWeeklyComparison(this.startDate1.toString(), this.endDate1.toString(), this.startDate2.toString(), this.endDate2.toString(),this.apiservice.getStore()).subscribe(
      (data) => {  this.cumulativeAmountsRange1 = Object.values(data.cumulativeAmountsRange1);
        this.cumulativeAmountsRange2 = Object.values(data.cumulativeAmountsRange2);
    this.options = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            max: data.overallMaxCumulativeAmount,
            min: 0  }}],
      },  legend: {
        position: 'bottom', // Set legend position to bottom
      }
    };
    this.type="line"
        this.data = {
          labels: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          datasets: [{
            label: "week 1",
            data: this.cumulativeAmountsRange1,
            borderColor: "#f38b4a", // Set line color
            fill: false // Don't fill the area under the li
           // backgroundColor: "#f38b4a",
          },
          {label: "week 2",
            data: this.cumulativeAmountsRange2,
          //  backgroundColor: "#f3ffff",
          borderColor: "#0000ff ", // Set line color
          fill: false // Don't fill the area under the line
          }]
        };  this.updateFlag = true; // Set the updateFlag to trigger chart update  
      },(error) => {console.error(error); }
    ); } else
  { this.errorMsg="select a data "} 
}
getMonthlyComparison(){
  console.log(this.selectedmonth1)
  console.log(this.selectedmonth2)

  if(this.selectedmonth1&&this.selectedmonth2) {
    this.errorMsg=null
    this.analyticsservice.getmonthlyComparison(this.startDate1.toString(), this.endDate1.toString(), this.startDate2.toString(), this.endDate2.toString(),this.apiservice.getStore()).subscribe(
      (data) => {
        this.cumulativeAmountsRange1 = Object.values(data.cumulativeAmountsMonth1);
        this.cumulativeAmountsRange2 = Object.values(data.cumulativeAmountsMonth2);      
    this.options = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            max: data.overallMaxCumulativeAmount,
            min: 0
          }}],
      },
      legend: {
        position: 'bottom', 
      }
    };
    this.type="line"
        this.data = {
          labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
          datasets: [{
            label: "Month 1",
            data: this.cumulativeAmountsRange1,
            borderColor: "#f38b4a", 
            fill: false 
           // backgroundColor: "#f38b4a",
          },
          { label: "Month 2",
            data: this.cumulativeAmountsRange2,
          //  backgroundColor: "#f3ffff",
          borderColor: "#0000ff ", 
          fill: false 
          }
        ] };
        this.updateFlag = true; 
      }, (error) => {  console.error(error);} );
  }
  else
  {
    this.errorMsg="select a data "
  }
 
}
TotalsRange1:any=0
TotalsRange2:any=0

fetchData(startYear1: number, endYear1: number, startYear2: number, endYear2: number) {
  if(this.selectedYear1&&this.selectedYear2) {
    this.errorMsg=null
    this.analyticsservice
    //startYear1-1 //endYear2+1,
    .getYearRangeComparison(startYear1, endYear1, startYear2, endYear2, this.apiservice.getStore())
    .subscribe((data) => {
      this.cumulativeAmountsRange1 = Object.values(data.cumulativeAmountsRange1);
      this.cumulativeAmountsRange2 = Object.values(data.cumulativeAmountsRange2);
      console.log( "cumulativeAmountsRange1",this.cumulativeAmountsRange1)
      console.log( "cumulativeAmountsRange2",this.cumulativeAmountsRange2)

for (let i = 0; i < this.cumulativeAmountsRange1.length; i++) {
this.TotalsRange1 = this.cumulativeAmountsRange1.reduce((acc, val) => acc + val, 0);
}
for (let i = 0; i < this.cumulativeAmountsRange2.length; i++) {
this.TotalsRange2 = this.cumulativeAmountsRange2.reduce((acc, val) => acc + val, 0);
}
this.getchiffrecompany(startYear1,startYear2)
      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              max: data.overallMaxCumulativeAmount,
              min: 0
            }
          }],
          
        },
        legend: {
          position: 'bottom', 
        }
        
      };
      this.type="line"
          this.data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [{
              label: "Year 1",
              data: this.cumulativeAmountsRange1,
              borderColor: "mediumpurple", // Set line color
              fill: false // Don't fill the area under the li
             // backgroundColor: "#f38b4a",
            },
            {
              label: "Year 2",
              data: this.cumulativeAmountsRange2,
            //  backgroundColor: "#f3ffff",
            borderColor: "cornflowerblue ", // Set line color
            fill: false // Don't fill the area under the line
            }
          ]
          };
          this.updateFlag = true;        
    });
  }
  else{this.errorMsg="select a data "}
}
fetchSalesDataPeriod1() {
  this.analyticsservice.getSalesData(this.apiservice.getStore(), this.startDate1.toString(), this.endDate1.toString()).subscribe(
    (data: any) => {
      this.totalHT = data.finaltotalHT;
      this.totalTTC = data.finaltotalTTC; 
    },
    error => {
      console.error('Error fetching sales data:', error);
    }
  );
}
fetchSalesDataPeriod2() {
  this.analyticsservice.getSalesData(this.apiservice.getStore(), this.startDate2.toString(), this.endDate2.toString()).subscribe(
    (data: any) => {
      this.totalHT2 = data.finaltotalHT;
      this.totalTTC2 = data.finaltotalTTC; 
    },
    error => { console.error('Error fetching sales data:', error); }
  );
}
//chifffre d'affaire
totalRevenue: number = 0;
totalHtRevenue: number = 0;

getchiffrecompany(startYear1: number,startYear2: number): void {
  console.log("startYear1",startYear1)
  console.log("startYear2",startYear2)
  this.analyticsservice.getchiffrebycompany(this.apiservice.getStore(),startYear1,startYear2).subscribe(
    (data:any) => {
      console.log("data",data)
      this.totalRevenue = data.totalRevenue;
      this.totalHtRevenue = data.totalHtRevenue;
      console.log("totalHtRevenue",this.totalHtRevenue);

      console.log("totalRevenue",this.totalRevenue);
    },
    (error) => { console.error('Error fetching store sales:', error);}
  );
}

//initialisation week
initializeSelectedweek(){
  const currentDate = new Date();
  // Obtenir la semaine précédente
  const previousWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
  // Obtenir la semaine actuelle
  const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());

  // Initialise les champs de sélection de semaine avec la semaine précédente et la semaine actuelle
  this.selectedWeek1 = this.formatWeek(previousWeekStart);
  this.selectedWeek2 = this.formatWeek(currentWeekStart);
  this.calculateDates1()
  this.calculateDates2()
}

formatWeek(date: Date): string {
  const year = date.getFullYear();
  const week = this.getISOWeek(date); // Obtenez le numéro de semaine ISO
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

// Fonction pour obtenir le numéro de semaine ISO
getISOWeek(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
}
