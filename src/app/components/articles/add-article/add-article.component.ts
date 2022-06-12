import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Article } from "src/app/models/article.model";
import { ArticleService } from "src/app/services/article.service";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ArticleStoreService } from "src/app/store/article-store.service";

interface type {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-add-article",
  templateUrl: "./add-article.component.html",
  styleUrls: ["./add-article.component.scss"],
})
export class AddArticleComponent implements OnInit {
  articleForm: FormGroup = new FormGroup({
    nom_article: new FormControl(''),
    type_article: new FormControl(''),
    description: new FormControl('')
  });
  article: Article = {
    nom_article: "",
    type_article: "",
    description: "",
    archive: false
  };
  submitted = false;
  errorAddArticle =false;
  errorMsg =""

  types: type[] = [
    {value: 'Service', viewValue: 'Service'},
    {value: 'Consommable', viewValue: 'Consommable'}
  ];

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private formBuilder: FormBuilder,
    private articleStore: ArticleStoreService
  ) {}

  ngOnInit(): void {
    this.articleStore.resetArticleStore();
    this.articleForm = this.formBuilder.group(
      {
        nom_article: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        type_article: [
          '',
          [
            Validators.required
          ]
        ],
        description: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{8,24}+$")]]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.articleForm.controls;
    
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.articleForm.invalid) {
      return;
    }
  }

  saveArticle(): void {
    const data = {
      nom_article: this.article.nom_article,
      type_article: this.article.type_article,
      description: this.article.description,
      archive: this.article.archive,
    };
    if ((this.articleForm.valid)) {
    this.articleService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous allez être redirigé vers l'interface d'ajout d'un prix pour l'article que vous venez d'ajouter.",
          icon: "success",
          confirmButtonColor: "#00c292",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.articleStore.setArticleInStore(data);
            this.router.navigate(['/add-prixarticle'])
          }
        });
      },
      error: (e) => {
        console.error(e),
        this.errorAddArticle=true
        this.errorMsg = "le nom d'article entré existe déjà !";
      }
    });
  }
}

  newArticle(): void {
    this.submitted = false;
    window.location.reload();
  }

}
