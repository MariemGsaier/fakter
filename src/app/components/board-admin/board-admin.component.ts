import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { User } from "../../models/user.model";
import { GestUserService } from "../../services/gest-user.service";
import { UserService } from "../../services/user.service";
import Swal from "sweetalert2";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { Subject } from "rxjs";
import { FactureService } from "src/app/services/facture.service";

interface role {
  value: string;
  viewValue: string;
}

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
  selector: "app-board-admin",
  templateUrl: "./board-admin.component.html",
  styleUrls: ["./board-admin.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class BoardAdminComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;

  displayedColumns: string[] = ["username", "email", "role", "action"];
  dataSource = new MatTableDataSource<User>();

  content?: string;
  user: User = {
    username: "",
    email: "",
    role: "",
    password: "",
    etat_user: false,
  };
  currentUser: User = {
    username: "",
    email: "",
    role: "",
    etat_user: true,
  };
  errorUpdate = false;
  errorMsg = "";
  users?: User[];
  currentIndex = -1;
  username = "";
  roleAuth = "";
  disabelModif: boolean = false;
  paginator?: MatPaginator;

  userUpdateForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    email: new FormControl(""),
  });
  submitted = false;
  hideAuthSupAdmin = false;

  roles: role[] = [
    { value: "Super Administrateur", viewValue: "Super administrateur" },
    { value: "Administrateur", viewValue: "Administrateur" },
    { value: "Observateur", viewValue: "Observateur" },
  ];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private gestUserService: GestUserService,
    private tokenStorage: TokenStorageService,
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
    this.userService.getAdminBoard().subscribe({
      next: (data) => {
        this.content = data;
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message;
      },
    });

    this.retrieveUsers();
    this.userUpdateForm = this.formBuilder.group({
      username: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userUpdateForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userUpdateForm.invalid) {
      return;
    }
  }

  retrieveUsers(): void {
    this.gestUserService.getAll().subscribe({
      next: (data) => {
        if (
          (this.tokenStorage.getUser().role = "Super Administrateur") &&
          this.tokenStorage.getUser().username == data[0].username
        ) {
          this.hideAuthSupAdmin = true;
        }
        let userAuth = this.tokenStorage.getUser();
        this.users = data.filter(
          (elm) => elm.id !== userAuth.id && elm.etat_user == true
        );
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

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = {};
    this.currentIndex = -1;
  }

  setActiveUser(user: any, index: number): void {
    this.currentUser = user;
    // console.log(user);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  disableUser(body: User) {
    body.etat_user = false;
    body.password = Math.random().toString(36).slice(-8);
    this.gestUserService.disableUser(body.id, body).subscribe({
      next: (res) => {
        // console.log(res);
        Swal.fire({
          title: "Utilisateur désactivé avec succés !",
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

  removeAllUsers(): void {
    this.gestUserService.deleteAll().subscribe(
      (res) => {
        // console.log(res);
        this.refreshList();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  updateUser(): void {
    // console.log("test", this.userUpdateForm.invalid);
    if (this.userUpdateForm.valid) {
      Swal.fire({
        title: "Modification effectuée avec succés !",
        icon: "success",
        confirmButtonColor: "#00c292",
      }).then((result) => {
        if (result.isConfirmed) {
          this.gestUserService
            .update(this.currentUser.id, this.currentUser)
            .subscribe({
              next: (res) => {
                // console.log(res);
                this.disabelModif = false;
                this.retrieveUsers();
              },
              error: (e) => {
                console.error(e);
                this.errorUpdate = true;
                this.errorMsg =
                  "Une erreur est survenue lors de la mise à jour de l'utilisateur !";
              },
            });
        }
      });
    }
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
            text: "Vous ne pouvez pas supprimer cet utilisateur car il a créé une facture existante. Vous pouvez opter pour l'archivage !",
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

  annuler(): void {
    this.disabelModif = false;
  }
}
