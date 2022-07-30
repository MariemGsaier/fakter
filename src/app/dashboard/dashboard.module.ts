import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoFlexyModule } from '../demo-flexy-module'
import { DashboardComponent } from './dashboard.component';
import { SalesComponent } from './dashboard-components/sales/sales.component';
import { FacturesDashComponent } from './dashboard-components/factures-dash/factures-dash.component';
import { IndicateursClefComponent } from './dashboard-components/indicateurs-clef/indicateurs-clef.component';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';




@NgModule({
  declarations: [
    DashboardComponent,
    SalesComponent,
    FacturesDashComponent,
    IndicateursClefComponent,
  ],
  imports: [
    CommonModule,
    DemoFlexyModule,
    FormsModule,
    NgApexchartsModule
  ],
  exports: [
    DashboardComponent,
    SalesComponent,
    FacturesDashComponent,
  ]
})
export class DashboardModule { }
