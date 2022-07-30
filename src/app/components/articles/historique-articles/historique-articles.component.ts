import { Component, OnInit, ViewChild } from "@angular/core";
import { Prixarticle } from "src/app/models/prixarticle.model";
import { Article } from "src/app/models/article.model";
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";
import { PrixarticleService } from "src/app/services/prixarticle.service";
import { HistoriqueLignePrix } from "src/app/models/historique-ligne-prix.model";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import {MatSort} from '@angular/material/sort';
import { ArticleService } from "src/app/services/article.service";
import * as XLSX from "xlsx";
registerLocaleData(localeFr, "fr");

@Component({
  selector: "app-historique-articles",
  templateUrl: "./historique-articles.component.html",
  styleUrls: ["./historique-articles.component.scss"],
})
export class HistoriqueArticlesComponent implements OnInit {
  fileName = "HistoriqueArticlesSheet.xlsx";
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = [
    "nom",
    "type_article",
    "prix",
    "cout",
    "date",
    "archive",
    "description",
  ];
  dataSource = new MatTableDataSource<HistoriqueLignePrix>();
  currentArticle: Article = {
    nom_article: "",
    type_article: "",
    description: "",
    archive: false,
  };
  currentPrixArticle: Prixarticle = {
    id: undefined,
    prix: undefined,
    cout: undefined,
    date: new Date(),
  };
  message = "";
  articles?: HistoriqueLignePrix[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;
  submitted = false;
  errorUpdateArticle = false;
  errorMsg = "";

  constructor(
    private prixArticleService: PrixarticleService,
    private tokenStorageService: TokenStorageService,
    private articleService: ArticleService
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
    this.fetchArticles();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }
  archiveArticle(body: Article) {
    body.archive = true;
    this.articleService.update(body.nom_article, body).subscribe({
      next: (res) => {
        // console.log(res);
        Swal.fire({
          title: "Article archivé avec succés !",
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
    this.prixArticleService.getAllArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.articles = data.filter((elm) => elm.articles?.archive == false);
        this.dataSource.data = this.articles;
        this.dataSource.sort = this.sort;
        // // console.log(data);
      },
      error: (e) => {
        console.error(e);
        Swal.fire({
          title: "Echec d'affichage des articles !",
          text: "Une erreur est survenue lors du chargement de la liste des devises.",
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
