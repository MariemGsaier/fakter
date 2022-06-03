import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AbstractControl, FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from 'src/app/models/article.model';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { DeviseService } from 'src/app/services/devise.service';
import { ClientService } from 'src/app/services/client.service';
import { UserService } from 'src/app/services/user.service';
import { GestUserService } from 'src/app/services/gest-user.service';
import { BankaccountService } from 'src/app/services/bankaccount.service';



@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class AddFactureComponent implements OnInit {
  displayedColumns: string[] = [
    "nom",
    "quantite",
    "prix",
    "taxe",
    "sous_total",
  ];
  dataSource = new MatTableDataSource<Article>();
  facture: Facture = {
    reference: "",
    vendeur: "",
    date_facturation: new Date (),
    date_echeance: new Date (),
    etat_facture: "",
    etat_echeance: false,
    total_ht: undefined,
    total_chiffres: undefined,
    total_lettres: "",
    total_devise: undefined,
    nom_devise :"",
    nom_client : "",
    créé_par : "",
    num_compte : ""

  };


  factureForm: FormGroup = new FormGroup({
    
    num_bc : new FormControl(''),
    date_facturation: new FormControl(''),
    date_echeance: new FormControl(''),
    client : new FormControl(''),
    num_compte : new FormControl(''),
    devise : new FormControl(''),
    
  });

  submitted=false;
  isEditable = false;
  devises = [
    {
      nom: "",
      devise: "",
      
    }
  ];
  clients = [
    {
      code_identification: "",
      nom: "",
      adresse:"",
      numtel: undefined,
      courriel : "",
      siteweb : ""

    }
  ];

  comptesbancaires = [
    {
      num_compte: "",
      bic: "",
      rib:"",
      iban: "",
      nom_banque :""

    }
  ];


  constructor(public dialog: MatDialog, private route: ActivatedRoute,private factureService: FactureService,private deviseService : DeviseService, private clientService : ClientService, private userService : GestUserService, private bankAccountService : BankaccountService,
    private router: Router, private formBuilder: FormBuilder) { }

    getDevises() {
      this.deviseService.getAllDevises().subscribe({
        next: (data) => {
          console.log(data);
          this.devises = data.map((data: any) => {return { 
            nom : data.nom,
            devise: data.devise,
        
          
          }} );
          console.log(this.devises);
        },
      })
    }
    getclients() {
      this.clientService.getAll().subscribe({
        next: (data) => {
          console.log(data);
          this.clients = data.map((data: any) => {return { 
            code_identification: data.code_identification,
            nom: data.nom,
            adresse:data.adresse,
            numtel: data.numtel,
            courriel : data.courriel,
            siteweb : data.siteweb
          }} );
          console.log(this.clients);
        },
      })
    }
    getComptes() {
      this.bankAccountService.getAll().subscribe({
        next: (data) => {
          console.log(data);
          this.comptesbancaires = data.map((data: any) => {return { 
            num_compte: data.num_compte,
            bic: data.bic,
            rib:data.rib,
            iban: data.iban,
            nom_banque :data.nom_banque
        
          
          }} );
          console.log(this.devises);
        },
      })
    }

  ngOnInit(): void {
    this. getComptes();
    this.getclients();
    this.getDevises();
    this.factureForm = this.formBuilder.group({
      date_facturation: ['', Validators.required],
      date_echeance: ['', Validators.required],
      num_bc : ['',[Validators.required,Validators.pattern("^[a-zA-Z0-9]+$")]],
      client : ['', Validators.required], 
      num_compte : ['', Validators.required], 
      devise : ['', Validators.required], 
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
  openDialog() : void {
    this.dialog.open(DialogBoxComponent, {
      height: '600px',
      width: '800px',
      hasBackdrop : false,
      backdropClass: 'backdropBackground'
    });
  }
  saveFacture(): void {
    const data = {
      id: this.facture.id,
      reference: this.facture.reference,
      créé_par: this.facture.créé_par,
      date_facturation: this.facture. date_facturation,
      etat_echeance: this.facture.etat_echeance,
      total_ht: this.facture.total_ht,
      total_chiffres : this.facture.total_chiffres,
      total_lettres : this.facture.total_lettres,
      total_devise : this.facture.total_devise,

    };
    if (!(this.factureForm.invalid)) {
      this.factureService.create(data)
      .subscribe({
        next: (res) => {
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
            })
            .then((result) => {
              if (result.isConfirmed) {
             this.newFacture();
              }
              else {
                this.router.navigate(["/factures"]);
              }
            })
          },
          error: (e) => console.error(e)
        } );

    }
 

    }
  
  newFacture(): void {
    this.submitted = false;
    window.location.reload();
  }
    
  }


