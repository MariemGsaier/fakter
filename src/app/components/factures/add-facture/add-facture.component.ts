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
import { Client } from "src/app/models/client.model";
import { Bankaccount } from "src/app/models/bankaccount.model";


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
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
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
    "actions"
  ];
  currentIndex=-1;
  totalttc = 0;
  totalht = 0;
  tauxChangeDevise: any = 0;
  dataSource = new MatTableDataSource<Element>();

  facture: AddFacture = {
    total_devise: undefined,
    nom_devise: "",
    id_user: this.userStorageService.getUser().id,
    id_client: undefined,
    num_compte: "",
    num_bc: undefined,
    date_paiement: new Date(""),
    date_facturation: new Date(""),
    date_echeance: new Date("")
  };

  factureForm: FormGroup = new FormGroup({
    num_bc: new FormControl(""),
    date_facturation: new FormControl(""),
    date_echeance: new FormControl(""),
    client: new FormControl(""),
    num_compte: new FormControl(""),
    devise: new FormControl(""),
  });

  errorAddFacture=false;
  errorMsg=""
  nbref = 0;
  submitted = false;
  isEditable = false;
  selectedDevise = "";
  totalConverti = 0;
  deviseSymbol? = "";
  dateCntrl = false;
  devisesRecent?: LigneDevise[];
  errorDate = ""
  devises = [
    {
      nom: "",
      devise: "",
      archive: false
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
      archive: false
    },
  ];

  comptesbancaires = [
    {
      num_compte: "",
      bic: "",
      rib: "",
      iban: "",
      nom_banque: "",
      archive: false
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
      num_bc: ["", Validators.required],
      client: ["", Validators.required],
      num_compte: ["", Validators.required],
      devise: ["", Validators.required],
    });
  }


 

  getDevises() {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        // console.log(data);
        this.devises = data.map((data: any) => {
          return {
            nom: data.nom,
            devise: data.devise,
            archive: data.archive
          };
        }).filter(elm => elm.archive == false );
      },
    });
  }
  getclients() {
    this.clientService.getAll().subscribe({
      next: (data) => {
        // console.log(data);
        this.clients = data.map((data: any) => {
          return {
            id: data.id,
            code_identification: data.code_identification,
            nom: data.nom,
            adresse: data.adresse,
            numtel: data.numtel,
            courriel: data.courriel,
            siteweb: data.siteweb,
            archive: data.archive
          };
        }).filter(elm => elm.archive == false );
      },
    });
  }
  getComptes() {
    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        // console.log(data);
        this.comptesbancaires = data.map((data: any) => {
          return {
            num_compte: data.num_compte,
            bic: data.bic,
            rib: data.rib,
            iban: data.iban,
            nom_banque: data.nom_banque,
            archive: data.archive
          };
        }).filter(elm => elm.archive == false );
       
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

  setActiveFacture(article: Element, index: number): void {
  
    // console.log(article);
    this.currentIndex = index;
 
  }

  removeFromLigneFact(item : any) : void {
    this.articles_added= this.articles_added.filter(elem => elem.nom_article !== item.nom_article);
    this.dataSource = new MatTableDataSource<Element>(this.articles_added);
    this.ligneFactStore.resetArticleStore();
    this.ligneFactStore.setArticlesInStore(this.articles_added);
    
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
            this.totalConverti = this.tauxChangeDevise * this.totalttc;
            this.deviseSymbol = data[i]?.devise;
          }
        }
        this.devisesRecent = data;
      },
      error: (e) => console.error(e),
    });
  }
  updateFacture(body: Facture) {
    body.reference = "FACT/" +new Date(body.date_facturation).getFullYear() + "/" + body.id;
    this.factureService.update(body.id, body).subscribe({
      next: (res) => console.log(res),
    });
  }
 
  
  saveFacture(): void {
    const data = {
      reference: "FACT/" + new Date(),
      date_facturation: this.facture.date_facturation,
      date_echeance: this.facture.date_echeance,
      date_paiement : this.facture.date_paiement,
      etat_facture: false,
      etat_echeance: false,
      archive : false,
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
    if ((this.factureForm.valid)) {
      if ((new Date(this.facture.date_echeance).valueOf() - new Date(this.facture.date_facturation).valueOf()) <= 0 ){
        this.dateCntrl = true;
        this.errorDate = "La date d'échéance saisie doit être supérieur à la date de facturation !"
      }
      else {
        this.factureService.create(data)
        .subscribe({
          next: (res) => {
            this.updateFacture(res);
            // console.log(this.updateFacture(res));
            
            this.clientService.getOne(this.facture.id_client).subscribe({
              next: (client: Client)  => {
                this.bankAccountService.getOne(this.facture.num_compte).subscribe({
                  next : (bankacc : Bankaccount) => {
                    const printData = {
                      reference: res.reference,
                      date_facturation: this.facture.date_facturation,
                      date_echeance: this.facture.date_echeance,
                      total_ht: this.totalht,
                      total_ttc: this.totalttc,
                      total_devise : this.totalConverti,
                      nom_devise : this.facture.nom_devise,
                      nom_client : client.nom,
                      adresse : client.adresse,
                      courriel : client.courriel,
                      code_identification : client.code_identification,
                      num_compte: this.facture.num_compte,
                      rib : bankacc.rib,
                      iban : bankacc.iban,
                      num_boncommande: this.facture.num_bc,
                    };
                    this.factureStore.setFactureInStore(printData);
  
                  }
                })
            }
  
            })
            for (let i = 0; i < this.articles_added.length; i++) {
              const ligneFactData = {
                id_facture: res.id,
                nom_article: this.articles_added[i].nom_article,
                quantite: this.articles_added[i].quantite,
              };
             
              
              this.ligneFactureService.create(ligneFactData).subscribe({
                next: (res) => {
                  // console.log(res);
                },
                error: (e) => console.error(e),
              });
            }
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
              denyButtonText: "Envoyer et exporter facture en PDF",
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
          error: (e) => {console.error(e)
            this.errorAddFacture=true
            this.errorMsg = "le numéro de bon de commande entré existe déjà !";
          }
        });

      }

    }
  }

  newFacture(): void {
    this.submitted = false;
    window.location.reload();
  }

  ajoutCompteBancaire(): void {
    Swal.fire({
      title: "Attention !",
      text: "Si vous cliquez sur continuer, vous allez perdre votre progression.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor : "#e46a76",
      confirmButtonText: "Continuer",
      cancelButtonText :"Quitter"
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["/add-account"]);
      }
    });
  }
  ajoutDevise(): void {
    Swal.fire({
      title: "Attention !",
      text: "Si vous cliquez sur continuer, vous allez perdre votre progression.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor : "#e46a76",
      confirmButtonText: "Continuer",
      cancelButtonText :"Quitter"
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["/add-devise"]);
      }
    });
  }
  ajoutClient(): void {
    Swal.fire({
      title: "Attention !",
      text: "Si vous cliquez sur continuer, vous allez perdre votre progression.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor : "#e46a76",
      confirmButtonText: "Continuer",
      cancelButtonText :"Quitter"
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["/add-client"]);
      }
    });
  }
}
