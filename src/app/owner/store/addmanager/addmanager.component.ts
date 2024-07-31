import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from 'src/app/services/api';
import { ToastService } from 'src/app/toast-service';
@Component({
  selector: 'app-addmanager',
  templateUrl: './addmanager.component.html',
  styleUrls: ['./addmanager.component.scss']
})
export class AddmanagerComponent implements OnInit {
  managerdata:any={}
  ownerId: any;
  company:any;
  user: any;
  store: any=[];
  messageErrors: { [key: string]: string } = {};
  constructor(private apiService: ApiServices, private http:HttpClient,private route:Router,private toastService:ToastService) { }
  ngOnInit(): void {
    const user = this.apiService.getUser();
    if (user !== null) {
      this.ownerId=user._id;
         this.company=user.company
    } else {  console.log("error"); }
    this.managerdata={
      stores:"",
      company:this.company,
      firstName:"",
      lastName:"",
      email:"",
      password:"",
      phoneNumber:"",
      role:"manager",
      sexe: "male" ,
      status:"pending",
      image:"",
    }
    this.get()
  }
  image: File | null = null;
  onImageChange(event: any): void { const files = event.target.files;
    if (files.length > 0) { this.image = files[0]; }  }
   get() {
    this.apiService.getStoresOwner(this.ownerId).subscribe(
      (response) => {this.store = response[0]; },
      error => {  } ) }
  messageerror: string = "";
  selectedStoreIds:any= []
  addManager() {
    const requiredFields = {
      selectedStoreIds:"Store",
      firstName:"FirstName",
      lastName:"LastName",
      email:"Email",
      password:"Password",
      phoneNumber:"Phone Number",
      sexe: "Sexe" ,
      status:"Status",
    };
    this.messageErrors = {};
    for (const field in requiredFields) {
if (!this.managerdata[field]) { this.messageErrors[field] = `Please fill in the ${requiredFields[field]} field`; } }
const errorFields = Object.keys(this.messageErrors);
if (!this.managerdata.phoneNumber ||!this.managerdata.phoneNumber.number ||
  !this.managerdata.phoneNumber.internationalNumber   ) {
  this.messageErrors['phoneNumber'] = 'Please enter a valid phone number';
  setTimeout(() => { this.messageErrors['phoneNumber'] = ''; }, 2000);
  return;
}
if (errorFields.length > 0) {
  this.messageerror = `Please fill in the following fields: ${errorFields.map(field => requiredFields[field]).join(', ')}`;
  setTimeout(() => { this.messageerror = ""; }, 2000);
   } else{
    const phoneNumber=this.managerdata.phoneNumber.internationalNumber
      const formData = new FormData();
      formData.append('stores',JSON.stringify(this.managerdata.selectedStoreIds) );
      formData.append('company', this.company);
      formData.append('firstName',  this.managerdata.firstName);
      formData.append('email',  this.managerdata.email);
      formData.append('lastName',  this.managerdata.lastName);
      formData.append('password', this.managerdata.password);
      formData.append('phoneNumber',  phoneNumber);
      formData.append('role',  this.managerdata.role);
      formData.append('sexe', this.managerdata.sexe);
      formData.append('status',  this.managerdata.status);
      formData.append('image',  this.image); console.log( this.image)
      this.apiService.addmanager(formData).subscribe(
        (response) => {
          this.toastService.show('Manager créé avec succès', { classname: 'bg-success text-light' });
          this.route.navigateByUrl(`/store/allmanager`);
        },
        (error) => {
          if (error && error.error && error.error.error === 'Email already exists.') {
            this.erroremail = true;
            this.messageerror = "Email already exists. Please choose a different email.";
            setTimeout(() => {
              this.erroremail = false;
            }, 2000);
          } else {
            console.error('Error adding Manager', error);
          }
          this.toastService.show('Erreur lors de la création d\'un Manager', { classname: 'bg-danger text-light' });
        }
      ); }
  }
  erroremail=false;
  clearError(fieldName: string): void {
    this.messageErrors[fieldName] = '';
  }
showPassword: boolean = false;
togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
}
updateSelectedStores() {
  this.managerdata.selectedStoreIds = this.store.filter(str => str.selected).map(str => str._id);
  console.log(this.managerdata.selectedStoreIds);
}
someCondition: boolean = true;
}
