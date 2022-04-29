import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { MatTableDataSource } from "@angular/material/table";


interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}



@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = [ 'nom', 'numtel', 'adresse', 'courriel','siteweb' ,'nbc', 'dp','actions'];
  dataSource = new MatTableDataSource<Client>();
  // content?: string;
  currentClient: Client = {
    nom_client: '',
    adresse_client: '',
    numtel_client: 0,
    courriel_client: '',
    siteweb_client: '',
    numcomptebancaire_client: 0,
    dureepaiement_client: 0
  };
  disabelModif: boolean = false;
  message = '';
  clients?: Client[];
  currentIndex = -1;
 
    constructor( private route: ActivatedRoute,
    private router: Router , private clientService: ClientService) { }

  ngOnInit(): void {
    this.fetchClients();
  }
  fetchClients(): void {
    this.clientService.getAll()
  
    .subscribe(
      data => {
        this.clients = data;
        this.dataSource.data = this.clients;
        console.log(data);
      },
      error => {
        console.log(error);
      });}

  refreshList(): void {
    this.fetchClients();
    this.currentClient = {};
    this.currentIndex = -1;
  }
  setActiveClient(client: Client, index: number): void {
    this.currentClient = client;
    console.log(client);
    this.currentIndex = index;
    this.disabelModif = true;
    
  }
  removeAllClients(): void {
    this.clientService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }
  
  updateClient(): void {
    this.message = '';
    this.clientService.update(this.currentClient.id, this.currentClient)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModif = false;
          this.message = response.message ? response.message : 'This client was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }
  deleteClient(client : Client): void {
    this.clientService.delete(client.id)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  alerts: alerts[] = [
    {
      border: "alert-border-success",
      background: "alert-success",
      color: "alert-text-success",
      icon: "check-circle",
      iconColor: "text-success",
      message: "Client ajouté avec succès",
    },
  ]

}
