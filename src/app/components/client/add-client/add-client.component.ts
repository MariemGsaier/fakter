import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  client: Client = {
  nom_client: '',
  adresse_client: '',
  numtel_client: 0,
  courriel_client: '',
  siteweb_client: '',
  numcomptebancaire_client: 0,
  dureepaiement_client: 0
  };
  submitted = false;

  constructor(private route: ActivatedRoute,
    private router: Router, private clientService: ClientService) { }

  ngOnInit(): void {
  }
  saveClient(): void {
    const data = {
      nom_client: this.client.nom_client,
      adresse_client: this.client.adresse_client,
      numtel_client: this.client.numtel_client,
      courriel_client: this.client.courriel_client,
      siteweb_client: this.client.siteweb_client,
      numcomptebancaire_client: this.client.numcomptebancaire_client,
      dureepaiement_client: this.client.dureepaiement_client,
    };
    this.clientService.create(data)
    .subscribe({
      next: (res) => {
        console.log(res);
          this.submitted = true;
          Swal.fire({
            title: 'Ajouté avec succés !',
            icon: 'success', 
            confirmButtonColor: '#00c292',
            confirmButtonText: 'Ajouter un autre client',

          }
          ) 
          .then((result) => {
            if (result.isConfirmed) {
           this.newClient();
            }
          })
        },
        error: (e) => console.error(e)
      } );
    }
  
  newClient(): void {
    this.submitted = false;
    window.location.reload();
  }
  

}
