import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Client } from "src/app/models/client.model";
import { ClientService } from "src/app/services/client.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";



@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
})
export class ClientComponent implements OnInit {
  searchTerm : any;
  search: boolean = false;
  displayedColumns: string[] = [
    "nom",
    "numtel",
    "adresse",
    "courriel",
    "siteweb",
    "nbc",
    "actions",
  ];
  dataSource = new MatTableDataSource<Client>();
  // content?: string;
  currentClient: Client = {
    nom_client: "",
    adresse_client: "",
    numtel_client: 0,
    courriel_client: "",
    siteweb_client: "",
    numcomptebancaire_client: 0,
  };
  disabelModif: boolean = false;
  message = "";
  clients?: Client[];
  currentIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.fetchClients();
  }
  fetchClients(): void {
    this.clientService
      .getAll()

      .subscribe({
        next: (data) => {
          this.clients = data;
          this.dataSource.data = this.clients;
          console.log(data);
        },
        error: (e) => console.error(e),
      });
  }

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
    Swal.fire({
      title: "Êtes-vous sûr de tout supprimer ? ",
      text: "Vous ne serez pas capable de restaurer !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor: "#e46a76",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteAll().subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }

  updateClient(): void {
    this.message = "";
    this.clientService
      .update(this.currentClient.id, this.currentClient)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.disabelModif = false;
          this.message = res.message
            ? res.message
            : "This client was updated successfully!";
        },
        error: (e) => console.error(e),
      });
  }
  deleteClient(client: Client): void {
    Swal.fire({
      title: "Êtes-vous sûr de le supprimer ? ",
      text: "Vous ne serez pas capable de le récupérer !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor: "#e46a76",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.delete(client.id).subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }
  filterData($event : any){
    this.dataSource.filter = $event.target.value;
  }

}
