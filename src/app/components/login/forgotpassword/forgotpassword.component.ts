import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { User } from 'src/app/models/user.model';
import Swal from "sweetalert2";
import { UserStoreService } from 'src/app/store/user-store.service';



@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  forgotPwForm: FormGroup = new FormGroup({
    email: new FormControl('')
  });
  submitted = false;
  user: User = {
    email: ''
  };


  constructor(private router: Router,private formBuilder: FormBuilder,
    private authService: AuthService, private userStore : UserStoreService) { }

  ngOnInit(): void {
    this.userStore.resetUserStore();
    this.forgotPwForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
        password: ['',[Validators.required, Validators.minLength(6), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*() ]+$/)]],
        confirmPassword: ['', Validators.required]
      }
      
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.forgotPwForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.forgotPwForm.invalid) {
      return;
    }
  }

  forgotPw () : void {
    this.authService.forgtoPw(this.user)
    .subscribe({
      next: (data) => {
        Swal.fire({
          title: "l'email est envoyé avec succés ! ",
          text :"Un email a été envoyé avec les informations nécessaires pour réinitialiser votre mot de passe.",
          icon: "success",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok"
        }) 
        // // console.log(data);
        this.userStore.setUserInStore(data);
        // console.log(this.userStore.getUserFromStore());
        window.location.reload();
              },
      error: (e) => console.error(e),
    });
  }

}
