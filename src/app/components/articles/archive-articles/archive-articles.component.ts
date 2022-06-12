import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Article } from "src/app/models/article.model";
import { LignePrix } from "src/app/models/ligne-prix.model";
import { ArticleService } from "src/app/services/article.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

@Component({
  selector: "app-archive-articles",
  templateUrl: "./archive-articles.component.html",
  styleUrls: ["./archive-articles.component.scss"],
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
    "description",
    "action",
  ];
  dataSource = new MatTableDataSource<LignePrix>();
  articles?: LignePrix[];
  paginator?: MatPaginator;
  isLoggedIn = false;
  showObserverBoard = true;
  currentPrixArticle: LignePrix = {
    nom_article: "",
    type_article: "",
    description: "",
    archive: true,
    prix: [
      {
        id: undefined,
        prix: undefined,
        cout: undefined,
        date: new Date(),
      },
    ],
  };
  private roles: string[] = [];
  currentIndex = -1;
  disabelModif: boolean = false;

  constructor(
    private articleService: ArticleService,
    private tokenStorageService: TokenStorageService
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

  setActiveArticle(article: LignePrix, index: number): void {
    console.log("11111", article);

    this.currentPrixArticle = article;
    console.log(article);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  unarchiveArticle(body: Article) {
    body.archive = false;
    this.articleService.update(body.nom_article, body).subscribe({
      next: (res) => {
        console.log(res);
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
    this.articleService.getAllPrix().subscribe({
      next: (data) => {
        this.articles = data;
        this.articles = data.filter((elm) => elm.archive == true);
        this.dataSource.data = this.articles;
        console.log(data);
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
