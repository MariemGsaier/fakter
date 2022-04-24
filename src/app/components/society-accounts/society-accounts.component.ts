import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface PeriodicElement {
  id: number;
  numcompte: string;
  rib: number;
  nombanque: string;
  bic: string;
  devise: string;
  titcompte: string;
  iban: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, numcompte: 'Deep Javiya', rib: 23145698, nombanque: 'ben arous', bic: 'blgsrt2h', devise: 'euro', titcompte: 'test', iban: 'FR123456789' },
  { id: 2, numcompte: 'Deep Javiya', rib: 23145698, nombanque: 'ben arous', bic: 'blgsrt2h', devise: 'dollar', titcompte: 'test', iban: 'FR123456789' },
  { id: 3, numcompte: 'Deep Javiya', rib: 23145698, nombanque: 'ben arous', bic: 'tblgsrt2h', devise: 'euro', titcompte: 'testtest', iban: 'FR123456789' },
  { id: 4, numcompte: 'Deep Javiya', rib: 23145698, nombanque: 'ben arous', bic: 'blgsrt2h', devise: 'dollar', titcompte: 'test', iban: 'FR123456789' },
];

@Component({
  selector: 'app-society-accounts',
  templateUrl: './society-accounts.component.html',
  styleUrls: ['./society-accounts.component.scss']
})
export class SocietyAccountsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'numcompte', 'rib', 'nombanque', 'bic', 'devise', 'titcompte','iban','actions'];
  dataSource = ELEMENT_DATA;

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
  }

 

}
