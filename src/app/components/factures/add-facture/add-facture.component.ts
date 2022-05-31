import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Article } from 'src/app/models/article.model';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';


interface vendeur {
  value: string;
  viewValue: string;}

interface devise {
    value: string;
    viewValue: string;
  
  }
  interface client {
    value: string;
    viewValue: string;
  
  }


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
    total_devise: undefined
  };

  factureForm: FormGroup = new FormGroup({
    
    vendeur: new FormControl(''),
    date_facturation: new FormControl(''),
    date_echeance: new FormControl('')
    
  });

  submitted=false;
  isEditable = false;

  vendeurs: vendeur[] = [
    {value: 'mariem', viewValue: 'mariem'},
    {value: 'rima', viewValue: 'rima'},
    {value: 'omar', viewValue: 'omar'},
  ];

  devises: devise[] = [
    {value: 'euro', viewValue: 'euro'},
    {value: 'tnd', viewValue: 'dinar tunisien'},
    {value: 'dollar', viewValue: 'dollar'},
  ];
  clients: client[] = [
    {value: 'soroubat', viewValue: 'Soroubat'},
    {value: 'vermeg', viewValue: 'Vermeg'},
    {value: 'tunisiair', viewValue: 'Tunisair'},
  ];

  // etatFacture="";
  // etats: string[] = ['payée', 'impayée'];

  constructor(public dialog: MatDialog, private route: ActivatedRoute,private factureService: FactureService,
    private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.factureForm = this.formBuilder.group({
      date_facturation: ['', Validators.required],
      date_echeance: ['', Validators.required],
    });

  }
  openDialog() : void {
    this.dialog.open(DialogBoxComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop : false,
      backdropClass: 'backdropBackground'
    });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log(`Dialog result: ${result}`); // Pizza!
    // });
    // dialogRef.close('Pizza!');
  }
  saveFacture(): void {
    const data = {
      id: this.facture.id,
      reference: this.facture.reference,
      vendeur: this.facture.vendeur,
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


