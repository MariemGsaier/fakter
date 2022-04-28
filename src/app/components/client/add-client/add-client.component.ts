import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';

interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}

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
      .subscribe(
        res => {
          console.log(res);
          this.submitted = true;
          // this.router.navigate(['/clients']);
        },
        error => console.error(error)
      );
  }
  newClient(): void {
    this.submitted = false;
    this.client = {
      nom_client: '',
      adresse_client: '',
      numtel_client: 0,
      courriel_client: '',
      siteweb_client: '',
      numcomptebancaire_client: 0,
      dureepaiement_client: 0,
     
    };
  }
  alerts: alerts[] = [
    {
      border: "alert-border-success",
      background: "alert-success",
      color: "alert-text-success",
      icon: "check-circle",
      iconColor: "text-success",
      message: "Client ajouté avec succès",
    },
  ]

}
