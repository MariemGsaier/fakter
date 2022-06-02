import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Devise } from 'src/app/models/devise.model';
import { DeviseService } from 'src/app/services/devise.service';

@Component({
  selector: 'app-add-devise',
  templateUrl: './add-devise.component.html',
  styleUrls: ['./add-devise.component.scss']
})
export class AddDeviseComponent implements OnInit {
  deviseForm: FormGroup = new FormGroup({
    nom: new FormControl(''),
    devise: new FormControl('')
  });
  devise: Devise = {
    nom: "",
    devise: ""
  };
  submitted = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private deviseService: DeviseService,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.deviseForm = this.formBuilder.group(
      {
        nom: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)]],
        devise: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)]]
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
    };
    
    if (!(this.deviseForm.invalid)) {
    this.deviseService.create(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous allez être redirigé vers l'interface d'ajout d'un taux de change pour la devise que vous venez d'ajouter.",
          icon: "success",
          confirmButtonColor: "#00c292",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/add-datedevise'])
          }
        })
      },
      error: (e) => console.error(e)
    } );

}
}

  newDevise(): void {
    this.submitted = false;
    window.location.reload();
  }

}
