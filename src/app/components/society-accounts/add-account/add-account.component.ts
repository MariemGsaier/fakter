import { Component, OnInit } from '@angular/core';
;
interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}
interface devise {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
  


export class AddAccountComponent implements OnInit {

  // selectedValue: string;

  devises: devise[] = [
    {value: 'euro', viewValue: 'Euro'},
    {value: 'dollar', viewValue: 'Dollar'},
    {value: 'TND', viewValue: 'TND'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

  alerts: alerts[] = [
    {
      border: "alert-border-success",
      background: "alert-success",
      color: "alert-text-success",
      icon: "check-circle",
      iconColor: "text-success",
      message: "compte ajouté avec succès",
    },
  ]

}
