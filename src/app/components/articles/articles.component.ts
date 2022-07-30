import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { Article } from "src/app/models/article.model";
import { ArticleService } from "src/app/services/article.service";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import * as XLSX from "xlsx";
import { LignePrix } from "src/app/models/ligne-prix.model";
import { PrixarticleService } from "src/app/services/prixarticle.service";
import { LigneFactureService } from "src/app/services/ligne-facture.service";
import { MatSort } from '@angular/material/sort';

interface type {
  value: string;
  viewValue: string;
}

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
  nextPageLabel = "Page suivante";
  previousPageLabel = "Page précédente";

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: "app-articles",
  templateUrl: "./articles.component.html",
  styleUrls: ["./articles.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ArticlesComponent implements OnInit {
  fileName = "ArticlesSheet.xlsx";
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = [
    "nom",
    "type_article",
    "prix",
    "cout",
    "date",
    "description",
    "actions",
  ];
  dataSource = new MatTableDataSource<LignePrix>();
  updateArticleForm: FormGroup = new FormGroup({
    nom_article: new FormControl(""),
    type_article: new FormControl(""),
    description: new FormControl(""),
  });
  currentArticle: Article = {
    nom_article: "",
    type_article: "",
    description: "",
  };
  currentPrixArticle: LignePrix = {
    nom_article: "",
    type_article: "",
    description: "",
    archive: false,
    prix: [
      {
        id: undefined,
        prix: undefined,
        cout: undefined,
        date: new Date(),
      },
    ],
  };
  message = "";
  articles?: LignePrix[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;
  submitted = false;
  errorUpdateArticle = false;
  errorMsg = "";

  types: type[] = [
    { value: "Service", viewValue: "Service" },
    { value: "Consommable", viewValue: "Consommable" },
  ];

  constructor(
    private articleService: ArticleService,
    private tokenStorageService: TokenStorageService,
    private formBuilder: FormBuilder,
    private prixArticleService: PrixarticleService,
    private ligneFacture: LigneFactureService
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

    this.updateArticleForm = this.formBuilder.group({
      nom_article: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")],
      ],
      type_article: ["", Validators.required],
      description: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{8,24}+$"
          ),
        ],
      ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.updateArticleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.updateArticleForm.invalid) {
      return;
    }
  }

  fetchArticles(): void {
    this.articleService.getAllPrix().subscribe({
      next: (data) => {
        this.articles = data;
        this.articles = data.filter((elm) => elm.archive == false);
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

  refreshList(): void {
    this.fetchArticles();
    this.currentArticle = {};
    this.currentIndex = -1;
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
            window.location.reload();
          }
        });
      },
    });
  }

  setActiveArticle(article: LignePrix, index: number): void {
    this.currentPrixArticle = article;
    this.updateArticleForm.setValue({
      nom_article: article.nom_article,
      type_article: article.type_article,
      description: article.description,
    });
    // console.log(article);
    this.currentIndex = index;
  }

  setUpdateArticle() : void {
    this.disabelModif = true;
  }

  updateArticle(): void {
    this.message = "";

    if (this.updateArticleForm.valid) {
      const data = {
        type_article: this.updateArticleForm.get("type_article")?.value,
        cout: this.updateArticleForm.get("cout")?.value,
        description: this.updateArticleForm.get("description")?.value,
      };

      this.articleService
        .update(this.currentPrixArticle.nom_article, data)
        .subscribe({
          next: (res) => {
            // console.log(res);
            this.disabelModif = false;
            Swal.fire({
              title: "Modification effectuée avec succés !",
              icon: "success",
              confirmButtonColor: "#00c292",
            }).then((result) => {
              if (result.isConfirmed) {
               window.location.reload();
              }
            });
          },
          error: (e) => {
            console.error(e);
            this.errorUpdateArticle = true;
            this.errorMsg =
              "Une erreur est survenue lors de la mise à jour de l'article !";
          },
        });
    }
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
                  this.refreshList();
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

  deletePrixArticle(prixArt: LignePrix): void {
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

        prixArt = this.currentPrixArticle?.prix[0]?.id;

        this.prixArticleService.delete(prixArt).subscribe({
          next: (res) => {
            // console.log(res);
            this.refreshList();
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
  annuler(): void {
    this.disabelModif = false;
  }
}
