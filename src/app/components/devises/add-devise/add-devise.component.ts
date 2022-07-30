import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Devise } from 'src/app/models/devise.model';
import { DeviseService } from 'src/app/services/devise.service';
import { DeviseStoreService } from "src/app/store/devise-store.service";

interface devise {
  value: string;
  viewValue: string;
}

interface nomDevise {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-devise',
  templateUrl: './add-devise.component.html',
  styleUrls: ['./add-devise.component.scss'],
  
})
export class AddDeviseComponent implements OnInit {
  deviseForm: FormGroup = new FormGroup({
    nom: new FormControl(''),
    devise: new FormControl('')
  });

  devise: Devise = {
    nom: "",
    devise: "",
    archive: false
  };
  submitted = false;
  errorAddDevise =false;
  errorMsg =""

  valeurs: devise[] = [
    { value: "EUR", viewValue: "EUR" },
    { value: "USD", viewValue: "USD" },
    { value: "CAD", viewValue: "CAD" },
    { value: "AUD", viewValue: "AUD" },
    { value: "TRY", viewValue: "TRY" },
    { value: "EGP", viewValue: "EGP" },
    { value: "AED", viewValue: "AED" },
  ];

  noms: nomDevise[] = [
    { value: "euro", viewValue: "euro" },
    { value: "Dollar américain", viewValue: "Dollar américain" },
    { value: "Dollar canadien", viewValue: "Dollar canadien" },
    { value: "Dollar australien", viewValue: "Dollar australien" },
    { value: "Lire turque", viewValue: "Lire turque" },
    { value: "Livre égyptienne", viewValue: "Livre égyptienne" },
    { value: "Dirham des Émirats Arabes Unis", viewValue: "Dirham des Émirats Arabes Unis" },
  ];

  constructor(
    private router: Router,
    private deviseService: DeviseService,
    private formBuilder: FormBuilder,
    private deviseStore : DeviseStoreService
   ) { }

  ngOnInit(): void {
    this.deviseStore.resetDeviseStore();
    this.deviseForm = this.formBuilder.group(
      {
        nom: ['', [Validators.required]],
        devise: ['', [Validators.required]]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.deviseForm.controls;
    
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.deviseForm.invalid) {
      return;
    }
  }

  saveDevise(): void {
    const data = {
      nom: this.devise.nom,
      devise: this.devise.devise,
      archive: false,
    };
    
    if ((this.deviseForm.valid)) {
    this.deviseService.create(data)
    .subscribe({
      next: (res) => {
        // console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous allez être redirigé vers l'interface d'ajout d'un taux de change pour la devise que vous venez d'ajouter.",
          icon: "success",
          confirmButtonColor: "#00c292",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.deviseStore.setDeviseInStore(data);
            // console.log(this.deviseStore.getDeviseFromStore());
            this.router.navigate(['/add-datedevise'])
          }
        })
      },
      error: (e) => {
        console.error(e);
        this.errorAddDevise=true
        this.errorMsg = "le nom de la devise entré existe déjà !";
      }
    } );

}
}

  newDevise(): void {
    this.submitted = false;
    window.location.reload();
  }

}
