import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import { FactureStoreService } from 'src/app/store/facture-store.service';
import { PaidfactureStoreService } from 'src/app/store/paidfacture-store.service';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import "moment/locale/ja";
import "moment/locale/fr";
import { MatTableDataSource } from '@angular/material/table';
import { ArticleslignefactStoreService } from 'src/app/store/articleslignefact-store.service';


export interface Element {
  nom_article: string;
  quantite: number;
  prix: number;
  taxe: number;
}


@Component({
  selector: 'app-paid-facture',
  templateUrl: './paid-facture.component.html',
  styleUrls: ['./paid-facture.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "ja-JP" },
    {
      provide: LOCALE_ID,
      useValue: "fr",
    },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class PaidFactureComponent implements OnInit {

  

  displayedColumns: string[] = [
    "nom",
    "quantite",
    "prix",
    "taxe",
  ];
  ligneFact: Element[] = [];;
  dataSource = new MatTableDataSource<Element>();
  facture: Facture = {
    reference: "",
    date_facturation: new Date(),
    date_echeance: new Date(),
    date_paiement: undefined,
    etat_facture: false,
    etat_echeance: false,
    total_ht: undefined,
    total_ttc: 0,
    total_devise: undefined,
    devise: {
      nom : "",
      devise : ""

    },
    nom_user: "",
    compte: {
      num_compte: "",
      iban: "",
      rib: ""
    },
    num_boncommande: 0,
    client: {
      nom: "",
    },
    article: {
      nom_article: ""
    },
  };
 
  

  constructor(private factureStore : PaidfactureStoreService, private ligneFactStore : ArticleslignefactStoreService , private factureService : FactureService,  @Inject(MAT_DATE_LOCALE) private _locale: string ) { }

  ngOnInit(): void {
    this.ligneFact = this.ligneFactStore.getArticlesFromStore();
    console.log("ligneeeFuckkk",this.ligneFact);
    console.log("ttttt",this.dataSource.data);
    this.facture= this.factureStore.getFactureFromStore();
    
    
    
    this.dataSource = new MatTableDataSource<Element>(this.ligneFact);
    
  }

  getDateFormatString(): string {
    if (this._locale === "ja-JP") {
      return "YYYY/MM/DD";
    } else if (this._locale === "fr") {
      return "DD/MM/YYYY";
    }
    return "";
  }

  confirmpaiement() : void{
    this.facture.etat_facture = true;
    this.facture.date_paiement = this.facture.date_paiement;
    
    this.factureService.update(this.facture.id, this.facture).subscribe({
      next: (res) => {
        console.log(res)
      }
  });
  }

  public exportToPDF(){
    let element = document.getElementById('facture') as HTMLCanvasElement;
      
      html2canvas(element).then(canvas => {
          
          let docWidth = 208;
          let docHeight = canvas.height * docWidth / canvas.width;
          
          const contentDataURL = canvas.toDataURL('image/png')
          let doc = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)
          
          doc.save('FacturePayéePdf.pdf');
      });
  }



  }
