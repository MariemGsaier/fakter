import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  searchTerm : any;
  search: boolean = false;
  displayedColumns: string[] = ['reference_art','image', 'nom','type_article', 'prix', 'taxe', 'cout', 'description','actions'];
  dataSource = new MatTableDataSource<Article>();
  currentArticle: Article = {
    reference_art: '',
    image: '',
    nom_article: '',
    type_article: '',
    prix_vente: 0,
    taxe_vente: 0,
    cout: 0,
    description: '',
  };
  message = '';
  articles?: Article[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;

  constructor( private route: ActivatedRoute,
    private router: Router, private articleService: ArticleService, private tokenStorageService: TokenStorageService,) { }

    @ViewChild("Paginator") paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchArticles();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("observer");
    }
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  fetchArticles(): void {
    this.articleService.getAll()
  
    .subscribe(
      data => {
        this.articles = data;
        this.dataSource.data = this.articles;
        console.log(data);
      },
      error => {
        console.log(error);
      });}

      refreshList(): void {
        this.fetchArticles();
        this.currentArticle = {};
        this.currentIndex = -1;
      }

      setActiveArticle(article: Article, index: number): void {
        this.currentArticle = article;
        console.log(article);
        this.currentIndex = index;
        this.disabelModif = true;
        
      }

      removeAllArticles(): void {
        this.articleService.deleteAll()
          .subscribe({
            next: (res) => {
              console.log(res);
              this.refreshList();
            },
            error: (e) => console.error(e)
          });
      }

      updateArticle(): void {
        this.message = '';
        this.articleService.update(this.currentArticle.id, this.currentArticle)
          .subscribe(
            response => {
              console.log(response);
              this.disabelModif = false;
              this.message = response.message ? response.message : 'This article was updated successfully!';
            },
            error => {
              console.log(error);
            });
      }

      deleteArticle(article : Article): void {
        this.articleService.delete(article.id)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e)
        });
      }

      annuler(): void {
        this.disabelModif = false;
      }

      filterData($event : any){
        $event.target.value.trim();
        $event.target.value.toLowerCase();
        this.dataSource.filter = $event.target.value;
      }
}
