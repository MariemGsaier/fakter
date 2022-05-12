import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "src/app/models/article.model";
import { ArticleService } from "src/app/services/article.service";
import { Validation } from 'src/app/validation/validation';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}

@Component({
  selector: "app-add-article",
  templateUrl: "./add-article.component.html",
  styleUrls: ["./add-article.component.scss"],
})
export class AddArticleComponent implements OnInit {
  form: FormGroup = new FormGroup({
    ref_article: new FormControl(''),
    image: new FormControl(''),
    nom_article: new FormControl(''),
    type_article: new FormControl(''),
    prix_vente: new FormControl(''),
    taxe_vente: new FormControl(''),
    cout: new FormControl(''),
    unite_mesure: new FormControl(''),
    description: new FormControl('')
  });
  article: Article = {
    ref_article: "",
    image: "",
    nom_article: "",
    type_article: "",
    prix_vente: 0,
    taxe_vente: 0,
    cout: 0,
    unite_mesure: 0,
    description: "",
  };
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        ref_article: [
          '',
          [
            Validators.required,
          ]
        ],
        image: ['', [Validators.required]],
        nom_article: ['', Validators.required, Validators.pattern(/^[A-Z0-9!@#$%^&*()]+$/)],
        type_article: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()]+$/)
          ]
        ],
        prix_vente: ['', Validators.required],
        taxe_vente: ['', Validators.required],
        cout: ['', Validators.required],
        unite_mesure: ['', Validators.required],
        description: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }

  saveArticle(): void {
    const data = {
      ref_article: this.article.ref_article,
      image: this.article.image,
      nom_article: this.article.nom_article,
      type_article: this.article.type_article,
      prix_vente: this.article.prix_vente,
      taxe_vente: this.article.taxe_vente,
      cout: this.article.cout,
      unite_mesure: this.article.unite_mesure,
      description: this.article.description,
    };
    this.articleService.create(data).subscribe(
      (res) => {
        console.log(res);
        this.submitted = true;
        this.router.navigate(['/articles']);
      },
      (error) => console.error(error)
    );
  }

  newArticle(): void {
    this.submitted = false;
    this.article = {
      ref_article: '',
      image: '',
      nom_article: '',
      type_article: '',
      prix_vente: 0,
      taxe_vente: 0,
      cout: 0,
      unite_mesure: 0,
      description:'',
     
    };
  }

  alerts: alerts[] = [
    {
      border: "alert-border-success",
      background: "alert-success",
      color: "alert-text-success",
      icon: "check-circle",
      iconColor: "text-success",
      message: "article ajouté avec succès",
    },
  ];
}
