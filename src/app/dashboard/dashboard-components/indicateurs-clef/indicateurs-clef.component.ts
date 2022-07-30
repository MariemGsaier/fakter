import { Component, OnInit } from '@angular/core';
import { Facture } from 'src/app/models/facture.model';
import { ArticleService } from 'src/app/services/article.service';
import { ClientService } from 'src/app/services/client.service';
import { FactureService } from "src/app/services/facture.service";


@Component({
  selector: 'app-indicateurs-clef',
  templateUrl: './indicateurs-clef.component.html',
})
export class IndicateursClefComponent implements OnInit {
  factures?: Facture[];
  nbFact = 0;
  nbClients= 0;
  nbArticles=0;
  nbEch=0;
  nbNonEch=0;
  nbPaid=0
  nbNonPaid=0
  nbEchNonPaid=0

  constructor(private factureservice : FactureService , private clietService : ClientService , private articleService : ArticleService) { }

  ngOnInit(): void {
    this.getkpis()
  }

  getkpis() : void {
    this.factureservice.getAllFactDetailed().subscribe({
      next: (data) => { 
        this.nbFact = data.length
        for (let i=0;i<data.length;i++){
          if(data[i].etat_echeance==true){
            this.nbEch++;
          }
          else {
            this.nbNonEch++
          }
          if(data[i].etat_facture ==true){
            this.nbPaid++;
          }
          else {
            this.nbNonPaid++
          }
          if(data[i].etat_echeance==true && data[i].etat_facture== false){
            this.nbEchNonPaid++;
          }
         

        }

          
      },
      error: (e) => {
        console.error(e);
      
      }

    })
    this.clietService.getAll().subscribe({
      next : (data) => {
        this.nbClients = data.length
      }
    })
    this.articleService.getAll().subscribe({
      next : (data) => {
        this.nbArticles = data.length
      }
    })
  }


}
