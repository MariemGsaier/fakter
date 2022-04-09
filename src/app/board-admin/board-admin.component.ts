import { Component, OnInit } from "@angular/core";
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
  content?: string;

  users?: User[];
  currentUser: User = {};
  currentIndex = -1;
  username = '';
  constructor(private userService: UserService, private gestUserService: GestUserService) { }
  ngOnInit(): void {
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

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
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
}