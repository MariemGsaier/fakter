import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { Datedevise } from "src/app/models/datedevise.model";
import { DatedeviseService } from "src/app/services/datedevise.service";
import { DeviseService } from "src/app/services/devise.service";

@Component({
  selector: "app-add-date",
  templateUrl: "./add-date.component.html",
  styleUrls: ["./add-date.component.scss"],
})
export class AddDateComponent implements OnInit {
  dateDeviseForm: FormGroup = new FormGroup({
    date: new FormControl(""),
    valeur: new FormControl(""),
    nom: new FormControl(""),
  });
  dateDevise: Datedevise = {
    date: new Date(),
    valeur: undefined,
    nom_devise: "",
  };
  devises = [
    {
      nom: "",
    },
  ];
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dateDeviseService: DatedeviseService,
    private formBuilder: FormBuilder,
    private deviseService: DeviseService
  ) {}

  ngOnInit(): void {
    this.getDevises();
    this.dateDeviseForm = this.formBuilder.group({
      date: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
          ),
        ],
      ],
      valeur: [
        "",
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)],
      ],
      nom: ["", [Validators.required]],
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.dateDeviseForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.dateDeviseForm.invalid) {
      return;
    }
  }

  getDevises() {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        this.devises = data.map((data: any) => {
          return {
            nom: data.nom,
          };
        });
        console.log("!!!", this.devises);
      },
    });
  }

  saveDateDevise(): void {
    const data = {
      date: this.dateDevise.date,
      valeur: this.dateDevise.valeur,
      nom_devise: this.dateDevise.nom_devise,
    };

    if (!this.dateDeviseForm.invalid) {
      this.dateDeviseService.create(data).subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          Swal.fire({
            title: "Ajout avec succés !",
            text: "Vous pouvez ajouter une autre devise ou quitter.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#00c292",
            cancelButtonColor: "#e46a76",
            confirmButtonText: "Ajouter une autre devise",
            cancelButtonText: "Quitter",
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(["/add-devise"]);
            } else if (!result.isConfirmed) {
              this.router.navigate(["/devises"]);
            }
          });
        },
        error: (e) => console.error(e),
      });
    }
  }
}
