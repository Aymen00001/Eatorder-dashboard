import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {
  images: any[] = [];
  previewModalVisible: boolean = false;
  user: User = {} as User; // Initialize with an empty User object
  selectedImageName: string;
  selectedImageFile: string;
  selectedFile: File | null;
  selectedFileData: string | null;
  userId: number = 0; // Initialisez la variable avec une valeur par défaut appropriée
  selectedMenuItem: string = ' ';
  baseUrl = 'http://localhost:8000/'; // L'URL de votre serveur Node.js
  nbreImage = 0;
  searchText: string = '';
  fileSizeError: boolean = false;
  fileTypeError: boolean = false;
  totalSize: string = '0.00'; // Declare the property with a default value of '0.00'
  totalImageSize: string = '0.00'; // Declare the property for total image size with a default value of '0.00'
  totalDocSize: string = '0.00';
  nbreImageFile: number = 0;
  nbreDocument: number = 0;
  progressValue: number = 0;

  imageProgress: number = 0;
  documentProgress: number = 0;
  otherProgress: number = 0;



  constructor(private apiServices: ApiServices, private modalService: NgbModal, private translate: TranslateService
  ) { }

  ngOnInit() {
    const user = this.apiServices.getUser();
    if (user !== null) {
      this.user = user;
      this.userId = this.user._id;

      console.log(this.userId)
    } else {
      // Handle the case when the user is null
    }
    this.getImages();

  }



  openOwnerDetailsModal(content: any, image: any) {
    this.selectedImageName = this.baseUrl + this.userId + '/' + image.name;
    console.log(this.selectedImageName);
    this.selectedImageFile = image.name;
    console.log(this.selectedImageFile);

    // Vérification si le fichier sélectionné est un PDF
    if (this.selectedImageName.toLowerCase().endsWith('.pdf') || this.selectedImageName.toLowerCase().endsWith('.docx')) {
      window.open(this.selectedImageName, '_blank');
    } else {
      this.modalService.open(content, { scrollable: true });
    }
  }


  isPDFFile(fileType: string): boolean {
    return fileType === 'application/pdf';
  }

  isImageFile(image: any): boolean {
    return image.mimeType === 'image/png' || image.mimeType === 'image/jpeg' || image.mimeType === 'image/jpg';
  }

  isDocumentFile(image: any): boolean {
    return image.mimeType === 'application/pdf' || image.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
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
    console.log(file);
      const fileSize = file.size; // Obtenir la taille du fichier en octets

      const maxFileSize = 500 * 1024; // 500 Ko en octets
      if (fileSize > maxFileSize) {
        // Vérifier si la taille du fichier dépasse la limite autorisée
        this.selectedFile = null;
        this.selectedFileData = null;
        this.fileSizeError = true;
        return; // Sortir de la méthode si la taille du fichier dépasse la limite autorisée
      }
    } else {
      this.selectedFile = null;
      this.selectedFileData = null;
    }

    this.fileTypeError = false;
    this.fileSizeError = false;

    // Autres opérations à effectuer en cas de succès
  }


  hasDocumentFiles(): boolean {
    return this.images.some(image => this.isDocumentFile(image));
  }

  hasImageFiles(): boolean {
    return this.images.some(image => this.isImageFile(image));
  }


  onMenuItemSelected(menuItem: string) {
    this.selectedMenuItem = menuItem;
    console.log(menuItem);

    switch (menuItem) {
      case 'addFile':
        // Code à exécuter lorsque "Add File" est sélectionné
        break;
      case 'allFiles':
        // Code à exécuter lorsque "All Files" est sélectionné
        break;
      case 'myDevices':
        // Code à exécuter lorsque "My Devices" est sélectionné
        break;
      // Ajoutez d'autres cas pour les autres éléments de menu
      default:
        // Code à exécuter lorsque l'élément de menu n'est pas reconnu
        break;
    }
  }


  downloadImage(image: any): void {
    const imageUrl = this.baseUrl + this.userId + '/' + image.name;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';

    // Set the download attribute based on the image file type
    if (image.type === 'image/png') {
      link.download = image.name + '.png';
    } else if (image.type === 'image/jpeg') {
      link.download = image.name + '.jpeg';
    }

    link.click();
  }


  isPreviewSupported(mimeType: string): boolean {
    return mimeType === 'image/png' || mimeType === 'image/jpeg' || mimeType === 'image/jpg';
  }


  deleteImage(image: any) {
    const fileName = image.name;
    let confirmationMessage: string;
  
    this.translate.get('msgDeleteFile').subscribe((translation: string) => {
      confirmationMessage = translation;
  
      if (confirm(confirmationMessage)) {
        console.log(fileName);
        this.apiServices.deleteFile(this.userId, fileName)
          .subscribe(
            () => {
              console.log('Fichier supprimé avec succès');
              // Perform additional actions after deleting the file if necessary
              // For example, you can remove the image from the 'images' array:
              const index = this.images.indexOf(image);
              if (index !== -1) {
                this.images.splice(index, 1);
              }
            },
            (error) => {
              console.error('Erreur lors de la suppression du fichier', error);
              // Handle file deletion errors here
            }
          );
      }
    });
  }
  


  onFileSelected(event: any): void {
    const file = this.selectedFile;

    this.apiServices.uploadImage(file, this.user._id).subscribe(
      response => {
        console.log('Image uploaded successfully');
        location.reload();

        // Process the response here if needed
      },
      error => {
        console.error('Failed to upload image', error);
        // Handle the error here if needed
      }
    );
  }



  getImages(): void {
    this.apiServices.getImages(this.user._id).subscribe(
      response => {
        this.images = response.images;
        this.nbreImage = this.images.length;

        // Calculate total size for images and documents
        let imageSize = 0;
        let docSize = 0;

        for (const image of this.images) {
          if (this.isImageFile(image)) {
            imageSize += image.size;
          } else if (this.isDocumentFile(image)) {
            docSize += image.size;
          }
        }

        // Convert total sizes to kilobytes (KB) with 2 decimal places
        const totalImageSizeKB = (imageSize / 1024).toFixed(2);
        const totalDocSizeKB = (docSize / 1024).toFixed(2);

        // Assign the total sizes to the respective properties in your component
        this.totalImageSize = totalImageSizeKB;
        this.totalDocSize = totalDocSizeKB;
        this.totalSize = (parseFloat(totalImageSizeKB) + parseFloat(totalDocSizeKB)).toFixed(2);

        // Calculate the number of documents
        this.nbreDocument = this.images.filter(image => this.isDocumentFile(image)).length;
        this.nbreImageFile = this.images.filter(image => this.isImageFile(image)).length;

        // Calculate the progress percentages

        const totalFiles = 100; // Replace with the actual total number of files
        this.progressValue = (this.nbreImage / totalFiles) * 100;
        console.log("heel " + this.progressValue);
        // Process the response here
        console.log(response); // Example processing: log the images to the console
      },
      error => {
        // Handle errors here
        console.error(error);
      }
    );
  }


  getImageIcon(type: string): string {
    if (type === 'application/pdf') {
      return 'bx bxs-file-pdf me-2 font-24 text-danger';
    } else if (type === 'image/png' || type === 'image/jpeg') {
      return 'bx bxs-file-image me-2 font-24 ';
    } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'bx bxs-file-doc me-2 font-24 text-success';
    } else {
      return 'bxs-file';
    }
  }
  getTextColor(mimeType: string): string {
    if (mimeType.startsWith('image/') || mimeType === 'application/msword' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'text-primary';
    } else {
      return 'text-danger';
    }
  }


}
