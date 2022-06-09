import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Societe } from 'src/app/models/societe.model';
import {Client} from 'src/app/models/client.model';
import { SocieteService } from 'src/app/services/societe.service';

export interface PeriodicElement {
  id: number;
  name: string;
  work: string;
  project: string;
  priority: string;
  badge: string;
  budget: string;
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
  styleUrls: ['./print-facture.component.scss']
})
export class PrintFactureComponent implements OnInit {



  displayedColumns: string[] = ['id', 'assigned', 'name', 'priority', 'budget'];
  dataSource = ELEMENT_DATA;


  societe: Societe = {
    nom_societe: '',
    logo: '',
    numtel: 0,
    adresse: '',
    courriel: '',
    siteweb: '',
    type_societe: '',
    num_rcs: '',
    timbre_fiscal: 0
  };

  client: Client = {
    code_identification:"",
    nom: "",
    adresse: "",
    numtel: undefined,
    courriel: "",
    siteweb: ""
  };

 

  constructor(private societeService: SocieteService) { }

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

  ngOnInit(): void {

    this.getSociete();
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
