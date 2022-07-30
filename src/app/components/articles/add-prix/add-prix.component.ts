import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Prixarticle } from 'src/app/models/prixarticle.model';
import { ArticleService } from 'src/app/services/article.service';
import { PrixarticleService } from 'src/app/services/prixarticle.service';
import Swal from "sweetalert2";
import 'moment/locale/ja';
import 'moment/locale/fr';

@Component({
  selector: 'app-add-prix',
  templateUrl: './add-prix.component.html',
  styleUrls: ['./add-prix.component.scss'],
})
export class AddPrixComponent implements OnInit {
  prixArticleForm: FormGroup = new FormGroup({
    prix: new FormControl(''),
    cout: new FormControl(''),
    date: new FormControl(''),
    nom_article: new FormControl('')
  });
  prixArticle: Prixarticle = {
    prix: undefined,
    cout: undefined,
    date: new Date(),
    nom_article: ""
  };
  articles = [
    {
      nom_article: '',
      archive: false
    }
  ];
  submitted = false;
  
  constructor(
    private router: Router,
    private prixArticleService: PrixarticleService,
    private formBuilder: FormBuilder,
    private articleService: ArticleService) { }
  

  ngOnInit(): void {this.getArticles();
    this.prixArticleForm = this.formBuilder.group(
      {
        prix: ['', [Validators.required]],
        cout: ['', [Validators.required]],
        date: ['', [Validators.required]],
        nom_article: ['', [Validators.required]],
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
          nom_article : data.nom_article,
          archive : data.archive
        }} ).filter(elm => elm.archive == false );
       
      },
    })
  }

  savePrixArticle(): void {
    const data = {
      prix: this.prixArticle.prix,
      cout: this.prixArticle.cout,
      date: this.prixArticle.date,
      nom_article: this.prixArticle.nom_article,
    };
    // // console.log(data);
    

    if (this.prixArticleForm.valid) {
      this.prixArticleService.create(data).subscribe({
        next: (res) => {
          // console.log(res);
          this.submitted = true;
          Swal.fire({
            title: "Ajout avec succés !",
            text: "Vous pouvez ajouter un autre article ou quitter.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#00c292",
            cancelButtonColor: "#e46a76",
            confirmButtonText: "Ajouter un autre prix",
            cancelButtonText: "Quitter",
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(["/add-prix"]);
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
