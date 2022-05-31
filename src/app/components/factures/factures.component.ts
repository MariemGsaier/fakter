import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from 'src/app/services/token-storage.service';


@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit {
  displayedColumns: string[] = ['reference','vendeur', 'date_facturation', 'date_echeance', 'etat_facture', 'etat_echeance', 'total_ht','total_chiffres','total_lettres', 'total_devise', 'actions'];
  dataSource = new MatTableDataSource<Facture>();
  currentFacture: Facture = {
    reference: '',
    vendeur: '',
    date_facturation: new Date (),
    date_echeance: new Date (),
    etat_facture: "",
    etat_echeance: false,
    total_ht: 0,
    total_chiffres: 0,
    total_lettres: "",
    total_devise: 0
  };
  message = '';
  factures?: Facture[];
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;

  constructor(private route: ActivatedRoute,private router: Router, private factureService: FactureService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.fetchFactures();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }

  fetchFactures(): void {
    this.factureService.getAll()
  
    .subscribe(
      data => {
        this.factures = data;
        this.dataSource.data = this.factures;
        console.log(data);
      },
      error => {
        console.log(error);
      });}

      refreshList(): void {
        this.fetchFactures();
        this.currentFacture = {};
        this.currentIndex = -1;
      }

      setActiveFacture(facture: Facture, index: number): void {
        this.currentFacture = facture;
        console.log(facture);
        this.currentIndex = index;
        this.disabelModif = true;
        
      }

      updateFacture(): void {
        this.message = '';
        this.factureService.update(this.currentFacture.id, this.currentFacture)
          .subscribe(
            response => {
              console.log(response);
              this.disabelModif = false;
              this.message = response.message ? response.message : 'This facture was updated successfully!';
            },
            error => {
              console.log(error);
            });
      }

      annuler(): void {
        this.disabelModif = false;
      }
}
