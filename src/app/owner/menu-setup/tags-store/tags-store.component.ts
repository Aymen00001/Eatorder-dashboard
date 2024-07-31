import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/toast-service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ApiServices } from 'src/app/services/api';

@Component({
  selector: 'app-tags-store',
  templateUrl: './tags-store.component.html',
  styleUrls: ['./tags-store.component.scss']
})
export class TagsStoreComponent implements OnInit {
  totalItems: number;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  displayedItems: any[] = [];
  constructor(private modalService: NgbModal, private http: HttpClient,private apiservice: ApiServices,private toastService:ToastService) { }

  ngOnInit(): void {
    this.getalltags()
  }
  //AddTags
  openModal(content: any) {
    this.modalService.open(content, { size: 'lg' }).result.then(
      (result) => {
        // Handle the result when modal is closed
        //console.log(`Modal closed with: ${result}`);
      },
      (reason) => {
        // Handle the reason when modal is dismissed
        //console.log(`Modal dismissed with: ${reason}`);
      }
    ).catch((error) => {
      console.error('Error retrieving Store', error);
    });
  }
    nametag:any;
    addTags(){
      const storeId = localStorage.getItem('storeid');
      const name=this.nametag;
      this.apiservice.addtags({name,storeId}).subscribe(
        (response) => { 
          this.toastService.show('Tags successfully added.', { classname: 'bg-success text-light' });
           this.getalltags()
        },
        (error) => { console.error('Error adding Tag:', error);}
      );
    }
    //fin addtags
    //getalltags
    tags:any=[]
    orderNumber:any;
    getalltags(){
      const storeId = localStorage.getItem('storeid');
      this.apiservice.getalltags(storeId).subscribe((response:any)=>{
        this.tags = response;    
           this.tags.forEach((orderItem, index) => {
            this.orderNumber = index + 1;
            orderItem.orderNumber = index + 1;
          });
      },
    (error)=>{
      console.error('Error  Tag:', error)
    })
    }
    deletteTags(tagid: any) {
      const isConfirmed = confirm('Are you sure you want to delete this Tags?');
      if (isConfirmed) {
        this.apiservice.deleteTags(tagid).subscribe(
          (response: any) => {  this.getalltags() },
          (error: any) => { console.error('Error deleting Tags:', error);}
        );} else {  console.log('Deletion canceled'); } }
        objectToEdit: any;

        openModal2(content: any, object: any) {
          // Assigner l'objet à modifier à la variable locale
          this.objectToEdit = object;
          // Ouvrir le modal avec le contenu et les données appropriés
          this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
        }

        UpdateTags(TagsId:any){
          this.apiservice.updatetags(TagsId,this.objectToEdit).subscribe(
            (response) => { 
              this.toastService.show('Tags Update successfully .', { classname: 'bg-success text-light' });
               this.getalltags()
            },
            (error) => { console.error('Error Update Tag:', error);}
          );
        }
}
