import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Client } from "src/app/models/client.model";
import { ClientService } from "src/app/services/client.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

@Component({
  selector: "app-archive-clients",
  templateUrl: "./archive-clients.component.html",
  styleUrls: ["./archive-clients.component.scss"],
})
export class ArchiveClientsComponent implements OnInit {
  fileName = "ClientsArchivéSheet.xlsx";
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = [
    "code_identification",
    "nom",
    "numtel",
    "adresse",
    "courriel",
    "siteweb",
    "action",
  ];
  dataSource = new MatTableDataSource<Client>();
  clients?: Client[];
  paginator?: MatPaginator;
  isLoggedIn = false;
  showObserverBoard = true;
  currentClient: Client = {
    code_identification: "",
    nom: "",
    adresse: "",
    numtel: undefined,
    courriel: "",
    siteweb: "",
  };
  private roles: string[] = [];
  currentIndex = -1;
  disabelModif: boolean = false;
  constructor(
    private clientService: ClientService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.fetchClients();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  setActiveClient(client: Client, index: number): void {
    this.currentClient = client;
    console.log(client);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  unarchiveClient(body: Client) {
    body.archive = false;
    this.clientService.update(body.id, body).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          title: "Client restauré avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchClients();
          }
        });
      },
    });
  }

  fetchClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients = data;
        this.clients = data.filter((elm) => elm.archive == true);
        this.dataSource.data = this.clients;
        console.log(data);
      },
      error: (e) => {
        console.error(e);
        Swal.fire({
          title: "Echec d'affichage des clients !",
          text: "Une erreur est survenue lors du chargement de la liste des clients.",
          icon: "warning",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
      },
    });
  }

  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
