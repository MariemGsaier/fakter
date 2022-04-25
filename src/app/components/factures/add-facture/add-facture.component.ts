import { Component, OnInit } from '@angular/core';

interface vendeur {
  value: string;
  viewValue: string;

}

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.scss']
})
export class AddFactureComponent implements OnInit {
  vendeurs: vendeur[] = [
    {value: 'mariem', viewValue: 'mariem'},
    {value: 'rima', viewValue: 'rima'},
    {value: 'omar', viewValue: 'omar'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
