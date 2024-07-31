import { Component, NgZone, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ROUTES, ROUTESUSER } from './sidebar-routes.config';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SidebarService } from "./sidebar.service";
import { TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';

import * as $ from 'jquery';
import { ApiServices } from 'src/app/services/api';
import { User } from 'src/app/models/user';
import { Store } from 'src/app/models/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllComponent } from 'src/app/owner/orders/all/all.component';

import { Howl } from 'howler';
import { ToastService } from 'src/app/toast-service';
declare global {
  interface Window {
    socket: Socket;
  }
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('content1', { static: true }) content1: TemplateRef<any>;

  errorMessage: string;

  public menuItems: any[];
  user: User;
  store: any[];
  selectedOption: any;
  ownerId: string = '';
  name: string;
  address: string;
  phoneNumber: string = '';
  description: string = 'fast food ';
  Data = new FormData();

  sound = new Howl({
    src: ['assets/Ring.mp3'], // Replace with the actual path to your audio file
    volume: 1.0, // Adjust the volume (0.0 to 1.0)
    loop: false, // Set to true if you want the sound to loop
  });
  countries: string[] =
    [
      "1. Sole Proprietorship",
      "2. Partnership",
      "3. Limited Partnership (LP)",
      "4. Limited Liability Partnership (LLP)",
      "5. Corporation",
      "6. Limited Liability Company (LLC)",
      "7. Cooperative",
      "8. Nonprofit Organization",
      "9. Trust",
      "10. Joint Venture",
      "11. Franchise",
      "12. Public Limited Company (PLC)",
      "13. Private Limited Company (Ltd)",
      "14. Sole Trader",
      "15. Social Enterprise",
      "16. Community Interest Company (CIC)",
      "17. Professional Corporation",
      "18. B-Corporation (B-Corp)",
      "19. Holding Company",
      "20. State-Owned Enterprise (SOE)",
      "21. Mutual Company",
      "22. Not-for-Profit Corporation",
      "23. Foundation",
      "24. Society",
      "25. Special Purpose Vehicle (SPV)",
      "26. General Partnership",
      "27. Silent Partnership",
      "28. Cooperative Corporation",
      "29. Private Unlimited Company",
      "30. Family Limited Partnership (FLP)",
      "31. Professional Limited Liability Company (PLLC)",
      "32. S Corporation",
      "33. Public-Private Partnership (PPP)",
      "34. Community Benefit Society",
      "35. Investment Company",
      "36. Municipal Corporation",
      "37. Public Corporation",
      "38. State-Owned Corporation",
      "39. Employee Stock Ownership Plan (ESOP)",
      "40. Statutory Corporation",
      "41. Simplified Joint Stock Company (SAS)",
      "42. Public Limited Company (SA)",
      "43. General Partnership (SNC)",
      "44. Limited Partnership by Shares (SCA)",
      "45. Limited Liability Company (SARL)",
      "46. Partnership Limited by Shares (SEP)",
      "47. Cooperative Society of Production (SCOP)",
      "48. Civil Society (SC)",
      "49. Professional Services Company (SEL)",
      "50. Variable Capital Investment Company (SICAV)",
      "51. Partnership Limited by Shares (SCA)",
      "52. Financial Company for Professional Liberale (SPFPL)",
      "53. Listed Real Estate Investment Company (SIIC)",
      "54. Variable Capital Investment Company (SICAF)",
      "55. Cooperative Society of Collective Interest (SCIC)",
      "56. Free Partnership (SLP)",
      "57. Special Limited Partnership (SCSp)",
      "58. Simplified Joint Stock Company with a Sole Shareholder (SASU)",
      "59. Simplified Single-Person Limited Liability Company (SASU)",
      "60. Single-Person Limited Liability Company (SARLU)",
      "61. Worker Participation Company (SAPO)",
      "62. Real Estate Investment Company with Variable Capital (SICAV immobilière)",
      "63. Agricultural Grouping for Joint Exploitation (GAEC)",
      "64. Agricultural Land Grouping (GFA)",
      "65. Agricultural Land Company (GAF)",
      "66. Economic Interest Group (GIE)",
      "67. Association under the 1901 Law",
      "68. Single-Person Limited Liability Company (EURL)"
    ];
  companyData: any = {};
  ownerrId: any;
  userr: User;
  currenyData: any = {};
  message: string = ''; clientId: string;
  roleadmin: string;
  Automatic:any

  ngOnDestroy(): void {
    this.authService.closeConnection();
   // window.socket.disconnect();
   if (window.socket) {
    window.socket.disconnect();
  }

  }

  constructor(private modalService: NgbModal, public sidebarservice: SidebarService, private router: Router, private translate: TranslateService, 
    private authService: ApiServices, private ngZone: NgZone,private toastService: ToastService) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) { }
      if (event instanceof NavigationEnd && $(window).width() < 1025 && (document.readyState == 'complete' || false)) {
        this.toggleSidebar();
      }
      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  
  }
  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    if ($(".wrapper").hasClass("nav-collapsed")) {
      $(".wrapper").removeClass("nav-collapsed");
      $(".sidebar-wrapper").unbind("hover");
    } else {
      $(".wrapper").addClass("nav-collapsed");
      $(".sidebar-wrapper").hover(
        function () { $(".wrapper").addClass("sidebar-hovered"); },
        function () { $(".wrapper").removeClass("sidebar-hovered"); })
    }
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['message']) {
      // Trigger an alert when the 'message' property changes
      this.ngZone.run(() => {
        alert('Message changed: ' + this.message);
      });
    }
  }

  openAlert() {
    alert(this.message);
  }
  getAllorder() {
    this.authService.getOrderByStoreId(this.authService.getStore()).subscribe(
      (response) => { this.authService.orders = response; },
      error => { });
  }
  /*showactive() {
    this.socket.on('connect', (data: any) => {
      console.log("teeest");
      
      // console.log("hello",this.socket.id)
      // console.log("daaaa",this.socket.data)
      // this.socket.on('receive_data', (data: any) => {
      //   localStorage.setItem('receivedata', JSON.stringify(data));
      // });
    });

  }
  socket: any*/
  //code socket
  /*socket:any
  // initSocket() {
    const storedData = localStorage.getItem('receivedata');
  //  console.log("storedData",storedData);
    if (storedData) {
      // Parse the stored data
      let parsedData = JSON.parse(storedData);
      //console.log("parsedData", parsedData);
      // Find the delivered items
      const deliveredItems = parsedData.filter((item: any) => item.data.status === 'delivered'|| item.data.status === 'canceled');
      // Get the delivery IDs of delivered items
      const deliveredIds = deliveredItems.map((item: any) => item.data.delivery_id);
    
      // Filter out items with the same delivery_id as delivered items
      parsedData = parsedData.filter((item: any) => !deliveredIds.includes(item.data.delivery_id));
    
      // Update the local storage with the filtered data
      localStorage.setItem('receivedata', JSON.stringify(parsedData));
    //  console.log("Data after removal of items with same delivery_id as delivered items:", parsedData);
    }
        this.socket.on('connect', (data: any) => {
           //console.log("hello",this.socket.id)
           //console.log("daaaa",this.socket.data)
           this.socket.on('receive_data', (data: any) => {
          localStorage.setItem('receivedata', JSON.stringify(data));
                  }); 
        });
             
  }*/

  ngOnInit() {
//     window.socket = io('https://server.eatorder.fr:8000');
//     const idstore = localStorage.getItem("storeid");
//     window.socket.on('connect', () => {
//      // console.log("connect")
//       window.socket.emit('join_room_orders', idstore);
//     });
// this.setupSocketConnection();
//     this.getstorebyid();
//     this.getorderbynumber();

    this.authService.getUberToken().subscribe(
      (response) => {
        const accessToken = response.accessToken;
        localStorage.setItem('accessToken', accessToken);
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de la récupération du token :', error);
      }
    );
this.roleadmin=this.authService.getRole();
    let userRole = this.authService.getRole();
    if (userRole == "admin") { this.menuItems = ROUTES.filter(menuItem => menuItem); }
    else {
      this.menuItems = ROUTESUSER.filter(menuItem => menuItem);
      this.menuItems = ROUTESUSER.filter(menuItem => menuItem);
      window.socket = io('https://server.eatorder.fr:8000');
    const idstore = localStorage.getItem("storeid");
    window.socket.on('connect', () => {
     // console.log("connect")
      window.socket.emit('join_room_orders', idstore);
    });
this.setupSocketConnection();
    //this.getstorebyid();
   // this.getorderbynumber();
    }
    $.getScript('./assets/js/app-sidebar.js');
    this.translateSidebarMenu().catch(error => {
      console.error('Erreur lors de la traduction du menu:', error);
    });
    const user = this.authService.getUser();
    if (user !== null) {
      this.user = user;
    } else { console.log("error"); }
    this.get();
    const storedValue = localStorage.getItem('storeid');
    this.selectedOption = storedValue;
    if (!this.selectedOption && userRole != "admin") { this.openSm(this.content) } else { }
    const userr = this.authService.getUser();
    if (userr !== null) {
      this.userr = userr;
      this.ownerrId = user._id;
    } else { console.log("error"); }
    this.companyData = {
      ownerId: this.ownerrId,
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country_iso2: ""
      },
      phoneNumber: "",
      duns: "",
      email: "",
      website: "",
      legalstatus: "",
      image: ""
    }
    this.currenyData = {
      ownerId: this.ownerrId,
      name: "My Store",
      description: "Store",
      address: "",
      phoneNumber: "",
      latitude: "",
      longitude: "",
      rangeValue: 25  // Valeur par défaut
    }
   

  }
  openSm(content) {
    this.modalService.open(content, { size: 'md', backdrop: 'static', keyboard: false });
  }
  getstoreid($id) {
    localStorage.setItem('storeid', $id);
    window.location.reload();
  }
  get() {
    if (this.roleadmin === 'admin') {
      this.store = [];
      return;
    }
    this.authService.getStoresOwner(this.user._id).subscribe(
      (response) => {
       // console.log(this.store)
        this.store = response[0] || [];
      },
      error => {
        if (error.error && error.error.message) {
          console.error(error.error.message);
          this.errorMessage = error.error.message;
          this.store = [];  // Initialize store as an empty array on error

        } else {
          console.error('An error occurred during login.');
          this.errorMessage = 'An error occurred during login.';
        }
      })
  }
  test() { console.log("test") }
  messageErrors: { [key: string]: string } = {};
  messageerror: string = "";
  addCompany() {
    const requiredFields = {
      name: "Name",
      address: "Address",
      phoneNumber: "Phone Number",
      duns: "Duns",
      email: "Email",
      website: "Web Site",
      legalstatus: "Legal Status"
    };
    const emailPattern = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.messageErrors = {};
    for (const field in requiredFields) {
      if (!this.companyData[field]) { this.messageErrors[field] = `Please fill in the ${requiredFields[field]} field`; }
    }
    if (!emailPattern.test(this.companyData.email)) { this.messageErrors['email'] = 'Please enter a valid email address'; }
    const errorFields = Object.keys(this.messageErrors);
    if (errorFields.length > 0) {
      this.messageerror = `Please fill in the following fields: ${errorFields.map(field => requiredFields[field]).join(', ')}`;
      setTimeout(() => { this.messageerror = ""; }, 2000);
    } else {
      const formData = new FormData();
      formData.append("ownerId", this.companyData.ownerId);
      formData.append("name", this.companyData.name);
      formData.append("address", JSON.stringify(this.companyData.address));
      formData.append("phone_details", JSON.stringify(this.companyData.phoneNumber));
      formData.append("duns", this.companyData.duns);
      formData.append("email", this.companyData.email);
      formData.append("website", this.companyData.website);
      formData.append("legalstatus", this.companyData.legalstatus);
      formData.append("image", this.image);
      formData.append("banner", this.image2);
      this.authService.addCompany(formData).subscribe(
        (companyResponse) => { window.location.reload(); },
        (companyError) => { console.error('Error adding Company:', companyError); }
      );
    }
  }
  clearError(fieldName: string): void {
    this.messageErrors[fieldName] = '';
  }
  image: File | null = null;
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files.length > 0) { this.image = files[0]; }
  }
  image2: File | null = null;
  onImageChange2(event: any): void {
    const files = event.target.files;
    if (files.length > 0) { this.image = files[0]; }
  }
  addStores(name, description, address, phoneNumber, latitude, longitude, rangeValue, ownerId) {
    this.currenyData.name = name;
    this.currenyData.description = description;
    this.currenyData.address = address;
    this.currenyData.phoneNumber = phoneNumber;
    this.currenyData.latitude = latitude;
    this.currenyData.longitude = longitude;
    this.currenyData.rangeValue = rangeValue;
    this.currenyData.ownerId = ownerId;
    this.authService.addStores(this.currenyData).subscribe(
      (storesResponse) => {
        this.addConsumationMode("delivery", "Mode Livraison", 0, 0, false, "product", 0, storesResponse.store._id);
        this.addConsumationMode("Takeaway", "Mode emporter", 0, 0, false, "product", 0, storesResponse.store._id);
        this.addConsumationMode("Dine-in", "Mode Sur Place", 0, 0, false, "product", 0, storesResponse.store._id);
      },
      (storesError) => {
        console.error('Error adding Stores', storesError);
      }
    );
  }
  consumationData = {
    name: '',
    description: '',
    frais: null, 
    taux: null,
    applyTaux: false, 
    applicationType: '', 
    storeId: '',
    reduction: '' 
  };
  addConsumationMode(name, description, frais, taux, applyTaux, applicationType, reduction, storeId) {
    this.consumationData.name = name,
      this.consumationData.description = description,
      this.consumationData.frais = frais,  
      this.consumationData.taux = taux, 
      this.consumationData.applyTaux = applyTaux, 
      this.consumationData.applicationType = applicationType, // Remplacez par 'product' ou 'order'

      this.consumationData.reduction = reduction // Remplacez par l'ID réel du magasin
    this.consumationData.storeId = storeId
    // console.log(this.consumationData);

    // Appelez le service pour ajouter le mode de consommation
    this.authService.addConsumationMode(this.consumationData)
      .subscribe(
        response => {
         // console.log('Mode de consommation ajouté :', response);

        },
        error => {
          console.error('Erreur lors de l\'ajout du mode de consommation :', error);
        }
      );
  }
  async translateSidebarMenu() {
    const translationPromises = this.menuItems.map(item => {
      const translationKey = item.title || '';
      return this.translate.get(translationKey).toPromise();
    });
    try {
      const translations = await Promise.all(translationPromises);
      this.menuItems.forEach((item, index) => {
        item.title = translations[index];
        if (item.submenu) {
          item.submenu.forEach(subItem => {
            const subTranslationKey = subItem.title || '';
            subItem.title = this.translate.instant(subTranslationKey);
          });
        }
      });
    } catch (error) { console.error('Erreur lors de la traduction du menu:', error); }
  }
  //socket
  processedOrders: Set<string> = new Set(); // Track processed orders
  iduser:any
  newMessage:any
  setupSocketConnection(): void {
    this.iduser=localStorage.getItem('user')
    window.socket.on("receive_orders", (data) => {
      this.newMessage = data.data;
      this.processedOrders.add(this.newMessage._id);

       if (this.newMessage === 'Your order is missed') {
        this.sound.play();
        this.getAllorder();
        this.message = this.newMessage;
        this.showDanger(this.message);
      } else if ( this.iduser._id!== this.newMessage.updatedBy ){
        this.sound.play();
        this.getAllorder();
        this.message = this.newMessage;
        this.showSuccess("Order has been changed from another interface.");
      } else {
        this.sound.play();
        const store = localStorage.getItem('storeid');
        this.authService.getStroreById(store).subscribe(
          (response) => {
            //commande automatique
            this.Automatic = response.managingacceptedorders.Automatic; 
            if (this.Automatic === true) {
              //console.log(this.newMessage);
             // this.updateStatusAutomatically(JSON.parse(this.newMessage.substring(1)));
             // console.log("Automatic is true. Performing action...");
            } else {
             // console.log("Automatic is false. Performing another action or do nothing...");
            }
            //uber automatique 
      // Uber automatique
      if (response.organizations && response.organizations.length > 0) {
        const options = response.organizations[0].options;
        const automaticOption = options.find(option => option.name === 'Automatic');
        this.automaticuber = automaticOption ? automaticOption.checked : false;
       // console.log('Automatic is', this.automaticuber ? 'true' : 'false');
        if (this.automaticuber === true) {
        //  console.log("id", response._id);
          this.uberdelevery(response._id);
        } else {
         // console.log("Automatic Uber is false. No action taken.");
        }
      } else {
        console.error('organizations is undefined or empty');
      }

          },
          (error) => { console.error('Error retrieving Store', error); }
        );
        this.getAllorder();
        this.message = this.newMessage;
        this.ordermassage = "A new customer has placed an order.";
        this.showSuccess(this.ordermassage);
      }
    });
    window.socket.on('error', (error) => {
      console.error('WebSocket Error:', error);
      // Gérer les erreurs de connexion WebSocket
      console.warn("Error");
    });
  }
 
      // let i =0;
    // let k=0;
    // while (i<order.length - 2) {
    //   if(order[i]==='{'){
    //     k++;
    //   }
    //   if(order[i]==='}'){
    //     k--;
    //   }

    //   if (order[i]==='_' && order[i+1]==='i' && order[i+2]==='d' && k==1) {
    //     i = i+6
    //     this.orderId = '';
    //     while(order[i]!=='"'){
    //       this.orderId = this.orderId + order[i]
    //       i++
    //     }
    //     break;
    //   } 
    //   i++
    // }

    updateStatusAutomatically = (order) => {
      const idUser = JSON.parse(this.iduser)._id;
      const selectedStatus = 'accepted';
    
      this.authService.updateStatusorders({ 
        selectedItemId: order._id, 
        selectedStatus, 
        updatedBy: idUser.toString()
      }).subscribe(
        (response) => {
        //  console.log('Order status updated successfully', response);
          this.processedOrders.delete(order._id); // Remove order from processed set
          this.newMessage.delete(order._id);
        },
        (error) => {
          console.error('Error updating order status', error);
        }
      );
    }
    // Method to fetch store details by ID
    private getstorebyid(): void {
      this.authService.getStroreById(this.authService.getStore()).subscribe(
        (data) => {
          // this.commande = data.automaticCommande;
          this.commande = data.managingacceptedorders.Automatic
          this.deliveryuber = data.modeUberdirect;
        },
        error => {
          console.error('Error fetching store details:', error);
        }
      );
    }
    uberdelevery(id:string){
      //console.log("id",id)
      this.authService.Creerdevis(id).subscribe(
        (response) => {
        //  console.log("uber",response)
      
        },
        (error) => {
          console.error('Erreur lors de la création du devis :', error);
        }
      );
    }
    ordermassage: string = '';
    commande: Boolean
    dataorder: any = []
    deliveryuber: any;
    socket: Socket;
    automaticuber: any;
     // Method to fetch orders by number
  getorderbynumber() {
    this.authService.getallorderbystore(this.authService.getStore()).subscribe(
      (response) => {
        this.dataorder = response;
      }, error => { console.error('Error fetching orders', error); }
    );
  }
  private showSuccess(message: string): void {
    this.toastService.show(message, { delay: 3000 });
  }
  private showDanger(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 5000 });
  }
}
