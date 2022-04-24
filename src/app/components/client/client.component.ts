import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}
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
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'numtel', 'adresse', 'courriel', 'nbc', 'dp','actions'];
  dataSource = ELEMENT_DATA;
  // dataSource = new MatTableDataSource<Client>();
  // content?: string;
  // currentClient: Client = {
  //   username: '',
  //   email: '',
  //   role: ''
  // };
  message = '';
  // clients?: Client[];
  currentIndex = -1;
  nom = '';
  term = '';
  search: boolean = false;
  isDisabled: boolean = true;

    constructor( private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
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
