import { Component, OnInit, Inject, LOCALE_ID } from "@angular/core";
import { Router } from "@angular/router";
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
import { DialogBoxComponent } from "../dialog-box/dialog-box.component";
import { DeviseService } from "src/app/services/devise.service";
import { ClientService } from "src/app/services/client.service";
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
import { AddFacture } from "src/app/models/add-facture.model";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { LigneFactureService } from "src/app/services/ligne-facture.service";

import { LigneDevise } from "src/app/models/ligne-devise.model";
import { FactureStoreService } from "src/app/store/facture-store.service";
import { ArticleslignefactStoreService } from "src/app/store/articleslignefact-store.service";


export interface Element {
  nom_article: string;
  quantite: number;
  prix: number;
  taxe: number;
  sous_totalttc: number;
  soustotal_ht: number;
}

@Component({
  selector: "app-add-facture",
  templateUrl: "./add-facture.component.html",
  styleUrls: ["./add-facture.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "ja-JP" },
    {
      provide: LOCALE_ID,
      useValue: "fr",
    },

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
    "soustotal_ht",
  ];

  totalttc = 0;
  totalht = 0;
  tauxChangeDevise: any = 0;
  dataSource = new MatTableDataSource<Element>();

  facture: AddFacture = {
    date_facturation: undefined,
    date_echeance: undefined,
    total_devise: undefined,
    nom_devise: "",
    id_user: this.userStorageService.getUser().id,
    id_client: undefined,
    num_compte: "",
    num_bc: "",
  };

  factureForm: FormGroup = new FormGroup({
    num_bc: new FormControl(""),
    date_facturation: new FormControl(""),
    date_echeance: new FormControl(""),
    client: new FormControl(""),
    num_compte: new FormControl(""),
    devise: new FormControl(""),
  });
  nbref = 0;
  submitted = false;
  isEditable = false;
  selectedDevise = "";
  totalConverti = 0;
  deviseSymbol? = "";
  devisesRecent?: LigneDevise[];
  devises = [
    {
      nom: "",
      devise: "",
    },
  ];
  clients = [
    {
      id: undefined,
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
    private factureService: FactureService,
    private deviseService: DeviseService,
    private clientService: ClientService,
    private bankAccountService: BankaccountService,
    private userStorageService: TokenStorageService,
    private ligneFactureService: LigneFactureService,
    private factureStore : FactureStoreService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ligneFactStore :ArticleslignefactStoreService,
    @Inject(MAT_DATE_LOCALE) private _locale: string
  ) {}

  ngOnInit(): void {
    this.factureStore.resetFactureStore();
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
  getDateFormatString(): string {
    if (this._locale === "ja-JP") {
      return "YYYY/MM/DD";
    } else if (this._locale === "fr") {
      return "DD/MM/YYYY";
    }
    return "";
  }

  changeDeviseValue(data: any) {
    console.log(data)
    this.convertirDevise();
  }

  changeClientValue(data: any) {
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
            id: data.id,
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
      console.log(this.totalht);
      let soustotalttctab = this.articles_added.map((res) => {
        return res.sous_totalttc;
      });
      this.totalttc = 0;
      soustotalttctab.forEach((element) => {
        this.totalttc = this.totalttc + element;
      });
      this.convertirDevise();
      this.dataSource = new MatTableDataSource<Element>(this.articles_added);
      this.ligneFactStore.setArticlesInStore(this.articles_added);
    });
  }
  convertirDevise(): void {
    this.deviseService.getAllRecent().subscribe({
      next: (data) => {
        this.tauxChangeDevise = 0;
        for (let i = 0; i <= data.length; i++) {
          if (
            data[i]?.nom == this.selectedDevise &&
            data[i].dates.length != 0
          ) {
            this.tauxChangeDevise = data[i].dates[0].valeur;
            console.log("ttc", this.totalttc);
            this.totalConverti = this.tauxChangeDevise * this.totalttc;
            this.deviseSymbol = data[i]?.devise;
            console.log(this.deviseSymbol);
          }
        }
        console.log(this.tauxChangeDevise);
        console.log(this.totalConverti);
        this.devisesRecent = data;
        console.log("tabbb", this.devisesRecent);
      },
      error: (e) => console.error(e),
    });
  }
  updateFacture(body: Facture) {
    body.reference = "FACT/" + new Date().getFullYear() + "/" + body.id;
    this.factureService.update(body.id, body).subscribe({
      next: (res) => console.log(res),
    });
  }
  saveFacture(): void {
    const data = {
      reference: "FACT/" + new Date(),
      date_facturation: this.facture.date_facturation,
      date_echeance: this.facture.date_echeance,
      etat_facture: "ouvert",
      etat_echeance: false,
      total_ht: this.totalht,
      total_ttc: this.totalttc,
      total_devise: this.totalConverti,
      nom_devise: this.facture.nom_devise,
      id_user: this.facture.id_user,
      id_client: this.facture.id_client,
      num_compte: this.facture.num_compte,
      num_boncommande: this.facture.num_bc,
    };

    console.log(this.factureForm.valid);
    console.log(data);
    
    if ((this.factureForm.valid)) {
      this.factureService.create(data)
      .subscribe({
        next: (res) => {
          this.updateFacture(res);
          this.factureStore.setFactureInStore(res);
          for (let i = 0; i < this.articles_added.length; i++) {
            const ligneFactData = {
              id_facture: res.id,
              nom_article: this.articles_added[i].nom_article,
              quantite: this.articles_added[i].quantite,
            };
            this.ligneFactureService.create(ligneFactData).subscribe({
              next: (res) => {
                console.log(res);
               
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
            showDenyButton: true,
            confirmButtonColor: "#00c292",
            denyButtonColor: "#fb9678",
            cancelButtonColor : "#e46a76",
            confirmButtonText: "Ajouter une autre facture",
            denyButtonText: "Envoyer et imprimer facture",
            cancelButtonText :"Quitter"
            
          }).then((result) => {
            if (result.isConfirmed) {
              this.newFacture();
            } else if(result.isDenied) {
              this.router.navigate(["/print-facture"]);
            }
            else {
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
