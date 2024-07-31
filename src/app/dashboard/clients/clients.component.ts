import { Component, OnInit } from '@angular/core';
import { ClientsService } from './clients.service';
import { ApiServices } from 'src/app/services/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: any[];
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private clientsService: ClientsService, private apiservice: ApiServices,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getClients();
  }
  getClients(): void {
    this.clientsService.getStoreClients(this.apiservice.getStore(), this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.clients = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }
  nextPage(): void {
    this.currentPage++;
    this.getClients();
  }
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getClients(); } }
      clientDetails: any; // Déclarer une variable pour stocker les détails du client

      viewDetails(content: any, client: any) {
        this.clientDetails = client; // Affecter l'objet client à clientDetails
        this.modalService.open(content, { size: 'lg' }).result.then(
          (result) => {
            // Fonction à exécuter lorsque la modal est fermée
          },
          (reason) => {
            // Fonction à exécuter lorsque la modal est rejetée
          }
        );
      }
      
      sortDirection: string = 'asc'; // Par défaut, tri croissant
      sortedColumn: string = ''; // Colonne actuellement triée
      
      sortClientsByTotalSpent() {
        console.log("Sorting clients by total spent...");
      
        // Inverser la direction de tri
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        // Définir la colonne triée sur 'total_spent'
        this.sortedColumn = 'total_spent';
      
        // Trier les clients en fonction de la direction de tri et de la colonne
        this.clients.sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return a.total_spent - b.total_spent;
          } else {
            return b.total_spent - a.total_spent;
          }
        });
      
        console.log("Sorted clients:", this.clients);
      }
      
      
}
