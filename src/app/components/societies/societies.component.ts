import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Societe } from 'src/app/models/societe.model';
import { SocieteService } from 'src/app/services/societe.service';
import Swal from "sweetalert2";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-societies',
  templateUrl: './societies.component.html',
  styleUrls: ['./societies.component.scss']
})
export class SocietiesComponent implements OnInit {
  currentSociete: Societe = {
    nom_societe: '',
    logo: '',
    numtel: 0,
    adresse: '',
    courriel: '',
    siteweb: '',
    type_societe: '',
    num_rcs: '',
    timbre_fiscale: 0
  };
  societe: Societe = {
    nom_societe: '',
    logo: '',
    numtel: 0,
    adresse: '',
    courriel: '',
    siteweb: '',
    type_societe: '',
    num_rcs: '',
    timbre_fiscale: 0
  };
  societes?: Societe[];
  message = '';
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;

  constructor(private tokenStorageService: TokenStorageService, private societeService: SocieteService, private route: ActivatedRoute,private router: Router, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.message = '';
    this.getSociete();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
    
  }

  edit(): void{
    this.disabelModif = true;
  }

  getSociete(): void {
    this.societeService.get(1)
      .subscribe(
        (data: Societe) => {
          this.currentSociete = data;
          console.log(data);
        },
        (error: any) =>{
          console.error(error);
          Swal.fire({
            title: "Echec d'affichage de la société !",
            text: "Une erreur est survenue lors du chargement des de la société.",
            icon: "warning",
            confirmButtonColor: "#00c292",
            confirmButtonText: "Ok",
          });
        });
  }

  updateSociete(): void {
    this.message = '';
    this.societeService.update(this.currentSociete.id, this.currentSociete)
      .subscribe(
        response => {
          console.log(response);
          this.disabelModif = false;
          this.reloadPage();
          this.message = response.message ? response.message : 'Your societe is updated successfully!';
        },
        error => {
          console.log(error);
        });
  }

  annuler(): void {
    this.disabelModif = false;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
