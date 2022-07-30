import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl  } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Devise } from 'src/app/models/devise.model';
import { LigneDevise } from 'src/app/models/ligne-devise.model';
import { DeviseService } from 'src/app/services/devise.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
import { Subject } from "rxjs";
import { HistoriqueLigneDevise } from 'src/app/models/historique-ligne-devise.model';
import { DatedeviseService } from 'src/app/services/datedevise.service';
import { FactureService } from 'src/app/services/facture.service';

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
  selector: 'app-archive-devises',
  templateUrl: './archive-devises.component.html',
  styleUrls: ['./archive-devises.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class ArchiveDevisesComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = ["nom", "devise", "valeur", "date", "action"];
  dataSource = new MatTableDataSource<Devise>();
  devises?: Devise[];
  dates?: Devise[];
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
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;

  constructor(
    private dateDeviseService: DatedeviseService,private deviseService: DeviseService,
    private tokenStorageService: TokenStorageService,
    private factureService: FactureService) { }

  ngOnInit(): void {
    this.fetchDevises();
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

  setActiveDevise(devise: HistoriqueLigneDevise, index: number): void {
    this.currentLigneDevise = devise;
    console.log(devise);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  unarchiveDevise(body:Devise){
    body.archive = false;
    this.deviseService.update(body.nom, body).subscribe({
      next: (res) => {console.log(res)
        Swal.fire({
          title: "Devise restaurée avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchDevises()
          }
        });
      }
    });

  }
  
  fetchDevises(): void {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        this.devises = data;
       let devise_archive :any = data.filter(elm => elm.archive == true ).map((elm: any) => {
          elm.date_devise = elm.dates?.map((date : any) =>{ return date.date, date.valeur } ).join("<br>");
          
          return elm;
        });
        this.dataSource.data = devise_archive;
        // console.log(data);
      },
      error: (e) => {
        console.error(e);
        Swal.fire({
          title: "Echec d'affichage des devises archivées !",
          text: "Une erreur est survenue lors du chargement de la liste des devises.",
          icon: "warning",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
      },
    });
  }
  
  deleteDevise(devise: Devise): void {
    this.factureService.getDevise(devise.nom).subscribe({
      next: (res: any) => {
        // console.log(res);
        if (res.status == 201) {
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
              // console.log("currentLigneDevise", this.currentLigneDevise);
              this.deviseService.delete(devise.nom).subscribe({
                next: (res) => {
                  // console.log(res);
                  this.fetchDevises();
                },
                error: (e) => console.error(e),
              });
            }
          });
        } else {
          Swal.fire({
            title: "Echec de supression !",
            text: "Vous ne pouvez pas supprimer ce client car il appartient à une facture existante. Vous pouvez opter pour l'archivage !",
            icon: "warning",
            confirmButtonColor: "#00c292",
            confirmButtonText: "Ok",
          });
        }
      },
    });
  }

  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }
}
