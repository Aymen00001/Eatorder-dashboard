import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user'
import { ApiServices } from '../services/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  user: User = {} as User; // Initialize with an empty User object
  currentUser = JSON.parse(localStorage.getItem('user')!);
  userId: string = this.currentUser._id;
  firstName: string = this.currentUser.firstName;
  lastName: string = this.currentUser.lastName; // Initialize with the current name
  phoneNumber: string = this.currentUser.phoneNumber; // Initialize with the current phone number
  registerForm!: FormGroup;
  image: string = this.currentUser.image;
  imageUrl: string = this.baseUrl  + this.image;

  submitted = false;
  formFile: any;
  public imagePath;
  imgURL: any;
  public message: string;
  selectedFile: any;
  constructor(private api: ApiServices, private formBuilder: FormBuilder) { }
  onFileSelected(File:File): void {
    const file = File;

    this.api.uploadImageProfil(file, this.user._id).subscribe(
      (response: any) => {
        console.log('Image uploaded successfully');
        this.user = response.owner
        localStorage.setItem('user', JSON.stringify(this.user));
 
        
        location.reload();
      },
  
      error => {
        console.error('Failed to upload image', error);
        // Handle the error here if needed
      }
    );
  }
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
    console.log(this.imagePath);
    console.log(this.imagePath[0].size);
    this.onFileSelected(files[0])
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from storage
    console.log('token')
    const user = this.api.getUser();
    if (user !== null) {
      this.user = user;
      this.currentUser.image = user.image;
            localStorage.setItem('user', JSON.stringify(this.currentUser));
          console.log(user.image)
          
    } else {
      // Handle the case when the user is null
      console.log("error");
    }
    this.registerForm = this.formBuilder.group({
      // title: ['', Validators.required],
      firstName: [this.currentUser.firstName, Validators.required],
      lastName: [this.currentUser.lastName, Validators.required],
      phoneNumber: [this.currentUser.phoneNumber, Validators.required],
    }, {
    });
    console.log(this.imageUrl)
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {


      return;
    }

    // display form values on success
    this.updateProfile();

  }
  _upload(){
    this.formFile.nativeElement.click()
   
}
  updateProfile(): void {
    const token = localStorage.getItem('token'); // Retrieve the token from storage
    const storedData = localStorage.getItem('key');

    if (token) {
      this.api.updateProfile(this.firstName, this.lastName, this.phoneNumber, token)
        .subscribe(
          response => {
            // Handle successful profile update response
            console.log(response);

            var currentUser = JSON.parse(localStorage.getItem('user')!);
            currentUser.firstName = this.firstName;
            currentUser.lastName = this.lastName;
            currentUser.phoneNumber = this.phoneNumber;
            localStorage.setItem('user', JSON.stringify(currentUser));



            console.log(currentUser);
            window.location.reload();




          },
          error => {
            // Handle profile update error
            console.error(error);
          }
        );
    }
    else {
      console.error('Token is missing or expired');
    }
  }



  onImageSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];

      // Upload the file to the server
      const formData: FormData = new FormData();
      formData.append('image', file);

      // Call the API service method to update the user's image
      const token = localStorage.getItem('token');
      
    }
  }

}
