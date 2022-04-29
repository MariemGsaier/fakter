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
  users?: User[];
  message = '';
  currentIndex = -1;
  disabelModif: boolean = false;

  constructor(private gestUserService: GestUserService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  setActiveUser(user: any, index: number): void {
    this.currentUser = user;
    console.log(user)
    this.currentIndex = index;
    this.disabelModif = true;
  }

  updateUser(): void {
    this.message = '';
    this.gestUserService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModif = false;
          this.message = response.message ? response.message : 'Your profile is updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  annuler(): void {
    this.disabelModif = false;
  }

}