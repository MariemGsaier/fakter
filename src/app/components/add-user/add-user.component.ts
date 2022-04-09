import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GestUserService } from 'src/app/services/gest-user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: '',
    role: ''
  };
  submitted = false;

  constructor(private gestUserService: GestUserService) { }

  ngOnInit(): void {
  }
  saveUser(): void {
    const data = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role
    };
    this.gestUserService.create(data)
    .subscribe(
      response => {
        console.log(response);
        this.submitted = true;
      },
      error => {
        console.log(error);
      });
}
newUser(): void {
  this.submitted = false;
  this.user = {
    username: '',
    email: '',
    password: '',
    role: ''
  };
}

}
