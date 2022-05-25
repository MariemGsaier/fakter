import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


interface CodeId {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  
  client: Client = {
  code_identification:'',
  nom: '',
  adresse: '',
  numtel: undefined,
  courriel: '',
  siteweb: '',

  };
  clientForm: FormGroup = new FormGroup({

    cin: new FormControl(''),
    rcs: new FormControl(''),
    passeport: new FormControl(''),
    timbrefisc: new FormControl(''),
    codetva: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    website: new FormControl(''),
    nomclt: new FormControl(''),
    adresse: new FormControl('')
    
  });
  submitted = false;


  codesId: CodeId[] = [
    {value: 'cin', viewValue: 'CIN'},
    {value: 'numPasseport', viewValue: 'Numéro du passeport'},
    {value: 'codeTva', viewValue: 'Code de TVA'},
    {value: 'numRcs', viewValue: 'Numéro du RCS'},
    {value: 'matriculeFisc', viewValue: 'Matricule fiscale'},
  ];
 

  constructor(private route: ActivatedRoute,
    private router: Router, private clientService: ClientService, private formBuilder: FormBuilder) { }

    

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group(
      {
        cin: ['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(8),Validators.minLength(8)]],
        rcs :['',[Validators.required,Validators.pattern("/^\w+((\-?| ?)\w+)? [a-bA-B] (\d{9}|((\d{3} ){2}\d{3}))$/gm")]],
        codetva: ['',[Validators.required,Validators.pattern("^[A-Za-z]{2,4}(?=.{2,12}$)[-_\s0-9]*(?:[a-zA-Z][-_\s0-9]*){0,2}^")]],
        timbrefisc : ['',[Validators.required,Validators.pattern("^[A-Za-z]{2,4}(?=.{2,12}$)[-_\s0-9]*(?:[a-zA-Z][-_\s0-9]*){0,2}^")]],
        email: ['', [Validators.required, Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]],
        phone: ['', [ Validators.required,Validators.pattern("^[0-9]*$")]],
        website: ['', Validators.pattern("^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$")],
        nomclt: ['', [Validators.required,Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        adresse: ['', [Validators.required,Validators.pattern("\d{1,4}[A-Z]?\s([NSEW]\.)?\s(\d{1,3}(st|nd|rd|th))?\s(\w\s)+([A-Z][a-z]{1,3}\.)?")]]
      } 
       
    );

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

  saveClient(): void {
    const data = {
      code_identification: this.client.code_identification,
      nom: this.client.nom,
      adresse: this.client.adresse,
      numtel: this.client.numtel,
      courriel: this.client.courriel,
      siteweb: this.client.siteweb,
    };
    if (!(this.clientForm.invalid)) {
      this.clientService.create(data)
      .subscribe({
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
            })
            .then((result) => {
              if (result.isConfirmed) {
             this.newClient();
              }
              else {
                this.router.navigate(["/clients"]);
              }
            })
          },
          error: (e) => console.error(e)
        } );

    }
 

    }
  
  newClient(): void {
    this.submitted = false;
    window.location.reload();
  }
  

}
