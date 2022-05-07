import { Component, OnInit } from '@angular/core';
import { Bankaccount } from "src/app/models/bankaccount.model";
import { BankaccountService } from "src/app/services/bankaccount.service";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
;

interface devise {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
  


export class AddAccountComponent implements OnInit {

  BankAccount: Bankaccount = {
    num_compte: 0,
    rib: 0,
    tit_compte: "",
    bic: "",
    iban: 0,
    devise: "",
    nom_banque: "",
  };
  submitted = false;

  devises: devise[] = [
    {value: 'euro', viewValue: 'Euro'},
    {value: 'dollar', viewValue: 'Dollar'},
    {value: 'TND', viewValue: 'TND'},
  ];

  constructor(private route: ActivatedRoute,private router: Router, private bankAccountService: BankaccountService) { }

  ngOnInit(): void {
  }
  
  saveBankAccount(): void {
    const data = {
      num_compte: this.BankAccount.num_compte,
      rib: this.BankAccount.rib,
      tit_compte: this.BankAccount.tit_compte,
      bic: this.BankAccount.bic,
      iban: this.BankAccount.iban,
      devise: this.BankAccount.devise,
      nom_banque: this.BankAccount.nom_banque,
    };
    this.bankAccountService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          Swal.fire({
            title: 'Ajouté avec succés !',
            icon: 'success', 
            confirmButtonColor: '#00c292',
            confirmButtonText: 'Ajouter un autre compte',
            cancelButtonColor: "#e46a76",
            cancelButtonText: "Quitter",

          }
          ) 
          .then((result) => {
            if (result.isConfirmed) {
           this.newBankAccount();
            }
          })
        },
        error: (e) => console.error(e)
      });
  }
  newBankAccount(): void {
    this.submitted = false;
    window.location.reload();
    
    
  }
  

}
