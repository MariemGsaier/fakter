import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Bankaccount } from "src/app/models/bankaccount.model";
import { BankaccountService } from "src/app/services/bankaccount.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-society-accounts",
  templateUrl: "./society-accounts.component.html",
  styleUrls: ["./society-accounts.component.scss"],
})
export class SocietyAccountsComponent implements OnInit {
  displayedColumns: string[] = [
    "numcompte",
    "rib",
    "nombanque",
    "bic",
    "iban",
    "actions",
  ];
  dataSource = new MatTableDataSource<Bankaccount>();

  currentBankAccount: Bankaccount = {
    num_compte: 0,
    rib: 0,
    bic: "",
    iban: "",
    nom_banque: "",
  };

  disabelModif: boolean = false;
  message = "";
  bankaccounts?: Bankaccount[];
  currentIndex = -1;
  search: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private BankaccountService: BankaccountService
  ) {}

  @ViewChild("Paginator") paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchBankAccounts();
    this.dataSource.paginator = this.paginator;
  }

  fetchBankAccounts(): void {
    this.BankaccountService.getAll().subscribe({
      next: (data) => {
        this.bankaccounts = data;
        this.dataSource.data = this.bankaccounts;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }
  refreshList(): void {
    this.fetchBankAccounts();
    this.currentBankAccount = {};
    this.currentIndex = -1;
  }
  setActiveBankAccount(bankaccount: Bankaccount, index: number): void {
    this.currentBankAccount = bankaccount;
    console.log(bankaccount);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  removeAllBankAccounts(): void {
    Swal.fire({
      title: "Êtes-vous sûr de tout supprimer ? ",
      text: "Vous ne serez pas capable de restaurer !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor: "#e46a76",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.BankaccountService.deleteAll().subscribe({
          next: (res) => {
            console.log(res);
            this.message = res.message
              ? res.message
              : "all bank accounts were deleted successfully!";
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }

  updateBankAccount(): void {
    this.message = "";
    this.BankaccountService.update(
      this.currentBankAccount.id,
      this.currentBankAccount
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.disabelModif = false;
        this.message = res.message
          ? res.message
          : "This bank account was updated successfully!";
      },
      error: (e) => console.error(e),
    });
  }

  deleteBankAccount(bankaccount: Bankaccount): void {
    Swal.fire({
      title: "Êtes-vous sûr de le supprimer ? ",
      text: "Vous ne serez pas capable de le récupérer !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor: "#e46a76",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.BankaccountService.delete(bankaccount.id).subscribe({
          next: (res) => {
            console.log(res);
            this.message = res.message
              ? res.message
              : "This bank account was deleted successfully!";
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }
  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }
}
