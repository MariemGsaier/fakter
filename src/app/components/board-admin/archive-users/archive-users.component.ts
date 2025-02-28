import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { User } from "src/app/models/user.model";
import { GestUserService } from "src/app/services/gest-user.service";
import Swal from "sweetalert2";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { TokenStorageService } from "src/app/services/token-storage.service";
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
  selector: "app-archive-users",
  templateUrl: "./archive-users.component.html",
  styleUrls: ["./archive-users.component.scss"],
})
export class ArchiveUsersComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = ["username", "email", "role", "action"];
  dataSource = new MatTableDataSource<User>();
  users?: User[];
  paginator?: MatPaginator;
  currentUser: User = {
    username: "",
    email: "",
    role: "",
    etat_user: true,
  };
  currentIndex = -1;
  hideAuthSupAdmin = false;

  constructor(
    private gestUserService: GestUserService,
    private tokenStorageService: TokenStorageService,
    private factureService: FactureService
  ) {}

  ngOnInit(): void {
    this.retrieveUsers();
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = {};
    this.currentIndex = -1;
  }

  setActiveUser(user: any, index: number): void {
    this.currentUser = user;
    // console.log(user);
    this.currentIndex = index;
  }

  enableUser(body: User) {
    body.etat_user = true;
    this.gestUserService.enableUser(body.id, body).subscribe({
      next: (res) => {
        // console.log(res);
        Swal.fire({
          title: "Utilisateur activé avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.retrieveUsers();
          }
        });
      },
    });
  }

  retrieveUsers(): void {
    this.gestUserService.getAll().subscribe({
      next: (data) => {
        if (
          (this.tokenStorageService.getUser().role = "Super Administrateur") &&
          this.tokenStorageService.getUser().username == data[0].username
        ) {
          this.hideAuthSupAdmin = true;
        }
        let userAuth = this.tokenStorageService.getUser();
        this.users = data.filter((elm) => elm.id !== userAuth.id && elm.etat_user == false);
        this.dataSource.data = this.users;
        // // console.log(data);
      },
      error: (e) => {
        console.error(e);
        Swal.fire({
          title: "Echec d'affichage des utilisateurs !",
          text: "Une erreur est survenue lors du chargement de la liste des utilisateurs.",
          icon: "warning",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
      },
    });
  }

  deleteUser(user: User): void {
    this.factureService.getUser(user.id).subscribe({
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
              this.gestUserService.delete(user.id).subscribe({
                next: (res) => {
                  // console.log(res);
                  this.refreshList();
                },
                error: (e) => {
                  console.error(e);
                  Swal.fire({
                    title: "Echec de supression !",
                    text: "Une erreur est survenue lors de la supression de l'utilisateur.",
                    icon: "warning",
                    confirmButtonColor: "#00c292",
                    confirmButtonText: "Ok",
                  });
                },
              });
            }
          });
        } else {
          Swal.fire({
            title: "Echec de supression !",
            text: "Vous ne pouvez pas supprimer cet utilisateur car il appartient à une facture existante. Vous pouvez opter pour l'archivage !",
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
