import { Component, OnInit } from '@angular/core';

import { AuthService } from "src/app/services/auth.service";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { User } from 'src/app/models/user.model';
import { Validation } from 'src/app/validation/validation';
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-forgotpw',
  templateUrl: './change-forgotpw.component.html',
  styleUrls: ['./change-forgotpw.component.scss']
})
export class ChangeForgotpwComponent implements OnInit {

  changeForgotPwForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  submitted = false;
  user: User = {
    password: ''
  };

  constructor(private router: Router,private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.changeForgotPwForm = this.formBuilder.group(
      {
        password: ['',[Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*() ]+$/)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
      
    );
    
  }

  get f(): { [key: string]: AbstractControl } {
    return this.changeForgotPwForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.changeForgotPwForm.invalid) {
      return;
    }
  }


}
