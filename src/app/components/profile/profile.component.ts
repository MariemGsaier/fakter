import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GestUserService } from 'src/app/services/gest-user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User = {
    username: '',
    email: '',
    role: ''
  };
  user: User = {
    username: '',
    email: '',
    role: ''
  };
  users?: User[];
  message = '';
  disabelModifDetails: boolean = false;
  disabelModifPassword: boolean = false;

  constructor(private gestUserService: GestUserService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  editDetails(): void{
    this.disabelModifDetails = true;
  }

  editPassword(): void{
    this.disabelModifPassword = true;
  }

  updateUser(): void {
    this.message = '';
    this.gestUserService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModifDetails = false;
          this.reloadPage();
          this.message = response.message ? response.message : 'Your profile is updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  updatePassword(): void {
    const data = {
      password: this.user.password
    };
    this.message = '';
    this.gestUserService.update(this.currentUser.id, this.user.password)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModifPassword = false;
          this.reloadPage();
          this.message = response.message ? response.message : 'The password was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  annulerDetails(): void {
    this.disabelModifDetails = false;
  }

  annulerPassword(): void {
    this.disabelModifPassword = false;
  }

  reloadPage(): void {
    window.location.reload();
  }

}