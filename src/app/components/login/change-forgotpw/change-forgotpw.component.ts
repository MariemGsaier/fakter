import { Component, OnInit } from "@angular/core";
import { UserStoreService } from "src/app/store/user-store.service";
import { AuthService } from "src/app/services/auth.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "src/app/models/user.model";
import { Validation } from "src/app/validation/validation";
import Swal from "sweetalert2";

@Component({
  selector: "app-change-forgotpw",
  templateUrl: "./change-forgotpw.component.html",
  styleUrls: ["./change-forgotpw.component.scss"],
})
export class ChangeForgotpwComponent implements OnInit {
  changeForgotPwForm: FormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
    confirmPassword: new FormControl(""),
  });
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userStore: UserStoreService
  ) {}

   
  user: User = {
    password: "",
    email: "",
  };
  storeduser ?: User ;

  ngOnInit(): void {

    this.storeduser=this.userStore.getUserFromStore();
    console.log(this.storeduser);
    this.user.email = this.storeduser.email;
    this.changeForgotPwForm = this.formBuilder.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*() ]+$/),
          ],
        ],
        confirmPassword: ["", Validators.required],
        email: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"
            ),
          ],
        ],
      },
      {
        validators: [Validation.match("password", "confirmPassword")],
      }
    );
    // console.log(this.storeduser);
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

  changeForgotPw(): void {
    console.log(this.user);
    this.authService.changeForgtoPw(this.user).subscribe({
      next: (data) => {
        Swal.fire({
          title: "Votre mot de passe est mis à jour avec succés ! ",
          icon: "success",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
        console.log(data);
        this.router.navigate(['/login']);
      },
      error: (e) => console.error(e),
    });
  }
}
