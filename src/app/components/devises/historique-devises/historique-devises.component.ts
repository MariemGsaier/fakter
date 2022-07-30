import { Component, OnInit, ViewChild } from "@angular/core";
import { Datedevise } from "src/app/models/datedevise.model";
import { Devise } from "src/app/models/devise.model";
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";
import { DatedeviseService } from "src/app/services/datedevise.service";
import { HistoriqueLigneDevise } from "src/app/models/historique-ligne-devise.model";
import { registerLocaleData } from "@angular/common";
import { MatSort } from '@angular/material/sort';
import localeFr from "@angular/common/locales/fr";
registerLocaleData(localeFr, "fr");

@Component({
  selector: "app-historique-devises",
  templateUrl: "./historique-devises.component.html",
  styleUrls: ["./historique-devises.component.scss"],
})
export class HistoriqueDevisesComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = ["nom", "devise", "valeur", "date", "archive"];
  dataSource = new MatTableDataSource<HistoriqueLigneDevise>();

  currentDevise: Devise = {
    nom: "",
    devise: "",
    archive: false
  };
  currentDateDevise: Datedevise = {
    id: undefined,
    date: new Date(),
    valeur: undefined,
  };
  currentLigneDevise: HistoriqueLigneDevise = {
    id: undefined,
    date: new Date(),
    valeur: undefined,
    devises: {
      nom: "",
      devise: "",
      archive: false
    },
  };
  message = "";
  devises?: HistoriqueLigneDevise[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;
  submitted = false;

  constructor(
    private dateDeviseService: DatedeviseService,
    private tokenStorageService: TokenStorageService,
  ) {}

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort, {static: false})
  sort: MatSort = new MatSort;


  ngOnInit(): void {
    this.fetchDevises();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }

  fetchDevises(): void {
    this.dateDeviseService.getAll().subscribe({
      next: (data) => {
        this.devises = data;
        this.dataSource.data = this.devises;
        this.dataSource.sort = this.sort;
        
        // console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.fetchDevises();
    this.currentLigneDevise = {};
    this.currentIndex = -1;
  }

  setActiveDevise(devise: HistoriqueLigneDevise, index: number): void {
    this.currentLigneDevise = devise;
    // console.log(devise);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  deleteDateDevise(dateDevise: Datedevise): void {
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
        this.dateDeviseService.delete(dateDevise.id).subscribe({
          next: (res) => {
            // console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }

  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }

  annuler(): void {
    this.disabelModif = false;
  }
}
