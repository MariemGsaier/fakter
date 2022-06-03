import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Article } from "src/app/models/article.model";
import { ArticleService } from "src/app/services/article.service";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
    prix_vente: new FormControl(''),
    taxe_vente: new FormControl(''),
    cout: new FormControl(''),
    description: new FormControl('')
  });
  article: Article = {
    nom_article: "",
    type_article: "",
    prix_vente: undefined,
    taxe_vente: undefined,
    cout: undefined,
    description: "",
  };
  submitted = false;

  types: type[] = [
    {value: 'Service', viewValue: 'Service'},
    {value: 'Consommable', viewValue: 'Consommable'}
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.articleForm = this.formBuilder.group(
      {
        nom_article: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        type_article: [
          '',
          [
            Validators.required
          ]
        ],
        prix_vente: ['', Validators.required,],
        taxe_vente: ['', Validators.required,],
        cout: ['', Validators.required,],
        description: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z0-9 ]+")]],
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
      image: this.article.image,
      nom_article: this.article.nom_article,
      type_article: this.article.type_article,
      prix_vente: this.article.prix_vente,
      taxe_vente: this.article.taxe_vente,
      cout: this.article.cout,
      description: this.article.description,
    };
    if (!(this.articleForm.invalid)) {
    this.articleService.create(data).subscribe(
      (res) => {
        console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous pouvez ajouter un autre article ou quitter.",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#00c292",
          cancelButtonColor: "#e46a76",
          confirmButtonText: "Ajouter un autre atricle",
          cancelButtonText: "Quitter",
        })
        .then((result) => {
          if (result.isConfirmed) {
         this.newArticle();
          } else if (!(result.isConfirmed)) {
            this.router.navigate(['/articles'])
          }
        })
      },
      (error) => {console.error(error);
      Swal.fire({
        title: "Une erreur est survenue lors de l'ajout de l'article !",
        text: "Veuillez réessayer une autre fois.",
        icon: "warning",
        confirmButtonColor: "#e46a76",
      })}
    )
    }
  }

  newArticle(): void {
    this.submitted = false;
    window.location.reload();
  }

}
