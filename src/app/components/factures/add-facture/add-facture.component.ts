import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import Swal from 'sweetalert2';


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
  export interface PeriodicElement {
    id: number;
    name: string;
    work: string;
    project: string;
    priority: string;
    badge: string;
    budget: string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    { id: 1, name: 'Deep Javiya', work: 'Frontend Devloper', project: 'Flexy Angular', priority: 'Low', badge: 'badge-info', budget: '$3.9k' },
    { id: 2, name: 'Nirav Joshi', work: 'Project Manager', project: 'Hosting Press HTML', priority: 'Medium', badge: 'badge-primary', budget: '$24.5k' },
    { id: 3, name: 'Sunil Joshi', work: 'Web Designer', project: 'Elite Admin', priority: 'High', badge: 'badge-danger', budget: '$12.8k' },
    { id: 4, name: 'Maruti Makwana', work: 'Backend Devloper', project: 'Material Pro', priority: 'Critical', badge: 'badge-success', budget: '$2.4k' },
  ];


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
    
    email: new FormControl(''),
    phone: new FormControl(''),
    website: new FormControl(''),
    nomclt: new FormControl(''),
    adresse: new FormControl('')
    
  });

  submitted=false;
  
    
  displayedColumns: string[] = ['id', 'assigned', 'name', 'priority', 'budget'];
  dataSource = ELEMENT_DATA;


  // secondFormGroup: FormGroup;
  firstFormGroup: FormGroup = new FormGroup({
    
    firstCtrl: new FormControl(''),
  });
  secondFormGroup: FormGroup = new FormGroup({
    
    secondCtrl: new FormControl(''),
  });
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

  constructor(private route: ActivatedRoute,private factureService: FactureService,
    private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
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


