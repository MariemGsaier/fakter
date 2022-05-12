import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from '@angular/router';
import { animationFrameScheduler } from "rxjs";
import { User } from "../models/user.model";
import { GestUserService } from "../services/gest-user.service";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-board-admin",
  templateUrl: "./board-admin.component.html",
  styleUrls: ["./board-admin.component.scss"],
})
export class BoardAdminComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'role', 'action'];
  dataSource = new MatTableDataSource<User>();
  content?: string;
  currentUser: User = {
    username: '',
    email: '',
    role: ''
  };
  message = '';
  users?: User[];
  currentIndex = -1;
  username = '';
  term = '';
  search: boolean = false;
  disabelModif: boolean = false;


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

  setActiveUser(user: any, index: number): void {
    this.currentUser = user;
    console.log(user)
    this.currentIndex = index;
    this.disabelModif = true;
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
    this.gestUserService.search(this.username)
      .subscribe(
        data => {
          this.users = data;
          console.log(this.users);
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
          this.disabelModif = false;
          this.retrieveUsers();
          this.message = response.message ? response.message : 'This user was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }
  deleteUser(user: User): void {
    this.gestUserService.delete(user.id)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModif = false;
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }
  annuler(): void {
    this.disabelModif = false;
  }
}

  