import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { DemoFlexyModule } from '../demo-flexy-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { AddUserComponent } from './board-admin/add-user/add-user.component';
import { MatCardModule } from '@angular/material/card';
import { ArticlesComponent } from './articles/articles.component';
import { AddArticleComponent } from './articles/add-article/add-article.component';
import { ClientComponent } from './client/client.component';
import { AddClientComponent } from './client/add-client/add-client.component';
import { SocietyAccountsComponent } from './society-accounts/society-accounts.component';
import { AddAccountComponent } from './society-accounts/add-account/add-account.component';
import { SocietiesComponent } from './societies/societies.component';
import { FacturesComponent } from './factures/factures.component';
import { AddFactureComponent } from './factures/add-facture/add-facture.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { DevisesComponent } from './devises/devises.component';
import { AddDeviseComponent } from './devises/add-devise/add-devise.component';
import { DialogBoxComponent } from './factures/dialog-box/dialog-box.component';
import { ChangePwComponent } from './board-admin/change-pw/change-pw.component';
import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { ChangeForgotpwComponent } from './login/change-forgotpw/change-forgotpw.component';
import { PrintFactureComponent } from './factures/print-facture/print-facture.component';
import { AddDatedevisesComponent } from './devises/add-datedevises/add-datedevises.component';
import { AddDateComponent } from './devises/add-date/add-date.component';
import { AddPrixarticleComponent } from './articles/add-prixarticle/add-prixarticle.component';
import { AddPrixComponent } from './articles/add-prix/add-prix.component';
import { HistoriqueDevisesComponent } from './devises/historique-devises/historique-devises.component';
import { PaidFactureComponent } from './factures/paid-facture/paid-facture.component';
import { ArchiveFactureComponent } from './factures/archive-facture/archive-facture.component';
import { ArchiveArticlesComponent } from './articles/archive-articles/archive-articles.component';
import { ArchiveClientsComponent } from './client/archive-clients/archive-clients.component';
import { ArchiveDevisesComponent } from './devises/archive-devises/archive-devises.component';
import { ArchiveAccountsComponent } from './society-accounts/archive-accounts/archive-accounts.component';
import { ArchiveUsersComponent } from './board-admin/archive-users/archive-users.component';
import { HistoriqueArticlesComponent } from './articles/historique-articles/historique-articles.component';








@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    AddUserComponent,
    ArticlesComponent,
    AddArticleComponent,
    ClientComponent,
    AddClientComponent,
    AddArticleComponent,
    SocietyAccountsComponent,
    AddAccountComponent,
    SocietiesComponent,
    FacturesComponent,
    AddFactureComponent,
    BoardAdminComponent,
    DevisesComponent,
    AddDeviseComponent,
    DialogBoxComponent,
    ChangePwComponent,
    ForgotpasswordComponent,
    ChangeForgotpwComponent,
    PrintFactureComponent,
    AddDatedevisesComponent,
    AddDateComponent,
    AddPrixarticleComponent,
    AddPrixComponent,
    HistoriqueDevisesComponent,
    PaidFactureComponent,
    ArchiveFactureComponent,
    ArchiveArticlesComponent,
    ArchiveClientsComponent,
    ArchiveDevisesComponent,
    ArchiveAccountsComponent,
    ArchiveUsersComponent,
    HistoriqueArticlesComponent,
 

  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    Ng2TelInputModule
  ],
  exports: [
    MatCardModule,
    CommonModule,
  
  ]
})
export class ComponentsModule { }
