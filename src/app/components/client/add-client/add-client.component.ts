import { Component, OnInit } from "@angular/core";
import { Client } from "src/app/models/client.model";
import { ClientService } from "src/app/services/client.service";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { __values } from "tslib";
import { FloatLabelType } from "@angular/material/form-field";

interface CodeId {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-add-client",
  templateUrl: "./add-client.component.html",
  styleUrls: ["./add-client.component.scss"],
})
export class AddClientComponent implements OnInit {
  client: Client = {
    code_identification: "",
    nom: "",
    adresse: "",
    numtel: undefined,
    courriel: "",
    siteweb: "",
    archive: false
  };
  floatLabelPhoneControl = new FormControl('always' as FloatLabelType);
  clientForm: FormGroup = new FormGroup({
    email: new FormControl(""),
    website: new FormControl(""),
    phone: this.floatLabelPhoneControl,
    nomclt: new FormControl(""),
    adresse: new FormControl(""),
  });
  submitted = false;
  selectedValue = "";
  errorAddClient =false;
  errorMsg =""

  codesId = [
    { id: 0, value: "Numéro CIN" },
    { id: 1, value: "Numéro Passeport" },
    { id: 2, value: "Identifiant Fiscal" },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group({
      codeid: [{ value: "", disabled: true }],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"),
        ],
      ],
      phone: [
        "",
          Validators.required,
         
      ],
      website: [
        "",
        Validators.pattern(
          "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
        ),
      ],
      nomclt: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")],
      ],
      adresse: ["", [Validators.required]],
    });
  }
  changeCodeIdClient(data: any) {
    console.log(this.codesId[data].value);
    const ctrl=this.clientForm.controls["codeid"]

    ctrl.enable();
    switch (this.codesId[data].value) {
      case "Numéro CIN":
        ctrl.setValidators([Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(8),Validators.minLength(8)]);
        break;
      case "Numéro Passeport":
        ctrl.setValidators([Validators.required,Validators.pattern("^(?!^0+$)[a-zA-Z0-9]{3,20}$")]);
        break;
      case "Identifiant Fiscal":
        ctrl.setValidators([Validators.required,Validators.pattern("/[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]/")]);
        break;

      default:
        break;
    }
    return this.codesId[data].value;
  }

  

  get f(): { [key: string]: AbstractControl } {
    return this.clientForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.clientForm.invalid) {
      return;
    }
  }
  onReset(): void {
    this.submitted = false;
    this.clientForm.reset();
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelPhoneControl.value || 'always';
  }

  saveClient(): void {
    
    const data = {
      code_identification: this.client.code_identification,
      nom: this.client.nom,
      adresse: this.client.adresse,
      numtel: this.client.numtel,
      courriel: this.client.courriel,
      siteweb: this.client.siteweb,
      archive: false,
    };
    console.log(data);
    console.log(this.clientForm.valid);
    
    if (this.clientForm.valid) {
      this.clientService.create(data).subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          Swal.fire({
            title: "Ajout avec succés !",
            text: "Vous pouvez ajouter un autre client ou quitter.",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#00c292",
            cancelButtonColor: "#e46a76",
            confirmButtonText: "Ajouter un autre client",
            cancelButtonText: "Quitter",
          }).then((result) => {
            if (result.isConfirmed) {
              this.newClient();
            } else {
              this.router.navigate(["/clients"]);
            }
          });
        },
        error: (e) => {
          console.error(e);
          this.errorAddClient=true
          this.errorMsg = "le code d'identification entré existe déjà !";
        } 
      });
    }
  }

  newClient(): void {
    this.submitted = false;
    window.location.reload();
  }

  annuler(): void {
    this.router.navigate(['/clients'])
  }
}
