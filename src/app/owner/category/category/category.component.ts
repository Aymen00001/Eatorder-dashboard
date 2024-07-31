import { HttpClient } from '@angular/common/http';
import { COMPILER_OPTIONS, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from 'src/app/services/api';
import { Category } from '../../../models/category';
import { User } from 'src/app/models/user';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap/accordion/accordion.module';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: any;
  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

  disabled = false;


  constructor( private http: HttpClient, private router: Router,private api : ApiServices) { }
  errorMessage: string;
  name:string;
  File:File;
   category: Category ={
     name: "",
     description: "",
     parentCategory: "",
     availabilitys:[],
     image: "",
     storeId: null,
     userId: "",
     subcategories: [],
     products:[],

   }
  store: any[] ;
  user: User;
  Categorys: Category[] = [];
  selectedFile: File = null;
  fd = new FormData();

  selectedFileData: string | null;
  fileSizeError: boolean = false;
  fileTypeError: boolean = false;
  createFormData(event) {
    this.selectedFile = <File>event.target.files[0];
    // console.log(this.fd);
    this.fd.append('file', this.selectedFile, this.selectedFile.name);
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileData = e.target.result;
       
      };
      reader.readAsDataURL(file);
     
    }


    // Autres opérations à effectuer en cas de succès
  }

  ngOnInit(): void {
    const user = this.api.getUser();
          if (user !== null) {
            this.user = user;
            
          //  console.log(user._id)
                
          } else {
            // Handle the case when the user is null
            // console.log("error");
          }
      
          this.get();
          
          this.api.getCategoriesByStore(this.api.getStore()).subscribe(
            (response: any) => {
              this.categories = response.categories;
            },
            (error: any) => {
              console.error(error);
            }
          );
          this.fetchCategorys();
     
  }
  getstoreid(id){
    // console.log(id);
    this.category.storeId=id;


  }
  fetchCategorys() {
    this.api.getCategoriesByStore(this.api.getStore()).subscribe(
      response => {
        this.Categorys = response.categories;
        // console.log(this.Categorys)
      
      },
      error => {
        console.error(error);
      }
    );
  }
  get()
  {
    
   this.api.getStoresOwner(this.user._id).subscribe(
     (response  )=> {
      
       this.store=response[0];
    
      // console.log(this.store);
      
     },
     error =>{
       if (error.error && error.error.message) {
         console.error(error.error.message);
         this.errorMessage = error.error.message;
   
 
 
       } else {
         console.error('An error occurred during login.');
         this.errorMessage = 'An error occurred during login.';
       }
     }
     
     
   )
  }


  onFileSelected(event: any): void {
    const file = this.selectedFile;
this.category.userId=this.user._id.toString();
    this.api.addCategory(this.category,file ).subscribe(
     
      response => {
   
        this.router.navigate(['/category/allcategory']);

      },
      error => {
        
        // Gérer les erreurs
        if (error.error && error.error.message) {
          console.error(error.error.message);
          //console.error(this.category.storeId);
          this.errorMessage = error.error.message;
    


        } else {
          console.error('An error occurred during login.');
          this.errorMessage = 'An error occurred during login.';
        }
      }
    );
  }


  add() {
    const file = this.selectedFile;
    // console.log(file);
    // Vérification des mots de passe correspondants
    this.api.addCategory(this.category,file ).subscribe(
     
      response => {
        // console.log(this.category);
        this.fetchCategorys();
        // Gérer la réponse de succès
        // console.log(response);

      },
      error => {
        
        // Gérer les erreurs
        if (error.error && error.error.message) {
          console.error(error.error.message);
          console.error(this.category.storeId);
          this.errorMessage = error.error.message;
    


        } else {
          console.error('An error occurred during login.');
          this.errorMessage = 'An error occurred during login.';
        }
      }
    );
  }

      

    };




