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

interface devise {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-add-account",
  templateUrl: "./add-account.component.html",
  styleUrls: ["./add-account.component.scss"],
})
export class AddAccountComponent implements OnInit {
  BankAccount: Bankaccount = {
    num_compte: undefined,
    rib: undefined,
    bic: "",
    iban: "",
    nom_banque: "",
  };
  bankAccForm: FormGroup = new FormGroup({
    numCompte: new FormControl(""),
    rib: new FormControl(""),
    bic: new FormControl(""),
    iban: new FormControl(""),
    nomBanque: new FormControl(""),
  });


 
  submitted = false;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bankAccountService: BankaccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bankAccForm = this.formBuilder.group({
      rib: ["", [Validators.required, Validators.pattern("/^[A-Za-z0-9]+$/")]],
      numcompte: [
        "",
        [
          Validators.required,
          Validators.pattern(" /^\d+$/"),
          Validators.minLength(14),
          Validators.maxLength(34),
        ],
      ],
      bic: ["", [Validators.required, Validators.pattern("/^[A-Za-z0-9]+$/")], Validators.minLength(8),Validators.maxLength(11),],
      iban: [
        Validators.required,
        ValidatorService.validateIban
      ],
      nomBanque: ["", [Validators.required,Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    console.log(this.bankAccForm.controls);
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
    const data = {
      num_compte: this.BankAccount.num_compte,
      rib: this.BankAccount.rib,
      bic: this.BankAccount.bic,
      iban: this.BankAccount.iban,
      nom_banque: this.BankAccount.nom_banque,
    };
    if (!this.bankAccForm.invalid) {
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
        error: (e) => console.error(e),
      });
    }
  }
  newBankAccount(): void {
    this.submitted = false;
    window.location.reload();
  }
}
