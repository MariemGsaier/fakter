import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Societe } from "src/app/models/societe.model";
import { SocieteService } from "src/app/services/societe.service";
import Swal from "sweetalert2";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { TokenStorageService } from "src/app/services/token-storage.service";

@Component({
  selector: "app-societies",
  templateUrl: "./societies.component.html",
  styleUrls: ["./societies.component.scss"],
})
export class SocietiesComponent implements OnInit {
  societeForm: FormGroup = new FormGroup({
    nom_societe: new FormControl(""),
    numtel: new FormControl(""),
    adresse: new FormControl(""),
    courriel: new FormControl(""),
    siteweb: new FormControl(""),
    type_societe: new FormControl(""),
    num_rcs: new FormControl(""),
    timbre_fiscal: new FormControl(""),
  });

  currentSociete: Societe = {
    nom_societe: "",
    numtel: undefined,
    adresse: "",
    courriel: "",
    siteweb: "",
    type_societe: "",
    num_rcs: "",
    timbre_fiscal: undefined,
  };
  societe: Societe = {
    nom_societe: "",
    numtel: undefined,
    adresse: "",
    courriel: "",
    siteweb: "",
    type_societe: "",
    num_rcs: "",
    timbre_fiscal: undefined,
  };
  societes?: Societe[];
  message = "";
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  submitted = false;

  constructor(
    private tokenStorageService: TokenStorageService,
    private societeService: SocieteService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.message = "";
    this.getSociete();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }

    this.societeForm = this.formBuilder.group({
      nom_societe: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")],
      ],
      numtel: ["", [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.maxLength(8),
      Validators.minLength(8),]],
      siteweb: [
        "",[Validators.required,
        Validators.pattern(
          "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
        )],
      ],
      courriel: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")],
      ],
      adresse: ["", Validators.required],
      type_societe: [
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")],
      ],
      num_rcs: [
        [
          Validators.required,
          Validators.pattern(
            "/^w+((-?| ?)w+)? [a-bA-B] (d{9}|((d{3} ){2}d{3}))$/gm"
          ),
        ],
      ],
      timbre_fiscal: [
        [
          Validators.required,
          Validators.pattern(
            "/[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]/"
          ),
        ],
      ],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.societeForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.societeForm.invalid) {
      return;
    }
  }

  edit(): void {
    this.disabelModif = true;
  }

  getSociete(): void {
    this.societeService.get(1).subscribe(
      (data: Societe) => {
        this.currentSociete = data;
        console.log(data);
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          title: "Echec d'affichage de la société !",
          text: "Une erreur est survenue lors du chargement des de la société.",
          icon: "warning",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
      }
    );
  }

  updateSociete(): void {
    this.message = "";
    this.societeService
      .update(this.currentSociete.id, this.currentSociete)
      .subscribe(
        (response) => {
          console.log(response);
          this.disabelModif = false;
          this.reloadPage();
          this.message = response.message
            ? response.message
            : "Your societe is updated successfully!";
        },
        (error) => {
          console.log(error);
        }
      );
  }

  annuler(): void {
    this.disabelModif = false;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
