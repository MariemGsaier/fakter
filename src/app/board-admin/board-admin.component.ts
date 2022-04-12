import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from '@angular/router';
import { User } from "../models/user.model";
import { GestUserService } from "../services/gest-user.service";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-board-admin",
  templateUrl: "./board-admin.component.html",
  styleUrls: ["./board-admin.component.scss"],
})
export class BoardAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'password'];
  dataSource = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);
  content?: string;
  currentUser: User = {
    username: '',
    email: '',
    role: '',
    password: ''
  };
  message = '';
  users?: User[];
  currentIndex = -1;
  username = '';
  search: boolean = false;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

/** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  constructor(private userService: UserService, private gestUserService: GestUserService, private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit(): void {
    this.message = '';
    this.userService.getAdminBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );

    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.gestUserService.getAll()
      .subscribe(
        data => {
          this.users = data;
          this.dataSource.data = this.users;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = {};
    this.currentIndex = -1;
  }

  setActiveUser(user: any): void {
    this.currentUser = user;
    console.log(user);
    //this.currentIndex = index;
  }

  removeAllUsers(): void {
    this.gestUserService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchName(): void {
    this.currentUser = {};
    this.currentIndex = -1;
    this.gestUserService.findByKeyword(this.username)
      .subscribe(
        data => {
          this.users = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  updateUser(): void {
    this.message = '';
    this.gestUserService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          console.log(response);
          this.message = response.message ? response.message : 'This user was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }
  deleteUser(): void {
    this.gestUserService.delete(this.currentUser.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/users']);
        },
        error => {
          console.log(error);
        });
  }
}