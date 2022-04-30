import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GestUserService } from 'src/app/services/gest-user.service';

interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}

interface role {
  value: string;
  viewValue: string;

}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    role: '',
    password: ''
  };
  submitted = false;

  roles: role[] = [
    {value: 'admin', viewValue: 'admin'},
    {value: 'user', viewValue: 'user'},
  ];
  

  constructor(private gestUserService: GestUserService) { }

  ngOnInit(): void {
  }
  alerts: alerts[] = [
    {
      border: "alert-border-success",
      background: "alert-success",
      color: "alert-text-success",
      icon: "check-circle",
      iconColor: "text-success",
      message: "Utilisateur ajouté avec succès",
    },
  ]

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
