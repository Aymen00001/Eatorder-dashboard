import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'src/app/models/store';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.scss']
})
export class OpeningHoursComponent implements OnInit {
  selectedDays: string[] = [];
  store: Store;
  errorMessage: string;
  errorMessage2: string;
  openingdate:any={}
  ownerId:any;
commonTimeEnd:any
commonTimeStart:any
selectedDay: string | null = null;
selectedStart: string = '00:00';
selectedEnd: string = '00:00';
daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
lines: number = 1;
selectedDaysOutput: string[] = [];
selectedStartOutput: string = "";
selectedEndOutput: string = "";
storeid: string;
  constructor(private authService: ApiServices, private http:HttpClient,private route:Router) {
    this.storeid = localStorage.getItem('storeid');
    this.openingdate={
      shifts: { start: '', end: '' },
      jour: {
        Monday: { isOpen: false },
        Tuesday: { isOpen: false },
        Wednesday: { isOpen: false },
        Thursday: { isOpen: false },
        Friday: { isOpen: false },
        Saturday: { isOpen: false },
        Sunday: { isOpen: false },
      },
    };
    this.getallhoraire()
  }
  ngOnInit(): void {
  }
  openingHours: any[] = [];
  getallhoraire() {
    this.authService.getOpeningHours(this.storeid).subscribe(
      (data) => {
        this.openingHours = data.openingHours;
      },
      (error) => {
        console.error('Error fetching opening hours', error);
      }
    );
  }
  resetTimeInputs() {
    this.selectedStart = "";
    this.selectedEnd = "";
  }
  addhours=false
  add1(){
    this.addhours=true
  }
selectedSets: { days: string[]; timeSlots: { start: string; end: string; }[]; isOpen?: boolean }[] = [];
resetCheckboxValues() {
  for (const day in this.openingdate.jour) {
    if (this.openingdate.jour.hasOwnProperty(day)) {
      this.openingdate.jour[day].isOpen = false;
    }
  }
}
resetSelectedDays() {
this.selectedDays = [];
this.selectedStart = "";
this.selectedEnd = "";}
updateSelectedDays(day: string) {
  if (!this.openingdate || !this.openingdate.jour || !this.openingdate.jour[day]) {
    return;
  }
  const isOpen = this.openingdate.jour[day].isOpen;
  if (isOpen) {
    if (!this.selectedDays.includes(day)) {
      this.selectedDays.push(day);
    }
  } else {
    this.selectedDays = this.selectedDays.filter(selectedDay => selectedDay !== day);
  }
}
resetErrorMessage() {
  this.errorMessage = null;
  this.errorMessage2=null
}
add() {
 if (this.selectedDays.length === 0) {
  this.errorMessage =  "Please select at least one day.";
  setTimeout(() => {
    this.resetErrorMessage();
  }, 1000);
  return;
};
  if (this.openingHours.length < 2) {
   this.selectedDays.forEach(selectedDay => {
      this.openingdate.jour[selectedDay].isOpen = true;
      this.openingdate.shifts = {
        start: this.selectedStart,
        end: this.selectedEnd,
      };
    });
    this.resetSelectedDays();
    this.addhours = false;
    this.authService.addopeninghours(this.openingdate, this.storeid).subscribe(
      (response) => {
        response.store.openingdate = response.store.openingdate || [];
        this.getallhoraire();
      },
      (error) => {
        console.error('Error adding Stores', error);
      }
    );
  } else {
    this.errorMessage2 =  "Maximum of three openingdate entries reached.";
  setTimeout(() => {
    this.resetErrorMessage();
  }, 1000);
    console.error('Maximum of three openingdate entries reached.');
  }
}
updateOpeningHours() {
  const defaultShifts = [{ start: '', end: '' }];
  Object.values(this.openingdate.jour).forEach(day => {
    (day as { shifts: { start: string; end: string }[] }).shifts = defaultShifts;
  });
  this.selectedSets.forEach(set => {
    set.days.forEach(selectedDay => {
      const day = this.openingdate.jour[selectedDay];
      (day as { shifts: { start: string; end: string }[] }).shifts = set.timeSlots;
    });
  });
  Object.values(this.openingdate.jour).forEach(day => {
    (day as { shifts: { start: string; end: string }[]; isOpen: boolean }).isOpen =
      (day as { shifts: { start: string; end: string }[] }).shifts.length > 0;
  });
}
delettehours(hoursid:any) {
    this.authService.deletehours(this.storeid,hoursid).subscribe(
      (response: any) => {
        this.getallhoraire()
      },
      (error: any) => {
        console.error('Error deleting horaire:', error);
      }
    );
}
isEditMode = false;
open: any = {};
gethorairebyid(hoursid) {
  this.openingHours.forEach(item => {
    item.isEditMode = item._id === hoursid;
  });
  this.authService.getOpeningHoursbyid(this.storeid, hoursid).subscribe(
    (data) => {
      this.open = data.openingHours;
    },
    (error) => {
      console.error('Error fetching opening hours', error);
    }
  );
}
Updatehours(hoursid:any) {
  this.authService.updatehours(this.storeid,hoursid,this.open).subscribe(
    (response) => {
      this.isEditMode = false;
      this.getallhoraire()
    },
    (error) => {
      console.error('Error updating Stores', error);
    }
  );
}
close() {
  this.isEditMode = false;
this.getallhoraire()
}
updateEditSelectedDays(open, day) {
  if (!open.jour) {
    open.jour = {};
  }
  open.jour[day] = {
    isOpen: !open.jour[day]?.isOpen,
  };
}
close2() {
  this.addhours = false;
this.getallhoraire()
}

}
