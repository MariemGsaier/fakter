import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from 'src/app/services/token-storage.service';


interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  displayedColumns: string[] = ['image', 'nom','type_article', 'prix', 'taxe', 'cout', 'unite','description','actions'];
  dataSource = new MatTableDataSource<Article>();
  currentArticle: Article = {
    ref_article: '',
    image: '',
    nom_article: '',
    type_article: '',
    prix_vente: 0,
    taxe_vente: 0,
    cout: 0,
    unite_mesure: 0,
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

  ngOnInit(): void {
    this.fetchArticles();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("observer");
    }
  }

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

  alerts: alerts[] = [
    {
      border: "alert-border-success",
      background: "alert-success",
      color: "alert-text-success",
      icon: "check-circle",
      iconColor: "text-success",
      message: "Client ajouté avec succès",
    },
  ]
}
