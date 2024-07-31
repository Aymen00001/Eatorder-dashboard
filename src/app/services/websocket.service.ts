import { Injectable } from '@angular/core';
// import * as io from 'socket.io-client';
import { io, Socket } from 'socket.io-client';


import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})    



export class WebsocketService {
  //public socket: Socket;

  constructor() {
    // this.socket = io('https://api.eatorder.fr');
    // const idstore = localStorage.getItem("storeid");

    // this.socket.on('connect', () => {
    //   console.log("Connected to WebSocket", this.socket);
    //   this.socket.emit('join_room_orders', idstore);
    // });
  }
  initializeSocket(): void {
    // this.socket = io('https://api.eatorder.fr');
    // const idstore = localStorage.getItem("storeid");

    // this.socket.on('connect', () => {
    //   console.log("Connected to WebSocket", this.socket);
    //   this.socket.emit('join_room_orders', idstore);
    // });

    // this.socket.on('error', (error) => {
    //   console.error('WebSocket Error:', error);
    // });
  }

 
}
