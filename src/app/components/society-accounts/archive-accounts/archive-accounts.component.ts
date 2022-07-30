import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { BankaccountDevise } from "src/app/models/bankaccount-devise.model";
import { Bankaccount } from "src/app/models/bankaccount.model";
import { BankaccountService } from "src/app/services/bankaccount.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { FactureService } from "src/app/services/facture.service";

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = $localize`Première page`;
  itemsPerPageLabel = $localize`Items par page:`;
  lastPageLabel = $localize`Dernière page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Page suivante';
  previousPageLabel = 'Page précédente';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: 'app-archive-accounts',
  templateUrl: './archive-accounts.component.html',
  styleUrls: ['./archive-accounts.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class ArchiveAccountsComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = [
    "numcompte",
    "rib",
    "nombanque",
    "bic",
    "iban",
    "nomdevise",
    "actions",
  ];
  dataSource = new MatTableDataSource<BankaccountDevise>();
  bankaccounts?: BankaccountDevise[];
  paginator?: MatPaginator;
  isLoggedIn = false;
  showObserverBoard = true;
  currentBankAccount: BankaccountDevise = {
    num_compte: 0,
    rib: undefined,
    bic: "",
    iban: "",
    archive : false,
    nom_banque: "",
    nom_devise : ""
  };
  private roles: string[] = [];
  currentIndex = -1;
  disabelModif: boolean = false;
  constructor(private bankAccountService: BankaccountService,
    private tokenStorageService: TokenStorageService,
    private BankaccountService: BankaccountService,
    private factureService: FactureService,) { }

  ngOnInit(): void {
    this.fetchBankAccounts();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }
  
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }
  
  setActiveBankAccount(bankaccount: BankaccountDevise, index: number): void {
    this.currentBankAccount = bankaccount;
    this.currentIndex = index;
    this.disabelModif = true;
  }

  
  unarchiveBankAccount(body: Bankaccount) {
    body.archive = false;
    this.bankAccountService.update(body.num_compte, body).subscribe({
      next: (res) => {
        // console.log(res);
        Swal.fire({
          title: "Client restauré avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchBankAccounts();
          }
        });
      },
    });
  }
  
  fetchBankAccounts(): void {
    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        this.bankaccounts = data;
        this.bankaccounts = data.filter((elm) => elm.archive == true);
        this.dataSource.data = this.bankaccounts;
        // console.log(data);
      },
      error: (e) =>{
        console.error(e);
        Swal.fire({
          title: "Echec d'affichage des comptes bancaires archivés !",
          text: "Une erreur est survenue lors du chargement de l'archive des comptes bancaires.",
          icon: "warning",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
      }
    });
  }
  deleteBankAccount(bankaccount: BankaccountDevise): void {
    this.factureService.getAccount(bankaccount.num_compte).subscribe({
      next: (res: any) => {
        // console.log(res);
        if (res.status == 201) {
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
              this.BankaccountService.delete(bankaccount.num_compte).subscribe({
                next: (res) => {
                  // console.log(res);
                  this.fetchBankAccounts();
                },
                error: (e) => console.error(e),
              });
            }
          });
        } else {
          Swal.fire({
            title: "Echec de supression !",
            text: "Vous ne pouvez pas supprimer ce compte bancaire car il correspond à une facture existante. Vous pouvez opter pour l'archivage !",
            icon: "warning",
            confirmButtonColor: "#00c292",
            confirmButtonText: "Ok",
          });
        }
      },
    });
  }

  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }
}
