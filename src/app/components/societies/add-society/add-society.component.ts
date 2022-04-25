import { Component, OnInit } from '@angular/core';

interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}

@Component({
  selector: 'app-add-society',
  templateUrl: './add-society.component.html',
  styleUrls: ['./add-society.component.scss']
})
export class AddSocietyComponent implements OnInit {

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
