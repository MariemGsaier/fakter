import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AngularIbanModule } from 'angular-iban';
import { FileUploadModule } from "ng2-file-upload";
import {NgxMatIntlTelInputModule} from "ngx-mat-intl-tel-input";
import {Ng2TelInputModule} from 'ng2-tel-input';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullComponent } from './layouts/full/full.component';
import { DemoFlexyModule } from './demo-flexy-module'

// Modules
import { DashboardModule } from './dashboard/dashboard.module';
import { ComponentsModule } from './components/components.module';
import { SimpleComponent } from './layouts/simple/simple.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { authInterceptorProviders } from 'src/helpers/auth.interceptor';
import { SearchUser } from './pipes/search-user.pipe';



@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    SimpleComponent,
    BoardAdminComponent,
    SearchUser
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    DashboardModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule ,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    AngularIbanModule,
    FileUploadModule,
    NgxMatIntlTelInputModule,
    Ng2TelInputModule
  
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }