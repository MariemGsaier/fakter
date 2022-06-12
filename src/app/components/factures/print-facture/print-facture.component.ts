import { Component, OnInit,LOCALE_ID  } from '@angular/core';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Societe } from 'src/app/models/societe.model';
import {Client} from 'src/app/models/client.model';
import { SocieteService } from 'src/app/services/societe.service';
import { FactureStoreService } from 'src/app/store/facture-store.service';
import { AddFacture } from 'src/app/models/add-facture.model';
import { ArticleslignefactStoreService } from 'src/app/store/articleslignefact-store.service';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  id: number;
  name: string;
  work: string;
  project: string;
  priority: string;
  badge: string;
  budget: string;
}
export interface Element {
  nom_article: string;
  quantite: number;
  prix: number;
  taxe: number;
  sous_totalttc: number;
  soustotal_ht: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'Deep Javiya', work: 'Frontend Devloper', project: 'Flexy Angular', priority: 'Low', badge: 'badge-info', budget: '$3.9k' },
  { id: 2, name: 'Nirav Joshi', work: 'Project Manager', project: 'Hosting Press HTML', priority: 'Medium', badge: 'badge-primary', budget: '$24.5k' },
  { id: 3, name: 'Sunil Joshi', work: 'Web Designer', project: 'Elite Admin', priority: 'High', badge: 'badge-danger', budget: '$12.8k' },
  { id: 4, name: 'Maruti Makwana', work: 'Backend Devloper', project: 'Material Pro', priority: 'Critical', badge: 'badge-success', budget: '$2.4k' },
];

@Component({
  selector: 'app-print-facture',
  templateUrl: './print-facture.component.html',
  styleUrls: ['./print-facture.component.scss'],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: "fr",
    },]
})
export class PrintFactureComponent implements OnInit {

  displayedColumns: string[] = [
    "nom",
    "quantite",
    "prix",
    "taxe",
    "sous_total",
    "soustotal_ht",
  ];




  societe: Societe = {
    nom_societe: '',
    logo: '',
    numtel: 0,
    adresse: '',
    courriel: '',
    siteweb: '',
    type_societe: '',
    num_rcs: '',
  };

  client: Client = {
    code_identification:"",
    nom: "",
    adresse: "",
    numtel: undefined,
    courriel: "",
    siteweb: ""
  };
  facture: AddFacture = {};
  ligneFact: Element[] = [];;
  dataSource = new MatTableDataSource<Element>();



 

  constructor(private societeService: SocieteService,private factureStore : FactureStoreService,private ligneFactStore : ArticleslignefactStoreService) { }



  ngOnInit(): void {
    this.facture= this.factureStore.getFactureFromStore();
    this.ligneFact=this.ligneFactStore.getArticlesFromStore();
    this.dataSource = new MatTableDataSource<Element>(this.ligneFact);

    console.log(this.facture)

    this.getSociete();
  }

  public exportHtmlToPDF(){
    let element = document.getElementById('htmltable') as HTMLCanvasElement;
      
      html2canvas(element).then(canvas => {
          
          let docWidth = 208;
          let docHeight = canvas.height * docWidth / canvas.width;
          
          const contentDataURL = canvas.toDataURL('image/png')
          let doc = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)
          
          doc.save('FacturePdf.pdf');
      });
  }



  getSociete(): void {
    this.societeService.get(1)
      .subscribe(
        (data: Societe) => {
          this.societe = data;
          console.log(data);
        },
        (error: any) => {
          console.log(error);
        });
  }

}
