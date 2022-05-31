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

  articles = [
    {
      nom_article: '',
    }
  ];
  selectedArticle = this.articles;

  constructor(private articleService: ArticleService, public dialogRef: MatDialogRef<DialogBoxComponent>) { }

  getArticles() {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data.map((data: any) => {return { nom_article : data.nom_article }} );
        // if (dropDownData) {
        //   this.nom_article = dropDownData.nom_article;
        //   if(this.articles){
        //     this.nom_article = this.articles[0];
        //   } else {
        //     this.articles = [];
        //   }
        // }
        console.log(this.articles);
      },
    })
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

  ngOnInit(): void {
    this.getArticles();
  }

}
