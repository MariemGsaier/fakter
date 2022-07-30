import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user.model";
import { GestUserService } from "src/app/services/gest-user.service";
import { TokenStorageService } from "src/app/services/token-storage.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Validation } from "src/app/validation/validation";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  form1: FormGroup = new FormGroup({
    username: new FormControl(""),
    email: new FormControl(""),
  });
  form2: FormGroup = new FormGroup({
    currentPassword: new FormControl(""),
    password: new FormControl(""),
    confirmPassword: new FormControl(""),
  });
  currentUser: User = {
    username: "",
    email: "",
    role: "",
  };
  user: User = {
    username: "",
    email: "",
    role: "",
  };
  users?: User[];
  message = "";
  disabelModifDetails: boolean = false;
  disabelModifPassword: boolean = false;
  submitted = false;
  currentPassword?: string;
  errorUpdateUser =false;
  errorMsg =""

  constructor(
    private formBuilder: FormBuilder,
    private gestUserService: GestUserService,
    private token: TokenStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();

    this.form1 = this.formBuilder.group({
      username: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
    });

    this.form2 = this.formBuilder.group(
      {
        currentPassword: ["", Validators.required],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()]+$/),
          ],
        ],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: [Validation.match("password", "confirmPassword")],
      }
    );
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }
  get f2(): { [key: string]: AbstractControl } {
    return this.form2.controls;
  }

  onSubmit1(): void {
    this.submitted = true;

    if (this.form1.invalid) {
      return;
    }
  }

  onSubmit2(): void {
    this.submitted = true;

    if (this.form2.invalid) {
      return;
    }
  }

  editDetails(): void {
    this.disabelModifDetails = true;
  }

  editPassword(): void {
    this.disabelModifPassword = true;
  }

  updateUser(): void {
    this.message = "";

    if (this.form1.valid) {
      this.token.saveUser(this.currentUser);
      this.gestUserService
        .update(this.currentUser.id, this.currentUser)
        .subscribe(
          (res) => {
            // console.log(res);
            this.disabelModifDetails = true;
            Swal.fire({
              title: "Modification effectuée avec succés !",
              icon: "success",
              confirmButtonColor: "#00c292",
            }).then((result) => {
              if (result.isConfirmed) {
                this.reloadPage();
              }
            });
            this.message = res.message
              ? res.message
              : "Your profile is updated successfully!";
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  updatePassword(): void {
    this.message = "";
    if (this.form2.valid) {      
      this.gestUserService
        .updatePassword(this.currentUser.id, this.form2.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.disabelModifPassword = true;
            Swal.fire({
              title: "Modification effectuée avec succés !",
              text: "Vous devez vous-reconnecter. Vous allez être redirigé vers la page de Login",
              icon: "success",
              confirmButtonColor: "#00c292",
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.token.signOut();
                this.router.navigate(['/login'])
              }
            });
            this.message = res.message
              ? res.message
              : "Votre mot de passe est modifié avec succès !";
          },
          error: (e) => {console.error(e);
            this.errorUpdateUser=true
            this.errorMsg = "Une erreur est survenue !";
          }
        });
    }
  }

  annulerDetails(): void {
    this.disabelModifDetails = false;
    this.reloadPage();
  }

  annulerPassword(): void {
    this.disabelModifPassword = false;
    this.reloadPage();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
