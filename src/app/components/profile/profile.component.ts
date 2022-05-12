import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GestUserService } from 'src/app/services/gest-user.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from 'src/app/validation/validation';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form1: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });
  form2: FormGroup = new FormGroup({
    current_password: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
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
  submitted = false;
  currentPassword?: string;
  cUser: User = {
    username: '',
    email: '',
    role: '',
    password: ''
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService, private gestUserService: GestUserService, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();

    this.form1 = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9]+$/)
          ]
        ],
        email: ['', [Validators.required, Validators.email]]
      }
    );

    this.form2 = this.formBuilder.group(
      {
        current_password: ['', Validators.required],
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

  get f1(): { [key: string]: AbstractControl } {
    return (this.form1.controls);
  }
  get f2(): { [key: string]: AbstractControl } {
    return (this.form2.controls);
  }

  onSubmit1(): void {
    this.submitted = true;

    if (this.form1.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form1.value, null, 2));
  }

  onSubmit2(): void {
    this.submitted = true;

    if (this.form2.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form2.value, null, 2));
  }

  editDetails(): void{
    this.disabelModifDetails = true;
  }

  editPassword(): void{
    this.disabelModifPassword = true;
  }

  getUser(id: string): Observable <User> {
    return this.gestUserService.get(id)
  }

  updateUser(): void {
    this.message = '';
    this.token.saveUser(this.currentUser);
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
    this.message = '';
     this.getUser(this.currentUser.id).subscribe(user => {
       console.log('teeeeeest',user.id, user.password)
      this.gestUserService.update(user.id, user.password)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModifDetails = false;
          // this.reloadPage();
          this.message = response.message ? response.message : 'Your password is updated successfully!';
        },
        error => {
          console.log(error);
        });
  })
    // console.log('gg', userpw)
    // this.currentPassword = userpw.password;
    // console.log('hh', this.currentPassword)
    
    
      
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