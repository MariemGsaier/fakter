import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Datedevise } from 'src/app/models/datedevise.model';
import { DatedeviseService } from 'src/app/services/datedevise.service';
import { DeviseService } from 'src/app/services/devise.service';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';




@Component({
  selector: 'app-add-date',
  templateUrl: './add-date.component.html',
  styleUrls: ['./add-date.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class AddDateComponent implements OnInit {
  dateDeviseForm: FormGroup = new FormGroup({
    date: new FormControl(''),
    valeur: new FormControl(''),
    nom: new FormControl('')
  });

  dateDevise: Datedevise = {
    date : new Date(),
    valeur: undefined,
    nom_devise: ""
  };
  devises = [
    {
      nom: ''
    }
  ];
  submitted = false;
  

  constructor(
    private router: Router,
    private dateDeviseService: DatedeviseService,
    private formBuilder: FormBuilder,
    private deviseService: DeviseService
    ) { }


  ngOnInit(): void {
    
   
    this.getDevises();
    this.dateDeviseForm = this.formBuilder.group(
      {
        date: ['', Validators.required],
        valeur: ['', Validators.required],
        nom: ['', Validators.required]
      }
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.dateDeviseForm.controls;
    
  }

  changeDeviseValue(data: any){
    console.log(data);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.dateDeviseForm.invalid) {
      return;
    }
  }

  getDevises() {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        this.devises = data.map((data: any) => {return { 
          nom : data.nom
        
        }} );
        console.log('!!!', this.devises);
      },
    })
  }

  saveDateDevise(): void {
    console.log(this.dateDevise);
    const data = {
      date: this.dateDevise.date,
      valeur: this.dateDevise.valeur,
      nom_devise: this.dateDevise.nom_devise
    };
    console.log(this.dateDeviseForm.invalid);
    if (!(this.dateDeviseForm.invalid)) {
    this.dateDeviseService.create(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous pouvez ajouter une autre taux de change ou quitter.",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#00c292",
          cancelButtonColor: "#e46a76",
          confirmButtonText: "Ajouter une autre taux de change",
          cancelButtonText: "Quitter",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/add-date'])
          } else if (!(result.isConfirmed)) {
            this.router.navigate(['/devises'])
          }
        })
      },
      error: (e) => console.error(e)
    } );

}
}
}
