import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  id: number;
  nom: string;
  numtel: string;
  adresse: string;
  courriel: string;
  nbc: string;
  dp: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, nom: 'Deep Javiya', numtel: '23145698', adresse: 'ben arous', courriel: 'test@gmail.com', nbc: '123456789', dp: 12 },
  { id: 2, nom: 'Nirav Joshi', numtel: '23145698 ', adresse: 'ben arous', courriel: 'test@gmail.com', nbc: '123456789', dp: 15 },
  { id: 3, nom: 'Sunil Joshi', numtel: ' 23145698', adresse: 'ben arous', courriel: 'test@gmail.com', nbc: '123456789', dp: 20 },
  { id: 4, nom: 'Maruti Makwana', numtel: '23145698 ', adresse: 'ben arous', courriel: 'test@gmail.com', nbc: '123456789', dp: 30 },
];

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.scss']
})
export class FacturesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom','nbc', 'dp', 'numtel', 'adresse', 'courriel', 'total','montantdu','etat','actions'];
  dataSource = ELEMENT_DATA;

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
  }

}
