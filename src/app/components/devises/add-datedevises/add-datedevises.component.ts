import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Datedevise } from 'src/app/models/datedevise.model';
import { DatedeviseService } from 'src/app/services/datedevise.service';
import { DeviseStoreService } from "src/app/store/devise-store.service";
import { Devise } from 'src/app/models/devise.model';

@Component({
  selector: 'app-add-datedevises',
  templateUrl: './add-datedevises.component.html',
  styleUrls: ['./add-datedevises.component.scss']
})
export class AddDatedevisesComponent implements OnInit {
  dateDeviseForm: FormGroup = new FormGroup({
    date: new FormControl(''),
    valeur: new FormControl('')
  });
  dateDevise: Datedevise = {
    date: new Date(),
    valeur: undefined
  };
  submitted = false;
  devise: Devise = {
    nom: "",
    devise: "",
  };
  storeddevise ?: Devise ;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dateDeviseService: DatedeviseService,
    private formBuilder: FormBuilder,
    private deviseStore : DeviseStoreService) { }

  ngOnInit(): void {
    this.storeddevise = this.deviseStore.getDeviseFromStore();
    console.log('!!!!',this.storeddevise);
    this.devise.nom = this.storeddevise.nom;
    this.dateDeviseForm = this.formBuilder.group(
      {
        date: ['', [Validators.required, Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)]],
        valeur: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)]]
      }
    );
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

  saveDateDevise(): void {
    const data = {
      date: this.dateDevise.date,
      valeur: this.dateDevise.valeur,
    };
    
    if (!(this.dateDeviseForm.invalid)) {
    this.dateDeviseService.create(data)
    .subscribe({
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
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/add-devise'])
          } else if (!(result.isConfirmed)) {
            this.router.navigate(['/devises'])
          }
        })
      },
      error: (e) => console.error(e)
    } );

}
}
}
