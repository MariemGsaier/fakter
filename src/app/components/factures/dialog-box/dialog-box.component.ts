import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from "src/app/services/article.service";


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})

export class DialogBoxComponent implements OnInit {

  currentArticle: Article = {
    id: undefined,
    nom_article: "",
    type_article: "",
    prix_vente: undefined,
    taxe_vente: undefined,
    cout: undefined,
    description: "",
  };
  
  currentIndex = -1;
  disabelModif: boolean = false;

  articles = [
    {
      nom_article: '',
      prix_vente: undefined,
      taxe_vente: undefined,
    }
  ];
  
  selected = [
    {
      prix_vente: undefined,
      taxe_vente: undefined,
    }
  ]
  selectedArticle = this.selected;

  constructor(private articleService: ArticleService, public dialogRef: MatDialogRef<DialogBoxComponent>) { }

  getArticles() {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data.map((data: any) => {return { 
          nom_article : data.nom_article,
          prix_vente: data.prix_vente,
          taxe_vente: data.taxe_vente
        
        }} );
        console.log(this.articles);
      },
    })
  }

  setActiveArticle(article: Article, index: number): void {
    this.currentArticle = article;
    console.log('!!!!', article);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

  ngOnInit(): void {
    this.getArticles();
  }

}
