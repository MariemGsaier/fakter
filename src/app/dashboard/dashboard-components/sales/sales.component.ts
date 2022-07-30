import { Component, OnInit } from '@angular/core';
import { isNull } from 'lodash';
import * as apex from 'ng-apexcharts';
import { Facture } from 'src/app/models/facture.model';
import { ArticleService } from 'src/app/services/article.service';
import { ClientService } from 'src/app/services/client.service';
import { FactureService } from "src/app/services/facture.service";
import { LigneFactureService } from 'src/app/services/ligne-facture.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],

})
export class SalesComponent implements OnInit {


  clients = new Array()
  dates = new Array()
  articles = new Array()
  chiffAffHTClt = new Array()
  chiffAffTTCClt = new Array()
  chiffAffHTArt = new Array()
  chiffAffTTCArt = new Array()
  chiffAffTTCYear = new Array()
  chiffAffHTYear = new Array()
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

  seriesClt!: apex.ApexAxisChartSeries;
  dataLabelsClt!: apex.ApexDataLabels;
  chartClt!: apex.ApexChart;
  legendClt!: apex.ApexLegend;
  xaxisClt!: apex.ApexXAxis;
  gridClt!: apex.ApexGrid;
  strokeClt!: apex.ApexStroke;
  plotOptionsClt!: apex.ApexPlotOptions;
  fillClt!: apex.ApexFill;
  tooltipClt!: apex.ApexTooltip;
 
  

  seriesArt!: apex.ApexAxisChartSeries;
  dataLabelsArt!: apex.ApexDataLabels;
  chartArt!: apex.ApexChart;
  legendArt!: apex.ApexLegend;
  xaxisArt!: apex.ApexXAxis;
  gridArt!: apex.ApexGrid;
  strokeArt!: apex.ApexStroke;
  plotOptionsArt!: apex.ApexPlotOptions;
  fillArt!: apex.ApexFill;
  tooltipArt!: apex.ApexTooltip;

  constructor(
  private factureService : FactureService, private clientService : ClientService, private articleService : ArticleService, private ligneFact : LigneFactureService
  ) {}

  ngOnInit(): void {
    
    this.getChiffAff();  
  }

  getUnique(array: any[]){
    var uniqueArray = [];
    for(let i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}

   getChiffAff():void{
    this.clientService.getAll().subscribe({
      next : (data) =>{
        this.clients = data.map((res) => {
          return res.nom;
        }
        )
        console.log(this.clients);
      }
    })

    this.articleService.getAll().subscribe({
      next : (data) => {
        
        this.articles = data.map((res) => {
          return res.nom_article
        })

        for(let i=0; i< data.length;i++){

          let chiffAffArtHt = data[i].facture?.map((res) => {
            return res.total_ht
          })
            let chiffAffArtHT = 0
          chiffAffArtHt?.forEach((element : any) => {
            chiffAffArtHT= chiffAffArtHT + element;
          });
   
          this.chiffAffHTArt.push(chiffAffArtHT);
        
          

          let chiffAffArtTtc = data[i].facture?.map((res) => {
            return res.total_ttc
          })
          let chiffAffArtTTC = 0
          chiffAffArtTtc?.forEach((element : any) => {
            chiffAffArtTTC= chiffAffArtTTC + element;
          });
          this.chiffAffTTCArt.push(chiffAffArtTTC);
          this.initializeChartOptionsChiffAffArticle();
        }
      
      }

    })

    this.factureService
    .getAllFactDetailed().subscribe(
      {
        
        next: (data) => {
          let datesFiltered = data.filter(elm => new Date(elm.date_paiement).getFullYear() !== null )
          console.log(datesFiltered);
          
          this.dates = datesFiltered.map((res) => {
            return new Date(res.date_paiement).getFullYear()
          }
          )
          this.dates= this.getUnique(this.dates);
          this.dates = this.dates.sort((date1, date2) => date1 - date2);
          console.log(this.dates);
          let FilteredDates= this.dates.filter(elm=>elm != 1970 )
          this.dates=  FilteredDates

          for (let i=0; i<this.dates.length;i++){

            let yearAff = data.filter(elm => new Date(elm.date_paiement).getFullYear() == this.dates[i])
            
            let chiffAffHt = yearAff.map((res) => {
              return res.total_ht;
            });
            let chiffAffHT = 0
            chiffAffHt.forEach((element : any) => {
              chiffAffHT= chiffAffHT + element;
            });
            
            let chiffAffTtc = yearAff.map((res) => {
              return Math.round(res.total_ttc * 100) / 100;
            });
           let chiffAffTTC = 0
            chiffAffTtc.forEach((element : any) => {
              chiffAffTTC= chiffAffTTC + element;
            });
            this.chiffAffHTYear.push(chiffAffHT);
            this.chiffAffTTCYear.push(chiffAffTTC);
            this.initializeChartOptionsChiffAffYear()

          }
          for(let i=0; i< this.clients.length;i++){
          
       
            let clientsAff = data.filter(elm => elm.client?.nom == this.clients[i])
            let chiffAffHt = clientsAff.map((res) => {
              return res.total_ht;
            });
            let chiffAffHT = 0
            chiffAffHt.forEach((element : any) => {
              chiffAffHT= chiffAffHT + element;
            });
            
            let chiffAffTtc = clientsAff.map((res) => {
              return res.total_ttc;
            });
           let chiffAffTTC = 0
            chiffAffTtc.forEach((element : any) => {
              chiffAffTTC= chiffAffTTC + element;
            });
            this.chiffAffHTClt.push(chiffAffHT);
            this.chiffAffTTCClt.push(chiffAffTTC);
           
            
          }
          this.initializeChartOptionsChiffAffClient();
 
          
        },
        error: (e) => {
          console.error(e);
        
        }

        
      }
    );

  
  }


  private initializeChartOptionsChiffAffYear(): void{
     this.series = [
      {
        name: "Chiffre d'affaire TTC",
        data: this.chiffAffTTCYear,
        color: "#fb9678",
      },
      {
        name: "Chiffre d'affaire HT",
        data: this.chiffAffHTYear,
        color: "#03c9d7",
      },
    ];
    
    this.xaxis = {
      categories: this.dates
      
    };
    
    this.chart = {
      toolbar: {
        show: true,
      },
      type: 'bar',
      height: 300,
      
    };
    
    
    this.legend = {
      show: true,
      position: 'top'
    };
    
    this.tooltip = {
      theme: "dark"
    };
    
    this.grid = {
      show: true,
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



  private initializeChartOptionsChiffAffClient(): void{

    this.seriesClt = [
     {
       name: "Chiffre d'affaire TTC",
       data: this.chiffAffTTCClt,
       color: "#e46a76",
     },
     {
       name: "Chiffre d'affaire HT",
       data: this.chiffAffHTClt,
       color: "#00c292",
     },
   ];
   
   this.xaxisClt = {
     categories: this.clients
   };
   
   this.chartClt = {
     toolbar: {
       show: true,
     },
     type: 'bar',
     height: 300,
     
   };
   
   
   this.legendClt = {
     show: true,
     position: 'top'
   };
   
   this.tooltipClt = {
     theme: "dark"
   };
   
   
   this.gridClt = {
     show: true,
   };

   this.dataLabelsClt = {
     enabled: false,
   };

   this.strokeClt = {
     show: true,
     width: 6,
     colors: ['none']
   };

   this.plotOptionsClt = {
     bar: {
       columnWidth: '45%',
       borderRadius: 6,
     },
   };
 }

 private initializeChartOptionsChiffAffArticle(): void{

  
  

  this.seriesArt = [
    {
      name: "Chiffre d'affaire TTC",
      data: this.chiffAffTTCArt,
      color: "#03c9d7",
    },
    {
      name: "Chiffre d'affaire HT",
      data: this.chiffAffHTArt,
      color: "#00c292",
    },
  ];
  
  this.xaxisArt = {
    categories: this.articles
  };
  
  this.chartArt = {
    toolbar: {
      show: true,
    },
    type: 'bar',
    height: 300,
    
  };
  
  
  this.legendArt = {
    show: true,
    position: 'top'
  };
  
  this.tooltipArt = {
    theme: "dark"
  };
  
  
  this.gridArt = {
    show: true,
  };

  this.dataLabelsArt = {
    enabled: false,
  };

  this.strokeArt = {
    show: true,
    width: 6,
    colors: ['none']
  };

  this.plotOptionsArt = {
    bar: {
      columnWidth: '45%',
      borderRadius: 6,
    },
  };
}

}
