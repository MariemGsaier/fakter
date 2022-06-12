import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Client } from "src/app/models/client.model";
import { ClientService } from "src/app/services/client.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { TokenStorageService } from "src/app/services/token-storage.service";
import * as XLSX from "xlsx";
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
  nextPageLabel = "Page suivante";
  previousPageLabel = "Page précédente";

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = [
    "code_identification",
    "nom",
    "numtel",
    "adresse",
    "courriel",
    "siteweb",
    "actions",
  ];
  dataSource = new MatTableDataSource<Client>();
  currentClient: Client = {
    code_identification: "",
    nom: "",
    adresse: "",
    numtel: undefined,
    courriel: "",
    siteweb: "",
  };

  clientForm: FormGroup = new FormGroup({
    email: new FormControl(""),
    phone: new FormControl(""),
    website: new FormControl(""),
    nomclt: new FormControl(""),
    adresse: new FormControl(""),
  });

  codesId = [
    { id: 0, value: "Numéro CIN" },
    { id: 1, value: "Numéro Passeport" },
    { id: 2, value: "Identifiant Fiscal" },
  ];
  submitted = false;
  paginator?: MatPaginator;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  errorUpdateUser = false;
  errorMsg = "";
  selectedValue = "";
  disabelModif: boolean = false;
  message = "";
  clients?: Client[];
  currentIndex = -1;
  fileName = "ClientsSheet.xlsx";
  searchTerm: any;
  search: boolean = false;

  constructor(
    private clientService: ClientService,
    private tokenStorageService: TokenStorageService,
    private formBuilder: FormBuilder,
    private factureService: FactureService
  ) {}

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.fetchClients();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
    this.clientForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      website: [
        "",
        Validators.pattern(
          "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
        ),
      ],
      nomclt: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")],
      ],
      adresse: ["", Validators.required],
      codeid: [{ value: "", disabled: true }],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.clientForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.clientForm.invalid) {
      return;
    }
  }
  onReset(): void {
    this.submitted = false;
    this.clientForm.reset();
  }

  changeCodeIdClient(data: any) {
    console.log(this.codesId[data].value);
    const ctrl = this.clientForm.controls["codeid"];
    // const ctrl = this.clientForm.get("codeid");

    ctrl.enable();
    switch (this.codesId[data].value) {
      case "cin":
        ctrl.setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(8),
          Validators.minLength(8),
        ]);
        break;
      case "numPasseport":
        ctrl.setValidators([
          Validators.required,
          Validators.pattern(
            "^[A-Z0-9<]{9}[0-9]{1}[A-Z]{3}[0-9]{7}[A-Z]{1}[0-9]{7}[A-Z0-9<]{14}[0-9]{2}$"
          ),
        ]);
        break;
      case "matriculeFisc":
        ctrl.setValidators([
          Validators.required,
          Validators.pattern(
            "/[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]/"
          ),
        ]);
        break;

      default:
        break;
    }
    return this.codesId[data].value;
  }

  fetchClients(): void {
    this.clientService
      .getAll()

      .subscribe({
        next: (data) => {
          this.clients = data;
          this.clients = data.filter((elm) => elm.archive == false);
          this.dataSource.data = this.clients;
          console.log(data);
        },
        error: (e) => {
          console.error(e);
          Swal.fire({
            title: "Echec d'affichage des clients !",
            text: "Une erreur est survenue lors du chargement de la liste des clients.",
            icon: "warning",
            confirmButtonColor: "#00c292",
            confirmButtonText: "Ok",
          });
        },
      });
  }

  refreshList(): void {
    this.fetchClients();
    this.currentClient = {};
    this.currentIndex = -1;
  }

  archiveClient(body: Client) {
    body.archive = true;
    this.clientService.update(body.id, body).subscribe({
      next: (res) => {
        console.log(res);
        Swal.fire({
          title: "Client archivé avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.refreshList();
          }
        });
      },
    });
  }
  setActiveClient(client: Client, index: number): void {
    this.currentClient = client;
    console.log(client);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  updateClient(): void {
    this.clientService
      .update(this.currentClient.id, this.currentClient)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.disabelModif = false;
          Swal.fire({
            title: "Le client  est mis à jour avec succés ! ",
            icon: "success",
            confirmButtonColor: "#00c292",
            confirmButtonText: "Ok",
          });
        },
        error: (e) => {
          console.error(e);
          this.errorUpdateUser = true;
          this.errorMsg =
            "Une erreur est survenue lors de la mise à jour du client !";
        },
      });
  }

  deleteClient(client: Client): void {
    console.log(client.id);
    
    this.factureService.getClient(client.id).subscribe({
      next: (res: any) => {
        console.log(res);
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
              this.clientService.delete(client.id).subscribe({
                next: (res) => {
                  console.log(res);
                  this.refreshList();
                },
                error: (e) => {
                  console.error(e);
                  Swal.fire({
                    title: "Echec de supression !",
                    text: "Une erreur est survenue lors de la supression du client.",
                    icon: "warning",
                    confirmButtonColor: "#00c292",
                    confirmButtonText: "Ok",
                  });
                },
              });
            }
          });
        } else {
          console.log("NON NULL");
          Swal.fire({
            title: "Echec de supression !",
            text: "Vous ne pouvez pas supprimer ce client car il appartient à une facture existante. Vous pouvez opter pour l'archivage !",
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

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById("excel-table");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  annuler(): void {
    this.disabelModif = false;
    this.fetchClients();
  }
}
