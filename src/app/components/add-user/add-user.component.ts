import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GestUserService } from 'src/app/services/gest-user.service';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from 'src/app/validation/validation';

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
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
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
    {value: 'observer', viewValue: 'observer'},
  ];
  

  constructor(private formBuilder: FormBuilder, private gestUserService: GestUserService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9]+$/)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()]+$/)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
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
