import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  id: number;
  nom: string;
  numtel: string;
  adresse: string;
  courriel: string;
  siteweb: string;
  typesociete: string;
  numRCS: string;
  tva: string;
  timbrefisc: string;
  image: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, nom: 'Deep Javiya', numtel: '23145698', adresse: 'ben arous', courriel: 'test@gmail.com', siteweb:'///', typesociete: '123456789', numRCS:'123568', tva :'10%', timbrefisc: '12', image:'ff' },
  { id: 2, nom: 'Nirav Joshi', numtel: '23145698 ', adresse: 'ben arous', courriel: 'test@gmail.com', siteweb:'///', typesociete: '123456789', numRCS:'123568', tva :'10', timbrefisc: '15', image:'ff' },
  { id: 3, nom: 'Sunil Joshi', numtel: ' 23145698', adresse: 'ben arous', courriel: 'test@gmail.com', siteweb:'///', typesociete: '123456789', numRCS:'123568', tva :'7%', timbrefisc: '20', image:'ff' },
  { id: 4, nom: 'Maruti Makwana', numtel: '23145698 ', adresse: 'ben arous', courriel: 'test@gmail.com', siteweb:'///', typesociete: '123456789',numRCS:'123568', tva :'10', timbrefisc: '30', image:'ff' },
];

@Component({
  selector: 'app-societies',
  templateUrl: './societies.component.html',
  styleUrls: ['./societies.component.scss']
})
export class SocietiesComponent implements OnInit {
displayedColumns: string[] = ['id', 'nom', 'numtel', 'adresse', 'courriel', 'siteweb', 'typesociete','numRCS','tva','timbrefisc','image','actions'];
  dataSource = ELEMENT_DATA;
  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
  }

}
