import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Article } from 'src/app/models/article.model';
import { Prixarticle } from 'src/app/models/prixarticle.model';
import { PrixarticleService } from 'src/app/services/prixarticle.service';
import { ArticleService } from 'src/app/services/article.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
import { ArticleStoreService } from 'src/app/store/article-store.service';

@Component({
  selector: 'app-add-prixarticle',
  templateUrl: './add-prixarticle.component.html',
  styleUrls: ['./add-prixarticle.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class AddPrixarticleComponent implements OnInit {
  prixArticleForm: FormGroup = new FormGroup({
    prix: new FormControl(''),
    date: new FormControl('')
  });
  prixArticle: Prixarticle = {
    prix: undefined,
    date: new Date(),
    nom_article: ""
  };
  articles = [
    {
      nom_article: ''
    }
  ];
  submitted = false;
  article: Article = {
    nom_article: "",
  };
  storedarticle ?: Article ;

  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private route: ActivatedRoute,
    private router: Router,
    private prixArticleService: PrixarticleService,
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private articleStore: ArticleStoreService) { }

    french() {
      this._locale = 'fr';
      this._adapter.setLocale(this._locale);
    }
  
    getDateFormatString(): string {
      if (this._locale === 'ja-JP') {
        return 'YYYY/MM/DD';
      } else if (this._locale === 'fr') {
        return 'DD/MM/YYYY';
      }
      return '';
    }

  ngOnInit(): void {
    this.storedarticle = this.articleStore.getArticleFromStore();
    this.article.nom_article = this.storedarticle.nom_article;
    this.getArticles();
    this.prixArticleForm = this.formBuilder.group(
      {
        prix: ['', [Validators.required]],
        date: ['', [Validators.required]],
      }
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.prixArticleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.prixArticleForm.invalid) {
      return;
    }
  }

  getArticles() {
    this.articleService.getAll().subscribe({
      next: (data) => {
        this.articles = data.map((data: any) => {return { 
          nom_article : data.nom_article
        }} );
        console.log('!!!', this.articles);
      },
    })
  }

  savePrixArticle(): void {
    const data = {
      prix: this.prixArticle.prix,
      date: this.prixArticle.date,
      nom_article: this.article.nom_article,
    };
    console.log('444',this.prixArticleForm.invalid);
    

    if (!this.prixArticleForm.invalid) {
      this.prixArticleService.create(data).subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          Swal.fire({
            title: "Ajout avec succés !",
            text: "Vous pouvez ajouter un autre prix pour un un autre article ou quitter.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#00c292",
            cancelButtonColor: "#e46a76",
            confirmButtonText: "Ajouter un autre prix",
            cancelButtonText: "Quitter",
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(["/add-article"]);
            } else if (!result.isConfirmed) {
              this.router.navigate(["/articles"]);
            }
          });
        },
        error: (e) => console.error(e),
      });
    }
  }

}
