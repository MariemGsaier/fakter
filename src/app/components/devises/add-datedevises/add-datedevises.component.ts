import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Datedevise } from 'src/app/models/datedevise.model';
import { DatedeviseService } from 'src/app/services/datedevise.service';

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
  constructor(private route: ActivatedRoute,
    private router: Router,
    private dateDeviseService: DatedeviseService,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.dateDeviseForm = this.formBuilder.group(
      {
        date: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]+$/)]],
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
