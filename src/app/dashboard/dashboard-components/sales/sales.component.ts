import { Component, OnInit } from '@angular/core';
import * as apex from 'ng-apexcharts';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from "src/app/services/facture.service";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],

})
export class SalesComponent implements OnInit {

  factures?: Facture[];
  factures18 = [];
  factures19 = [];
  factures20 = [];
  factures21 = [];
  factures22 = [];
  chiffAffTTC18 = 0;
  chiffAffHT18=0;
  chiffAffTTC19 = 0;
  chiffAffHT19=0;
  chiffAffTTC20 = 0;
  chiffAffHT20=0;
  chiffAffTTC21 = 0;
  chiffAffHT21=0;
  chiffAffTTC22 = 0;
  chiffAffHT22=0;

  series!: apex.ApexAxisChartSeries;
  dataLabels!: apex.ApexDataLabels;
  chart!: apex.ApexChart;
  legend!: apex.ApexLegend;
  xaxis!: apex.ApexXAxis;
  grid!: apex.ApexGrid;
  stroke!: apex.ApexStroke;
  plotOptions!: apex.ApexPlotOptions;
  fill!: apex.ApexFill;
  tooltip!: apex.ApexTooltip;

  constructor(
  private factureService : FactureService
  ) {}

  ngOnInit(): void {
    this.initializeChartOptions();
  }

  private initializeChartOptions(): void {

    this.series = [
      {
        name: 'Chiffre d"affaire TTC',
        data: [355, 390, 300, 350],
        color: "#fb9678",
      },
      {
        name: 'Chiffre d"affaire HT',
        data: [280, 250, 325, 215],
        color: "#03c9d7",
      },
    ];
    
    this.xaxis = {
      categories: ['2018','2019', '2020', '2021', '2022'],
    };
    
    this.chart = {
      toolbar: {
        show: false,
      },
      type: 'bar',
      height: 300,
      
    };
    
    
    this.legend = {
      show: false,
    };
    
    this.tooltip = {
      theme: "dark"
    };
    
    this.grid = {
      show: false,
    };

    this.dataLabels = {
      enabled: false,
    };

    this.stroke = {
      show: true,
      width: 5,
      colors: ['none']
    };

    this.plotOptions = {
      bar: {
        columnWidth: '45%',
        borderRadius: 6,
      },
    };
  }
  getChiffAff():void{
    this.factureService
    .getAllFactDetailed()

    .subscribe(
      {
        next: (data) => {
         
          console.log(data);
        },
        error: (e) => {
          console.error(e);
        
        }
      }
    );
  }


}
