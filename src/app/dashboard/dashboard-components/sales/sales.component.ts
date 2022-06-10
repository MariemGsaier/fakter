import { Component, OnInit } from '@angular/core';
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

  factures?: Facture[];
  clients = new Array()
  dates = new Array()
  articles = new Array()
  chiffAffHTClt = new Array()
  chiffAffTTCClt = new Array()
  chiffAffHTArt = new Array()
  chiffAffTTCArt = new Array()
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
        console.log("dataaaa",data)
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

      }

    })

    this.factureService.getAllArticles().subscribe({
      next : (data) => {
        console.log("ligne",data);
       

        for(let i=0; i< this.articles.length;i++){
        
          

          let articlesAff = data.filter(elm => elm.article?.nom_article == this.articles[i])
          console.log("filtertab",articlesAff);
          

          let chiffAffArtHt = articlesAff.map((res) => {
            return res.total_ht;
          });
          let chiffAffArtHT = 0
          chiffAffArtHt.forEach((element : any) => {
            chiffAffArtHT= chiffAffArtHT + element;
          });
          console.log("chifff",chiffAffArtHT);
         
          
          let chiffAffArtTtc = articlesAff.map((res) => {
            return res.total_ttc;
          });
         let chiffAffArtTTC = 0
         chiffAffArtTtc.forEach((element : any) => {
            chiffAffArtTTC= chiffAffArtTTC + element;
          });
          this.chiffAffHTArt.push(chiffAffArtHT);
          this.chiffAffTTCArt.push(chiffAffArtTTC);
       
          
        }
        this.initializeChartOptionsChiffAffArticle();

        
      }
    })
    this.factureService
    .getAllFactDetailed().subscribe(
      {
        
        next: (data) => {
          this.dates = data.map((res) => {
            return new Date(res.date_echeance).getFullYear()
          }
          )
         
          this.dates= this.getUnique(this.dates);
          this.dates = this.dates.sort((date1, date2) => date1 - date2);
          console.log(this.dates);
          
         
          
          let factures18= data.filter(elm => (new Date(elm.date_echeance).getFullYear()== this.dates[0]) && (elm.etat_facture=="payé"));
          let chiffAffHt18 = factures18.map((res) => {
            return res.total_ht;
          });
          chiffAffHt18.forEach((element : any) => {
            this.chiffAffHT18 = this.chiffAffHT18 + element;
          });
          let chiffAffTtc18 = factures18.map((res) => {
            return res.total_ttc;
          });
          chiffAffTtc18.forEach((element : any) => {
            this.chiffAffTTC18 = this.chiffAffTTC18 + element;
          });



          let factures19= data.filter(elm => (new Date(elm.date_echeance).getFullYear()== this.dates[1]) && (elm.etat_facture=="payé"));
          let chiffAffHt19 = factures19.map((res) => {
            return res.total_ht;
          });
          chiffAffHt19.forEach((element : any) => {
            this.chiffAffHT19 = this.chiffAffHT19 + element;
          });
          let chiffAffTtc19 = factures19.map((res) => {
            return res.total_ttc;
          });
          chiffAffTtc19.forEach((element : any) => {
            this.chiffAffTTC19 = this.chiffAffTTC19 + element;
          });



          let factures20= data.filter(elm => (new Date(elm.date_echeance).getFullYear()== this.dates[2]) && (elm.etat_facture=="payé"));
          let chiffAffHt20 = factures20.map((res) => {
            return res.total_ht;
          });
          chiffAffHt20.forEach((element : any) => {
            this.chiffAffHT20 = this.chiffAffHT20 + element;
          });
          let chiffAffTtc20 = factures20.map((res) => {
            return res.total_ttc;
          });
          chiffAffTtc20.forEach((element : any) => {
            this.chiffAffTTC20 = this.chiffAffTTC20 + element;
          });


          let factures21= data.filter(elm => (new Date(elm.date_echeance).getFullYear()== this.dates[3]) && (elm.etat_facture=="payé"));
          let chiffAffHt21= factures21.map((res) => {
            return res.total_ht;
          });
          chiffAffHt21.forEach((element : any) => {
            this.chiffAffHT21 = this.chiffAffHT21 + element;
          });
          let chiffAffTtc21 = factures21.map((res) => {
            return res.total_ttc;
          });
          chiffAffTtc21.forEach((element : any) => {
            this.chiffAffTTC21 = this.chiffAffTTC21 + element;
          });


          let factures22= data.filter(elm => (new Date(elm.date_echeance).getFullYear()== this.dates[4]) && (elm.etat_facture=="payé"));
          let chiffAffHt22 = factures22.map((res) => {
            return res.total_ht;
          });
          chiffAffHt22.forEach((element : any) => {
            this.chiffAffHT22 = this.chiffAffHT22 + element;
          });
          let chiffAffTtc22 = factures22.map((res) => {
            return res.total_ttc;
          });
          chiffAffTtc22.forEach((element : any) => {
            this.chiffAffTTC22 = this.chiffAffTTC22 + element;
          });


          this.initializeChartOptionsChiffAffYear()

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
        data: [this.chiffAffTTC18, this.chiffAffTTC19, this.chiffAffTTC20, this.chiffAffTTC21,this.chiffAffTTC22],
        color: "#fb9678",
      },
      {
        name: "Chiffre d'affaire HT",
        data: [this.chiffAffHT18, this.chiffAffHT19, this.chiffAffHT20, this.chiffAffHT21,this.chiffAffHT22],
        color: "#03c9d7",
      },
    ];
    
    this.xaxis = {
      categories: [this.dates[0],this.dates[1], this.dates[2], this.dates[3], this.dates[4]],
      
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
   console.log(this.clients.length);
   
   this.xaxisClt = {
     categories: this.clients,
     max: this.clients.length+1,
      min :  this.clients.length,
      range: this.clients.length,
      tickAmount: this.clients.length,
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
     color: "#fb9678",
   },
   {
     name: "Chiffre d'affaire HT",
     data: this.chiffAffHTArt,
     color: "#03c9d7",
   },
 ];
 
 this.xaxisArt = {
   categories:this.articles,
 };
 
 this.chartArt = {
   toolbar: {
     show: false,
   },
   type: 'bar',
   height: 300,
   
 };
 
 
 this.legendArt = {
   show: false,
 };
 
 this.tooltipClt = {
   theme: "dark"
 };
 
 this.gridArt = {
   show: false,
 };

 this.dataLabelsArt = {
   enabled: false,
 };

 this.strokeArt = {
   show: true,
   width: 5,
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
