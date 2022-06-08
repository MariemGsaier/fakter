import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import { MatTableDataSource } from "@angular/material/table";
import { TokenStorageService } from 'src/app/services/token-storage.service';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit {
  fileName= "FacturesSheet.xlsx";
  displayedColumns: string[] = ['référence','créé_par','client', 'date_facturation', 'date_echeance', 'etat_facture', 'etat_echeance', 'total_ht','total_ttc', 'total_devise', 'actions'];
  dataSource = new MatTableDataSource<Facture>();
  currentFacture: Facture = {
    reference: "",
    date_facturation: new Date(),
    date_echeance:new Date(),
    etat_facture: "",
    etat_echeance: false,
    total_ht: undefined,
    total_ttc: undefined,
    total_devise: undefined,
    nom_devise: "",
    nom_user: "",
    client :{
      nom : ""

    },
  };
  creatorFact = this.tokenStorageService.getUser().username;
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
    this.factureService.getAllFactDetailed()
  
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
      exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }
}
