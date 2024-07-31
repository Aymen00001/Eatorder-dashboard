import { Component, OnInit, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiServices } from './services/api';
import { Howl } from 'howler';
import { ToastService } from './toast-service';
import { io, Socket } from 'socket.io-client';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  eventSubscription: Subscription;
  errorSubscription: Subscription;
  message: string = '';
  ordermassage: string = '';
  sound: Howl;
  commande: Boolean
  dataorder: any = []
  deliveryuber: any;
  socket: Socket;
  automaticuber: any;
  constructor(
    private translate: TranslateService,
    private authService: ApiServices,
    private ngZone: NgZone,
    private toastService: ToastService, private socketService: WebsocketService
  ) {
    this.socket = null;

    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('fr');
    this.sound = new Howl({
      src: ['assets/Ring.mp3'], 
      volume: 1.0,
      loop: false,
    });
  }
  Automatic:any
  ngOnInit(): void {
//     window.socket = io('https://server.eatorder.fr:8000');
//     const idstore = localStorage.getItem("storeid");
//     window.socket.on('connect', () => {
//       window.socket.emit('join_room_orders', idstore);
//     });
// this.setupSocketConnection();
    this.getstorebyid();
    //this.getorderbynumber();
    //connect to sse
    const tokenSSE = localStorage.getItem('token');
    // if (tokenSSE !== null) {
    //   // If SSE token is present, set up SSE connection
    //   this.setupSSEConnection();
    // } else {
    //   // If SSE token is not present, handle case where user is not logged in
    //   // For example, redirect to login page or show a message
    //   console.log('User is not logged in. Handle appropriately.');
    // }
    // Set default language
    const defaultLang = localStorage.getItem('defaultLang');
    if (defaultLang && this.translate.getLangs().includes(defaultLang)) {
      this.translate.setDefaultLang(defaultLang);
    } else {
      this.translate.setDefaultLang('en');
    }
  }
  iduser:any
 /* setupSocketConnection(): void {
    this.iduser=localStorage.getItem('user')
    window.socket.on("receive_orders", (data) => {
      const newMessage = data.data;
       if (newMessage === 'Your order is missed') {
        this.sound.play();
        this.getAllorder();
        this.message = newMessage;
        this.showDanger(this.message);
      } else if ( this.iduser._id!== newMessage.updatedBy ){
        this.sound.play();
        this.getAllorder();
        this.message = newMessage;
        this.showSuccess("Order has been changed from another interface.");
      } else {
        this.sound.play();
        const store = localStorage.getItem('storeid');
        this.authService.getStroreById(store).subscribe(
          (response) => {
            //commande automatique
            this.Automatic = response.managingacceptedorders.Automatic; 
                    if (this.Automatic === true) {
              this.updateStatusAutomatically(JSON.parse(newMessage.substring(1)))
              console.log("Automatic is true. Performing action...");
            } else {
              console.log("Automatic is false. Performing another action or do nothing...");
            }
            //uber automatique 
      // Uber automatique
      if (response.organizations && response.organizations.length > 0) {
        const options = response.organizations[0].options;
        const automaticOption = options.find(option => option.name === 'Automatic');
        this.automaticuber = automaticOption ? automaticOption.checked : false;
        console.log('Automatic is', this.automaticuber ? 'true' : 'false');
        if (this.automaticuber === true) {
          console.log("id", response._id);
          this.uberdelevery(response._id);
        } else {
          console.log("Automatic Uber is false. No action taken.");
        }
      } else {
        console.error('organizations is undefined or empty');
      }

          },
          (error) => { console.error('Error retrieving Store', error); }
        );
        this.getAllorder();
        this.message = newMessage;
        this.ordermassage = "A new customer has placed an order.";
        this.showSuccess(this.ordermassage);
      }
    });
    window.socket.on('error', (error) => {
      console.error('WebSocket Error:', error);
      // Gérer les erreurs de connexion WebSocket
      console.warn("Error");
    });
  }*/
  uberdelevery(id:string){
   // console.log("id",id)
    this.authService.Creerdevis(id).subscribe(
      (response) => {
        console.log("uber",response)
    
      },
      (error) => {
        console.error('Erreur lors de la création du devis :', error);
      }
    );
  }
  // setupSSEConnection(): void {
  //   // SSE connection setup
  //   this.authService.connectToSse(this.authService.getStore()).subscribe(
  //     (event) => {
  //       console.log('Received SSE Event:', event);
  //       this.ngZone.run(() => {
  //         // Handle SSE events
  //         const newMessage = event.data;
  //         if (newMessage === 'Welcome ') {
  //           console.warn("Welcome");
  //         } else if (newMessage === 'Your order is missed') {
  //           this.sound.play();
  //           this.getAllorder();
  //           this.message = newMessage;
  //           this.showDanger(this.message);
  //         } else if (newMessage.charAt(0) === '{') {
  //           this.sound.play();
  //           this.getAllorder();
  //           this.message = newMessage;
  //           this.showSuccess("Order has been changed from another interface.");
  //         } else {
  //           this.sound.play();
  //           this.getAllorder();
  //           this.message = newMessage;
  //           this.ordermassage = "A new customer has placed an order.";
  //           this.showSuccess(this.ordermassage);
  //         }
  //       });
  //     },
  //     (error) => {
  //       // Handle SSE connection errors
  //       this.ngZone.run(() => {
  //         console.error('SSE Error:', error);
  //       });
  //     }
  //   );
  // }
  changeLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('defaultLang', lang);
  }
  // Method to fetch store details by ID
  private getstorebyid(): void {
    this.authService.getStroreById(this.authService.getStore()).subscribe(
      (data) => {
        // this.commande = data.automaticCommande;
        this.commande = data.managingacceptedorders.Automatic
       // console.log("commanddddde", this.commande)
        this.deliveryuber = data.modeUberdirect;
      },
      error => {
        console.error('Error fetching store details:', error);
      }
    );
  }
  // Method to fetch orders by number
  getorderbynumber() {
    this.authService.getallorderbystore(this.authService.getStore()).subscribe(
      (response) => {
        this.dataorder = response;
      }, error => { console.error('Error fetching orders', error); }
    );
  }
  getAllorder() {
    this.authService.getOrderByStoreId(this.authService.getStore()).subscribe(
      (response) => {
        this.authService.orders = response;
        if (this.commande == true) {
          if (this.deliveryuber === true) {
          }
        }
      },
      error => { });
  }
  /*updateStatusAutomatically = (order)=> {
    this.authService.updateStatusorders({ selectedItemId: order._id, selectedStatus: 'accepted', updatedBy: JSON.parse(this.iduser)._id.toString()
    }).subscribe(
      (response) => {
      },
      (error) => { console.error('Error updating order status', error); }
    );
  }*/
  // updateStatusAutomatically() {
  //   //console.log(JSON.parse(this.iduser)._id.toString())
  //   if (!this.dataorder) {
  //     console.error('dataorder is undefined');
  //     return;
  //   }
  //   const newOrders = this.authService.orders.filter(order => !this.dataorder.some(existingOrder => existingOrder._id === order._id));
  //   console.log("newOrders", newOrders);
  //   newOrders.forEach(order => {
  //     order.status = 'accepted';
  
  //     this.authService.updateStatusorders({ selectedItemId: order._id, selectedStatus: 'accepted', iddate: this.authService.iddate, updatedBy: JSON.parse(this.iduser)._id.toString()
  //     }).subscribe(
  //       (response) => {
  //         console.log('Order status updated successfully');
  //         // Une fois que toutes les commandes ont été acceptées, arrêtez le socket
  //         if (newOrders.every(order => order.status === 'accepted')) {
  //           window.socket.disconnect(); // Arrêter le socket
  //         }
  //       },
  //       (error) => { console.error('Error updating order status', error); }
  //     );
  //   });
  // }
  
  // Placeholder method to show success/toast message
  private showSuccess(message: string): void {
    this.toastService.show(message, { delay: 10000 });
  }
  private showDanger(message: string): void {
    this.toastService.show(message, { classname: 'bg-danger text-light', delay: 15000 });
  }
}