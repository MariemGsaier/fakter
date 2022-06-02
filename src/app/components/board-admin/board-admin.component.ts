import { Component, OnInit, ViewChild } from "@angular/core";
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
import { MatPaginator } from "@angular/material/paginator";

interface role {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-board-admin",
  templateUrl: "./board-admin.component.html",
  styleUrls: ["./board-admin.component.scss"],
})
export class BoardAdminComponent implements OnInit {
  searchTerm: any;
  search: boolean = false;

  displayedColumns: string[] = ["username", "email", "role", "action"];
  dataSource = new MatTableDataSource<User>();

  content?: string;
  currentUser: User = {
    username: "",
    email: "",
    role: "",
  };

  message = "";
  users?: User[];
  currentIndex = -1;
  username = "";
  disabelModif: boolean = false;
  paginator?: MatPaginator;

  userUpdateForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    email: new FormControl(""),
  });
  submitted = false;

  roles: role[] = [
    {value: 'Super Administrateur', viewValue: 'Super administrateur'},
    {value: 'Administrateur', viewValue: 'Administrateur'},
    {value: 'Observateur', viewValue: 'Observateur'},
  ];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private gestUserService: GestUserService,
    private route: ActivatedRoute,
    private router: Router
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
    this.message = "";

    this.retrieveUsers();
    this.userUpdateForm = this.formBuilder.group({
      username: [
        "",
        [Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)],
      ],
      email: ["", [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
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
        this.users = data;
        this.dataSource.data = this.users;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = {};
    this.currentIndex = -1;
  }

  setActiveUser(user: any, index: number): void {
    this.currentUser = user;
    console.log(user);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  removeAllUsers(): void {
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
        this.gestUserService.deleteAll().subscribe(
          (response) => {
            console.log(response);
            this.refreshList();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  updateUser(): void {
    this.message = "";
    console.log('test',this.userUpdateForm.invalid)
    if (!this.userUpdateForm.invalid) {
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
                console.log(res);
                this.disabelModif = false;
                this.retrieveUsers();
                this.message = res.message
                  ? res.message
                  : "This client was updated successfully!";
              },
              error: (e) => console.error(e),
            });
        }
      });
    }
  }
  deleteUser(user: User): void {
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
        this.gestUserService.delete(user.id).subscribe(
          (response) => {
            console.log(response);
            this.disabelModif = false;
            this.refreshList();
          },
          (error) => {
            console.log(error);
          }
        );
      }
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
