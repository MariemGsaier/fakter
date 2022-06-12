import { Component, OnInit, ViewChild } from "@angular/core";
import { Prixarticle } from "src/app/models/prixarticle.model";
import { Article } from "src/app/models/article.model";
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { PrixarticleService } from "src/app/services/prixarticle.service";
import { HistoriqueLignePrix } from "src/app/models/historique-ligne-prix.model";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { LignePrix } from "src/app/models/ligne-prix.model";
registerLocaleData(localeFr, "fr");

@Component({
  selector: 'app-historique-articles',
  templateUrl: './historique-articles.component.html',
  styleUrls: ['./historique-articles.component.scss']
})
export class HistoriqueArticlesComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = [
    "nom",
    "type_article",
    "prix",
    "cout",
    "description",
    "actions",
  ];
  dataSource = new MatTableDataSource<HistoriqueLignePrix>();
  currentArticle: Article = {
    nom_article: "",
    type_article: "",
    description: "",
  };
  currentPrixArticle: Prixarticle = {
    id: undefined,
    prix: undefined,
    cout: undefined,
    date: new Date(),
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

  constructor(private prixArticleService: PrixarticleService,
    private tokenStorageService: TokenStorageService) { }

    
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    // this.fetchArticles();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }

  // fetchArticles(): void {
  //   this.articleService.getAllPrix().subscribe({
  //     next: (data) => {
  //       this.articles = data;
  //       this.articles = data.filter((elm) => elm.archive == false);
  //       this.dataSource.data = this.articles;
  //       console.log(data);
  //     },
  //     error: (e) => {
  //       console.error(e);
  //       Swal.fire({
  //         title: "Echec d'affichage des articles !",
  //         text: "Une erreur est survenue lors du chargement de la liste des devises.",
  //         icon: "warning",
  //         confirmButtonColor: "#00c292",
  //         confirmButtonText: "Ok",
  //       });
  //     },
  //   });
  // }

}
