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
import { PaidfactureStoreService } from "src/app/store/paidfacture-store.service";
import { LigneFactureService } from "src/app/services/ligne-facture.service";
import { ArticleService } from "src/app/services/article.service";
import { ArticleslignefactStoreService } from "src/app/store/articleslignefact-store.service";
import { MatSort } from '@angular/material/sort';
import Swal from "sweetalert2";
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
  ligneFactPaid: any[] = [];
  fileName = "FacturesSheet.xlsx";
  displayedColumns: string[] = [
    "référence",
    "num_bc",
    "client",
    "date_facturation",
    "date_echeance",
    "date_paiement",
    "etat_facture",
    "etat_echeance",
    "total_ht",
    "total_ttc",
    "total_devise",
    "nom_devise",
    "créé_par",
    "actions",
  ];
  dataSource = new MatTableDataSource<Facture>();
  currentFacture: Facture = {
    reference: "",
    date_facturation: new Date(),
    date_echeance: new Date(),
    date_paiement : new Date(),
    etat_facture: false,
    etat_echeance: false,
    num_boncommande : undefined,
    total_ht: 0,
    total_ttc: 0,
    total_devise: undefined,
    devise: {
      nom : "",
      devise : ""

    },
    nom_user: "",
    compte: {
      num_compte: "",
      iban: "",
      rib: "",
    },
    client: {
      nom: "",
    },
    article: {
      nom_article: "",
      prix : undefined
    },
  };
  articleLigne : any = {}
  articles = [
    {
      nom_article: "",
      prix: undefined,
    },
  ];
  message = "";
  factures?: Facture[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;
  ligneFact: Element[] = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureService,
    private factureStore : PaidfactureStoreService ,
    private tokenStorageService: TokenStorageService,
    private ligneFactService : LigneFactureService,
    private  articleService : ArticleService,
    private ligneFactStore : ArticleslignefactStoreService

  ) {}

  ngOnInit(): void {
    this.fetchFactures();
    this.factureStore.resetFactureStore();
    this.ligneFactStore.resetArticleStore();
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
  @ViewChild(MatSort, {static: false})
  sort: MatSort = new MatSort;


  fetchFactures(): void {
    let currentDate = new Date();
    console.log(currentDate);
    
    this.factureService
      .getAllFactDetailed()
      .subscribe(
        (data) => {
          this.factures = data;
          this.factures = data.filter(elm => elm.archive == false );
          this.factures= this.factures.map(elem => {
            if((new Date(elem.date_echeance)<currentDate) && (elem.date_paiement == null)){
              elem.etat_echeance=true;
              // console.log(elem);
              this.factureService.update(elem.id, elem).subscribe({
                next: (res) => console.log(res)
              });

            }
            return elem
          })
         this.dataSource.data = this.factures;
         this.dataSource.sort = this.sort;
          // console.log(data);
         
          
        },
        (error) => {
          console.log(error);
        }
      );
  }


  archiveFacture(body:Facture){
    body.archive = true;
    this.factureService.update(body.id, body).subscribe({
      next: (res) => {
        // console.log(res)
        Swal.fire({
          title: "Facture archivée avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchFactures();
          }
        });
      }
    });

  }

  setActiveFacture(facture: Facture, index: number): void {
    this.currentFacture = facture;
    // console.log(facture);
    this.currentIndex = index;
  
    this.ligneFactService.getAll().subscribe({
      next : (data) => {
        // console.log("ligne",data);
       for(let i=0; i<data.length;i++){
        if(data[i].id_facture == this.currentFacture.id){

          this.articleService.getAllPrix().subscribe({
            next: (art) => {
              this.articles = art.map((res: any) => {return { 
                nom_article : res.nom_article,
                prix : res.prix[0].prix
              }} );

              for(let j=0; j<this.articles.length;j++){
                if(data[i].nom_article == this.articles[j].nom_article){

                  this.articleLigne = {
                    nom_article : data[i].nom_article,
                    quantite : data[i].quantite,
                    prix : this.articles[j].prix,
                    taxe : 0.19,
                  }
                }
              }
              this.ligneFactStore.setArticlesInStore(this.articleLigne);
              this.disabelModif = true;
              this.factureStore.setFactureInStore(this.currentFacture);
              this.router.navigate(['/facture-payée'])

            },
          })
        }
        
       }
      
       
      }
    });
 
       
    

  }


  annuler(): void {
    this.disabelModif = false;
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
  deleteFacture(facture : Facture) : void {
    this.factureService.deleteFacture(facture.id).subscribe({
      next : (data) => {
        console.log(data);
        this.fetchFactures();
       
        
      }

    })
  }
}
