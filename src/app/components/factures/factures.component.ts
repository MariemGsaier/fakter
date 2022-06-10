import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Facture } from "src/app/models/facture.model";
import { FactureService } from "src/app/services/facture.service";
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from "src/app/services/token-storage.service";
import * as XLSX from "xlsx";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { Subject } from "rxjs";
registerLocaleData(localeFr, "fr");


@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = $localize`Première page`;
  itemsPerPageLabel = $localize`Items par page:`;
  lastPageLabel = $localize`Dernière page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Page suivante';
  previousPageLabel = 'Page précédente';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: "app-factures",
  templateUrl: "./factures.component.html",
  styleUrls: ["./factures.component.scss"],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
})
export class FacturesComponent implements OnInit {
  fileName = "FacturesSheet.xlsx";
  displayedColumns: string[] = [
    "référence",
    "créé_par",
    "client",
    "date_facturation",
    "date_echeance",
    "etat_facture",
    "etat_echeance",
    "total_ht",
    "total_ttc",
    "total_devise",
    "nom_devise",
    "actions",
  ];
  dataSource = new MatTableDataSource<Facture>();
  currentFacture: Facture = {
    reference: "",
    date_facturation: new Date(),
    date_echeance: new Date(),
    etat_facture: "",
    etat_echeance: false,
    total_ht: undefined,
    total_ttc: 0,
    total_devise: undefined,
    nom_devise: "",
    nom_user: "",
    client: {
      nom: "",
    },
  };
  message = "";
  factures?: Facture[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;
  searchTerm: any;
  search: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.fetchFactures();
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

  fetchFactures(): void {
    this.factureService
      .getAllFactDetailed()

      .subscribe(
        (data) => {
          this.factures = data;
          this.factures = data.filter(elm => elm.etat_facture !="archivé" );
          this.dataSource.data = this.factures;

          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  refreshList(): void {
    this.fetchFactures();
  }
  archiveFacture(body:Facture){
    body.etat_facture = "archivé";
    this.factureService.update(body.id, body).subscribe({
      next: (res) => {console.log(res)
        this.refreshList()
      }
    });

  }

  setActiveFacture(facture: Facture, index: number): void {
    this.currentFacture = facture;
    console.log(facture);
    this.currentIndex = index;
    this.disabelModif = true;
  }


  annuler(): void {
    this.disabelModif = false;
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
