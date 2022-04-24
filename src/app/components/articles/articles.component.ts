import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
  id: number;
  nom: string;
  type_article: string;
  prix: number;
  taxe: number;
  cout: number;
  unite: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, nom: 'Deep Javiya', type_article: '23145698', prix: 222, taxe: 20, cout: 500, unite: '12' },
  { id: 2, nom: 'Nirav Joshi', type_article: '23145698 ', prix: 222, taxe: 19, cout: 500, unite: '15' },
  { id: 3, nom: 'Sunil Joshi', type_article: ' 23145698', prix: 222, taxe: 17, cout: 500, unite: '20' },
  { id: 4, nom: 'Maruti Makwana', type_article: '23145698 ', prix: 222, taxe: 0, cout: 500, unite: '30' },
];

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nom', 'type_article', 'prix', 'taxe', 'cout', 'unite','actions'];
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

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }

}
