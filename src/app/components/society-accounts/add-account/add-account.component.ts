import { Component, OnInit } from "@angular/core";
import { Bankaccount } from "src/app/models/bankaccount.model";
import { BankaccountService } from "src/app/services/bankaccount.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import {ValidatorService} from 'angular-iban';
import { Devise } from "src/app/models/devise.model";
import { DeviseService } from "src/app/services/devise.service";
import { BankaccountDevise } from "src/app/models/bankaccount-devise.model";



@Component({
  selector: "app-add-account",
  templateUrl: "./add-account.component.html",
  styleUrls: ["./add-account.component.scss"],
})
export class AddAccountComponent implements OnInit {
  BankAccount: BankaccountDevise = {
    num_compte: "",
    rib: "",
    bic: "",
    iban: "",
    nom_banque: "",
    nom_devise : ""
  };
  selectedValue=""
  
  bankAccForm: FormGroup = new FormGroup({
    numCompte: new FormControl(""),
    rib: new FormControl(""),
    bic: new FormControl(""),
    iban: new FormControl(""),
    nomBanque: new FormControl(""),
    devise: new FormControl(""),
  });

  currentDevise: Devise = {
    nom : "",
    devise :""
  };
  devises = [
    {
      nom: ""
    }
  ];
 

currentIndex = -1;
errorAddAccount=false
errorMsg=""
submitted = false;
selectedDevise = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bankAccountService: BankaccountService,
    private formBuilder: FormBuilder,
    private deviseService : DeviseService
  ) {}

  getDevises() {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        console.log(data);
        this.devises = data.map((data: any) => {return { 
          nom : data.nom
        }} );
        console.log(this.devises);
      },
    })
  }



  ngOnInit(): void {
    this.getDevises();
    this.bankAccForm = this.formBuilder.group({
      rib: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")]],
      numcompte: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9]+$"),
          Validators.minLength(5),
          Validators.maxLength(17),
        ],
      ],
      bic: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9]+$") ,Validators.minLength(8),Validators.maxLength(11)]],
      iban: [
        Validators.required,
        ValidatorService.validateIban
      ],
      nomBanque: ["", [Validators.required,Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      
      devise: ["", [Validators.required]],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.bankAccForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.bankAccForm.invalid) {
      return;
    }
  }
  onReset(): void {
    this.submitted = false;
    this.bankAccForm.reset();
  }

  saveBankAccount(): void {
    console.log(this.BankAccount);
    const data = {
      num_compte: this.BankAccount.num_compte,
      rib: this.BankAccount.rib,
      bic: this.BankAccount.bic,
      iban: this.BankAccount.iban,
      nom_banque: this.BankAccount.nom_banque,
      nom_devise : this.BankAccount.nom_devise
    };
    console.log("msg",this.bankAccForm.valid);
    
    if (this.bankAccForm.valid){
      this.bankAccountService.create(data).subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          Swal.fire({
            title: "Ajout avec succés !",
            text: "Vous pouvez ajouter un autre compte ou quitter.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#00c292",
            cancelButtonColor: "#e46a76",
            confirmButtonText: "Ajouter un autre compte",
            cancelButtonText: "Quitter",
          }).then((result) => {
            if (result.isConfirmed) {
              this.newBankAccount();
            } else {
              this.router.navigate(["/bankaccounts"]);
            }
          });
        },
        error: (e) => {
          console.error(e);
          this.errorAddAccount=true;
          this.errorMsg="Le numéro de compte ou RIB, ou le BIC ou IBAN saisi existe déjà !"
        }
      });

    }

    
  }
  newBankAccount(): void {
    this.submitted = false;
    window.location.reload();
  }

  annuler(): void {
    this.router.navigate(['/societe'])
  }
}
