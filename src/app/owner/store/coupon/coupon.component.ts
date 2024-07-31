import {  OnInit, ViewChild } from '@angular/core';
import { Component, inject } from '@angular/core';
import { NgbDatepickerModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {  FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgbDate, NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { ApiServices } from 'src/app/services/api';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-coupon',

  templateUrl: './coupon.component.html',
 
    styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  @ViewChild('modalContent') modalContent: any;

  discount: any;
  Prefix: any;
  coupons: any[] = [];
  searchTerm: string = '';
  searchForm: FormGroup;
  searchTermControl = new FormControl();
    constructor(private calendar: NgbCalendar,private ngbCalendar: NgbCalendar, public formatter: NgbDateParserFormatter, private dateAdapter: NgbDateAdapter<string>,private apiservice:ApiServices,private modalService: NgbModal) {
      this.searchForm = new FormGroup({
        searchTerm: new FormControl(''),
      });
     }
    curdate:any
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate;
    toDate: NgbDate | null = null;
    model: NgbDateStruct;
    date: {year: number, month: number};
    disabled = true;
    model1: string;
    model2: string;
    displayMonths = 2;
    navigation = 'select';
    showWeekNumbers = false;
    outsideDays = 'visible';
    totalItems: number;
    orderNumber:any;
  
    ngOnInit(): void {
      this.getcoupons()
    }
    onDateSelection(date: NgbDate) {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) { this.toDate = date;
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
    }
    isHovered(date: NgbDate) { return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate); }
    isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate);}
    isRange(date: NgbDate) { return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);}
  addCoupon(discount,prefix){
    const jsStartDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
  const jsEndDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
    const couponData = {
      discount: discount,
      storeId: this.apiservice.getStore(),
      prefix:prefix,
      startDate: jsStartDate,
      endDate:  jsEndDate,
    };
    this.apiservice.addCoupon(couponData).subscribe(
      (response) => { this.coupons.unshift(response.newCoupon)
        this.getcoupons()
      },
      (error) => { console.error('Error adding coupon:', error);}
    );
  }
  p: number = 1;
  selectedItemsPerPage: number = 15;
  getcoupons() {
    this.apiservice.getCouponsByStore(this.apiservice.getStore()).subscribe(
      (coupons) => { 
        this.coupons = coupons.reverse();  
        this.totalItems = this.coupons.length; 
        this.coupons.forEach((coupon, index) => {
          coupon.orderNumber = this.totalItems - index;
          this.selectedItemsPerPage = 15; 
          this.p = 1; 
        });
      },
      (error) => { console.error('Error fetching coupons:', error); }
    );
  }
  
  deletecoupons(couponId){
    this.apiservice.deleteCoupon(couponId).subscribe(
      () => {this.coupons = this.coupons.filter((coupon) => coupon._id !== couponId); },
      (error) => { console.error('Error deleting coupon:', error); }
    );
  }
  startDate: string = '';
    endDate: string = '';
    // filteredCoupons(): any[] {
    //   return this.coupons.filter(coupon => {
    //     const couponStartDate = new Date(coupon.startDate);
    //     const couponEndDate = new Date(coupon.endDate);
    //     const selectedStartDate = this.startDate ? new Date(this.startDate) : null;
    //     const selectedEndDate = this.endDate ? new Date(this.endDate) : null;
    //     let dateInRange = true;
    //     if (selectedStartDate) {  dateInRange = couponStartDate >= selectedStartDate;}
    //     if (dateInRange && selectedEndDate) {  dateInRange = couponEndDate <= selectedEndDate;}
    //     return dateInRange;
    //   });
    // }
    filteredCoupons(): any[] {
      if (this.coupons) {
        return this.coupons.filter(coupon => {
          return Object.values(coupon).some(field => {
            if (typeof field === 'string' || field instanceof String) {
              return field.toLowerCase().includes(this.searchTerm.toLowerCase());
            } else if (typeof field === 'number' && field.toString().includes(this.searchTerm)) {
              return true;
            }
            return false; 
          });
        });
      }
      return [];
    }
    
    
    prefix:any
    filteredCouponss: any[] = [];
    filterCouponsByDateRange() { this.filteredCouponss = this.filteredCoupons(); }
    openModal(content: any) {
      this.discount= '',
      this.Prefix='',
      this.startDate="",
      this.endDate="",
          this.modalService.open(content, { size: 'lg' }).result.then(
            (result) => { //console.log(`Modal closed with: ${result}`);
             },
            (reason) => { //console.log(`Modal dismissed with: ${reason}`);
            });
    }
    selectedCoupon: any;
    openDetailsModal(coupon: any) {
      const modalRef: NgbModalRef = this.modalService.open(this.modalContent, { size: 'lg' });
     // modalRef.componentInstance.coupon = coupon;
      this.selectedCoupon = coupon;
    }
    sortDirection: string = 'asc'; 
    sortedColumn: string = ''; 
    displayedItems: any = [];

    sortorderByData() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sortedColumn = 'endDate';
      this.coupons.sort((a, b) => {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        if (this.sortDirection === 'asc') {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      }); 
      this.updateDisplayedItems();
    }
    sortDirections: string = 'asc'; 
    sortedColumns: string = ''; 

    sortorderByDatadiscount() {
      this.sortDirections = this.sortDirections === 'asc' ? 'desc' : 'asc';
      this.sortedColumns = 'discount';
      this.coupons.sort((a, b) => {
        if (this.sortDirections === 'asc') {
          return a.discount - b.discount;
        } else {
          return b.discount - a.discount;
        }
      }); 
      this.updateDisplayedItems(); 
    }
    currentPage: number = 0;
  itemsPerPage: number = 5;
    updateDisplayedItems() {
      if (this.coupons) {
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.displayedItems = this.coupons.slice(startIndex, endIndex);
      }
    }
    pageChanged(event: PageEvent) {
      this.currentPage = event.pageIndex;
      this.updateDisplayedItems();
    }
}


