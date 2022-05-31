import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Validation } from 'src/app/validation/validation';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {  FileUploader } from 'ng2-file-upload';
import { Devise } from 'src/app/models/devise.model';
import { Datedevise } from 'src/app/models/datedevise.model';
import { DeviseService } from 'src/app/services/devise.service';

@Component({
  selector: 'app-add-devise',
  templateUrl: './add-devise.component.html',
  styleUrls: ['./add-devise.component.scss']
})
export class AddDeviseComponent implements OnInit {
  deviseForm: FormGroup = new FormGroup({
    nom: new FormControl(''),
    devise: new FormControl(''),
    date: new FormControl(''),
    valeur: new FormControl('')
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
        nom: ['', Validators.required, Validators.pattern(/^[A-Z0-9!@#$%^&*()]+$/)],
        devise: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()]+$/)
          ]
        ],
        date: ['', Validators.required],
        valeur: ['', Validators.required]
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
    this.deviseService.create(data).subscribe(
      (res) => {
        console.log(res);
        this.submitted = true;
        Swal.fire({
          title: "Ajout avec succés !",
          text: "Vous pouvez ajouter un autre article ou quitter.",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#00c292",
          cancelButtonColor: "#e46a76",
          confirmButtonText: "Ajouter un autre atricle",
          cancelButtonText: "Quitter",
        })
        .then((result) => {
          if (result.isConfirmed) {
         this.newDevise();
          } else if (!(result.isConfirmed)) {
            this.router.navigate(['/devises'])
          }
        })
      },
      (error) => console.error(error)
    );
    }
  }

  newDevise(): void {
    this.submitted = false;
    window.location.reload();
  }

}
