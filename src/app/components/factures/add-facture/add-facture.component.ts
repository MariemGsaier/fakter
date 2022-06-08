import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Facture } from "src/app/models/facture.model";
import { FactureService } from "src/app/services/facture.service";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Article } from "src/app/models/article.model";
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import { DeviseService } from "src/app/services/devise.service";
import { ClientService } from "src/app/services/client.service";
import { UserService } from "src/app/services/user.service";
import { GestUserService } from "src/app/services/gest-user.service";
import { BankaccountService } from "src/app/services/bankaccount.service";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import "moment/locale/ja";
import "moment/locale/fr";
import * as moment from "moment";
import { AddFacture } from "src/app/models/add-facture.model";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { LigneFactureService } from "src/app/services/ligne-facture.service";


export interface Element {
  nom_article: string;
  quantite: number;
  prix: number;
  taxe: number;
  sous_totalttc: number;
  soustotal_ht : number
}

@Component({
  selector: "app-add-facture",
  templateUrl: "./add-facture.component.html",
  styleUrls: ["./add-facture.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "ja-JP" },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AddFactureComponent implements OnInit {
  articles_added: Element[] = [];
  displayedColumns: string[] = [
    "nom",
    "quantite",
    "prix",
    "taxe",
    "sous_total",
    "soustotal_ht"
  ];

  totalttc = 0;
  totalht = 0
  dataSource = new MatTableDataSource<Element>();

  facture: AddFacture = {
    date_facturation: undefined,
    date_echeance:undefined,
    etat_echeance: false,
    total_devise: undefined,
    nom_devise: "",
    id_user: this.userStorageService.getUser().id,
    nom_client :"",
    num_compte: "",
    num_bc : ""
  };

  factureForm: FormGroup = new FormGroup({
    num_bc: new FormControl(""),
    date_facturation: new FormControl(""),
    date_echeance: new FormControl(""),
    client: new FormControl(""),
    num_compte: new FormControl(""),
    devise: new FormControl(""),
  });


  submitted = false;
  isEditable = false;
  selectedDevise = "";
  deviseSelected = false;
  devises = [
    {
      nom: "",
      devise: "",
    },
  ];
  clients = [
    {
      code_identification: "",
      nom: "",
      adresse: "",
      numtel: undefined,
      courriel: "",
      siteweb: "",
    },
  ];

  comptesbancaires = [
    {
      num_compte: "",
      bic: "",
      rib: "",
      iban: "",
      nom_banque: "",
    },
  ];

 

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private factureService: FactureService,
    private deviseService: DeviseService,
    private clientService: ClientService,
    private userService: GestUserService,
    private bankAccountService: BankaccountService,
    private userStorageService : TokenStorageService,
    private ligneFactureService : LigneFactureService,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  getDateFormatString(): string {
    if (this._locale === "ja-JP") {
      return "YYYY/MM/DD";
    } else if (this._locale === "fr") {
      return "DD/MM/YYYY";
    }
    return "";
  }

  changeDeviseValue(data: any) {
    console.log(data);
    this.deviseSelected = true;
  }

  changeClientValue(data: any){
    console.log(data);
  }

  getDevises() {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        console.log(data);
        this.devises = data.map((data: any) => {
          return {
            nom: data.nom,
            devise: data.devise,
          };
        });
        console.log(this.devises);
      },
    });
  }
  getclients() {
    this.clientService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.clients = data.map((data: any) => {
          return {
            code_identification: data.code_identification,
            nom: data.nom,
            adresse: data.adresse,
            numtel: data.numtel,
            courriel: data.courriel,
            siteweb: data.siteweb,
          };
        });
        console.log(this.clients);
      },
    });
  }
  getComptes() {
    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.comptesbancaires = data.map((data: any) => {
          return {
            num_compte: data.num_compte,
            bic: data.bic,
            rib: data.rib,
            iban: data.iban,
            nom_banque: data.nom_banque,
          };
        });
        console.log(this.devises);
      },
    });
  }

  ngOnInit(): void {
    console.log(moment.locales());
    this.getComptes();
    this.getclients();
    this.getDevises();
    this.factureForm = this.formBuilder.group({
      date_facturation: ["", Validators.required],
      date_echeance: ["", Validators.required],
      num_bc: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")]],
      client: ["", Validators.required],
      num_compte: ["", Validators.required],
      devise: ["", Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.factureForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.factureForm.invalid) {
      return;
    }
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(DialogBoxComponent, {
      height: "600px",
      width: "800px",
      hasBackdrop: false,
      backdropClass: "backdropBackground",
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.articles_added.push(...result);
      let soustotalhttab = this.articles_added.map((res) => {
        return res.soustotal_ht;
      });
      this.totalht = 0;
      soustotalhttab.forEach((element) => {
        this.totalht = this.totalht + element;
      });
      console.log(this.totalht)
      let soustotalttctab = this.articles_added.map((res) => {
        return res.sous_totalttc;
      });
      this.totalttc = 0;
      soustotalttctab.forEach((element) => {
        this.totalttc = this.totalttc + element;
      });
     
      this.dataSource = new MatTableDataSource<Element>(this.articles_added);

      // this.dataSource?.data = data;
    });
  }
  saveFacture(): void {
    const data = {
      id: this.facture.id,
      reference: "FACT/"+ new Date().getFullYear()+"/"+ this.facture.id,
      date_facturation: this.facture.date_facturation,
      etat_facturation: "ouvert",
      etat_echeance: this.facture.etat_echeance,
      total_ht: this.facture.total_ht,
      total_ttc: this.totalttc,
      total_devise: this.facture.total_devise,
      nom_devise: this.facture.nom_devise,
      id_user: this.facture.id_user,
      nom_client :this.facture.nom_client,
      num_compte: this.facture.num_compte,
    };
    if (!this.factureForm.invalid) {
      this.factureService.create(data).subscribe({
        next: (res) => {
          for (let i = 0; i < this.articles_added.length; i++) {
           const ligneFactData={
            id_facture : this.facture.id,
            nom_article : this.articles_added[i].nom_article,
            quantite :this.articles_added[i].quantite
           }
           this.ligneFactureService.create(ligneFactData).subscribe({
            next: (res) => {
              console.log(ligneFactData);
            },
            error: (e) => console.error(e),

          });
          }
          
          console.log(res);
          this.submitted = true;
          Swal.fire({
            title: "Ajout avec succés !",
            text: "Vous pouvez ajouter une autre facture ou quitter.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#00c292",
            cancelButtonColor: "#e46a76",
            confirmButtonText: "Ajouter une autre facture",
            cancelButtonText: "Quitter",
          }).then((result) => {
            if (result.isConfirmed) {
              this.newFacture();
            } else {
              this.router.navigate(["/factures"]);
            }
          });
        },
        error: (e) => console.error(e),
      });
    }
  }

  newFacture(): void {
    this.submitted = false;
    window.location.reload();
  }
}
