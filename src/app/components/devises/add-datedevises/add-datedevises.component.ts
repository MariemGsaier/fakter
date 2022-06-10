import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Datedevise } from 'src/app/models/datedevise.model';
import { DatedeviseService } from 'src/app/services/datedevise.service';
import { DeviseStoreService } from "src/app/store/devise-store.service";
import { Devise } from 'src/app/models/devise.model';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
import * as moment from 'moment';


@Component({
  selector: 'app-add-datedevises',
  templateUrl: './add-datedevises.component.html',
  styleUrls: ['./add-datedevises.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class AddDatedevisesComponent implements OnInit {
  dateDeviseForm: FormGroup = new FormGroup({
    date: new FormControl(''),
    valeur: new FormControl('')
  });

  getDateFormatString(): string {
    if (this._locale === 'ja-JP') {
      return 'YYYY/MM/DD';
    } 
    return '';
  }

  dateDevise: Datedevise = {
    date: new Date(),
    valeur: undefined
  };
  submitted = false;
  devise: Devise = {
    nom: "",
    devise: "",
  };
  storeddevise ?: Devise ;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dateDeviseService: DatedeviseService,
    private formBuilder: FormBuilder,
    private deviseStore : DeviseStoreService,
    @Inject(MAT_DATE_LOCALE) private _locale: string, ) { }


    

  ngOnInit(): void {
    
    
    
    this.storeddevise = this.deviseStore.getDeviseFromStore();
    console.log('!!!!',this.storeddevise);
    this.devise.nom = this.storeddevise.nom;
    this.dateDeviseForm = this.formBuilder.group(
      {
        date: ['', Validators.required],
        valeur: ['', Validators.required]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.dateDeviseForm.controls;
    
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.dateDeviseForm.invalid) {
      return;
    }
  }

  saveDateDevise(): void {
    const data = {
      date: this.dateDevise.date,
      valeur: this.dateDevise.valeur,
      nom_devise: this.devise.nom
    };
    if ((this.dateDeviseForm.valid)) {
    this.dateDeviseService.create(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous pouvez ajouter une autre devise ou quitter.",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#00c292",
          cancelButtonColor: "#e46a76",
          confirmButtonText: "Ajouter une autre devise",
          cancelButtonText: "Quitter",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/add-devise'])
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
