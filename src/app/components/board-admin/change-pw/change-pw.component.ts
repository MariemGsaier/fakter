import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Validation } from 'src/app/validation/validation';
import { User } from 'src/app/models/user.model';
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-pw',
  templateUrl: './change-pw.component.html',
  styleUrls: ['./change-pw.component.scss']
})
export class ChangePwComponent implements OnInit {

  changePwForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  submitted = false;
  user: User = {
    username: '',
    password: ''
  };

  constructor( private router: Router,private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {

    this.changePwForm = this.formBuilder.group(
      {
        username: ['',[Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)]],
        password: ['',[Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*() ]+$/)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')]
      }
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.changePwForm.invalid) {
      return;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.changePwForm.controls;
  }

  changeFirstPw(): void {

        this.authService
        .changeFirstPw(this.user)
        .subscribe({
          next: (res) => {
            Swal.fire({
              title: "Le mot de passe  est mis à jour avec succés ! ",
              text :"Vous serez redirigé vers l'interface Connexion.",
              icon: "success",
              confirmButtonColor: "#00c292",
              confirmButtonText: "Ok"
            }) .then((result) => {
              if (result.isConfirmed) {
                console.log(res); 
                this.router.navigate(['/login'])
              }
            })
           
                  },
          error: (e) => console.error(e),
        });

      

    
    
      
      }
    
    }

