import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Article } from "src/app/models/article.model";
import { HistoriqueLignePrix } from "src/app/models/historique-ligne-prix.model";
import { LignePrix } from "src/app/models/ligne-prix.model";
import { ArticleService } from "src/app/services/article.service";
import { PrixarticleService } from "src/app/services/prixarticle.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { Subject } from "rxjs";
import {MatSort} from '@angular/material/sort';
import { LigneFactureService } from "src/app/services/ligne-facture.service";

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
  selector: "app-archive-articles",
  templateUrl: "./archive-articles.component.html",
  styleUrls: ["./archive-articles.component.scss"],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class ArchiveArticlesComponent implements OnInit {
  fileName = "ArticlesArchivéSheet.xlsx";
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = [
    "nom",
    "type_article",
    "prix",
    "cout",
    "date",
    "description",
    "action",
  ];
  dataSource = new MatTableDataSource<Article>();
  articles?: Article[];
  paginator?: MatPaginator;
  isLoggedIn = false;
  showObserverBoard = true;
  currentPrixArticle: HistoriqueLignePrix = {
    id: undefined,
    prix: undefined,
    cout: undefined,
    date: new Date(),
    articles: {
      nom_article: "",
      type_article: "",
      description: "",
      archive: false,
    },
  };
  private roles: string[] = [];
  currentIndex = -1;
  disabelModif: boolean = false;

  constructor(
    private prixArticleService: PrixarticleService,
    private articleService: ArticleService,
    private tokenStorageService: TokenStorageService,
    private ligneFacture: LigneFactureService
  ) {}

  ngOnInit(): void {
    this.fetchArticles();
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

  setActiveArticle(article: HistoriqueLignePrix, index: number): void {
    this.currentPrixArticle = article;
    console.log(article);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  unarchiveArticle(body: Article) {
    body.archive = false;
    this.articleService.update(body.nom_article, body).subscribe({
      next: (res) => {
        // console.log(res);
        Swal.fire({
          title: "Article restauré avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchArticles();
          }
        });
      },
    });
  }

  fetchArticles(): void {
    this.articleService.getAllArticlesPrix().subscribe({
      next: (data) => {
        this.articles = data;
        let article_archive :any = data.filter(elm => elm.archive == true ).map((elm: any) => {
          elm.date_article = elm.prix?.map((date : any) =>{ return date.date, date.prix, date.cout } ).join("<br>");
          
          return elm;
        });
        this.dataSource.data = article_archive;
        this.dataSource.sort = this.sort;
        // // console.log(data);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }

  deleteArticle(article: Article): void {
    this.ligneFacture.getArticle(article.nom_article).subscribe({
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
              this.articleService.delete(article.nom_article).subscribe({
                next: (res) => {
                  // console.log(res);
                  this.fetchArticles();
                },
                error: (e) => {
                  console.error(e);
                  Swal.fire({
                    title: "Echec de supression !",
                    text: "Une erreur est survenue lors de la supression de l'article.",
                    icon: "warning",
                    confirmButtonColor: "#00c292",
                    confirmButtonText: "Ok",
                  });
                },
              });
            }
          });
        } else {
          Swal.fire({
            title: "Echec de supression !",
            text: "Vous ne pouvez pas supprimer cet article car il appartient à une facture existante. Vous pouvez opter pour l'archivage !",
            icon: "warning",
            confirmButtonColor: "#00c292",
            confirmButtonText: "Ok",
          });
        }
      },
    });
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
