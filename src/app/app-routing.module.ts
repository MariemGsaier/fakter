import { Component, NgModule, SimpleChange } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardAdminComponent } from "./components/board-admin/board-admin.component";
import { AddUserComponent } from "./components/board-admin/add-user/add-user.component";
import { AddArticleComponent } from "./components/articles/add-article/add-article.component";
import { ArticlesComponent } from "./components/articles/articles.component";
import { ClientComponent } from "./components/client/client.component";
import { AddClientComponent } from "./components/client/add-client/add-client.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { FacturesDashComponent } from "./dashboard/dashboard-components/factures-dash/factures-dash.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FullComponent } from "./layouts/full/full.component";
import { SimpleComponent } from "./layouts/simple/simple.component";
import { AddAccountComponent } from "./components/society-accounts/add-account/add-account.component";
import { SocietyAccountsComponent } from "./components/society-accounts/society-accounts.component";
import { FacturesComponent } from "./components/factures/factures.component";
import { AddFactureComponent } from "./components/factures/add-facture/add-facture.component";
import { SocietiesComponent } from "./components/societies/societies.component";
import { DevisesComponent } from "./components/devises/devises.component";
import { AddDeviseComponent } from "./components/devises/add-devise/add-devise.component";
import { ChangePwComponent } from "./components/board-admin/change-pw/change-pw.component";
import { ForgotpasswordComponent } from "./components/login/forgotpassword/forgotpassword.component";
import { PrintFactureComponent } from "./components/factures/print-facture/print-facture.component";
import { AddDatedevisesComponent } from "./components/devises/add-datedevises/add-datedevises.component";
import { ChangeForgotpwComponent } from "./components/login/change-forgotpw/change-forgotpw.component";
import { AddDateComponent } from "./components/devises/add-date/add-date.component";
import { AddPrixarticleComponent } from "./components/articles/add-prixarticle/add-prixarticle.component";
import { AddPrixComponent } from "./components/articles/add-prix/add-prix.component";
import { HistoriqueDevisesComponent } from "./components/devises/historique-devises/historique-devises.component";
import { LoginGardGuard } from "./gard/login-gard.guard";
import { AdminGuard } from "./gard/admin.guard";
import { PaidFactureComponent } from "./components/factures/paid-facture/paid-facture.component";
import { ArchiveFactureComponent } from "./components/factures/archive-facture/archive-facture.component";
import { ArchiveArticlesComponent } from "./components/articles/archive-articles/archive-articles.component";
import { ArchiveClientsComponent } from "./components/client/archive-clients/archive-clients.component";
import { ArchiveDevisesComponent } from "./components/devises/archive-devises/archive-devises.component";
import { ArchiveAccountsComponent } from "./components/society-accounts/archive-accounts/archive-accounts.component";
import { ArchiveUsersComponent } from "./components/board-admin/archive-users/archive-users.component";
import { HistoriqueArticlesComponent } from "./components/articles/historique-articles/historique-articles.component";
import { FactureGuard } from "./gard/facture.guard";

const routes: Routes = [
  {
    path: "",
    component: SimpleComponent,
    children: [
      { path: "", redirectTo: "/login", pathMatch: "full" },
      { path: "login", component: LoginComponent },
      { path: "change-pw", component: ChangePwComponent },
      { path: "change-forgotpw", component: ChangeForgotpwComponent },
      { path: "forgot-pw", component: ForgotpasswordComponent },
    ],
  },
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [LoginGardGuard],
      },
      { path: "table", component: FacturesDashComponent },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "admin",
        component: BoardAdminComponent,
        canActivate: [LoginGardGuard, AdminGuard],
      },
      {
        path: "add-user",
        component: AddUserComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "articles",
        component: ArticlesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-article",
        component: AddArticleComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "clients",
        component: ClientComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-client",
        component: AddClientComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-account",
        component: AddAccountComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "bankaccounts",
        component: SocietyAccountsComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "factures",
        component: FacturesComponent,
        canActivate: [LoginGardGuard, FactureGuard],
      },
      {
        path: "add-facture",
        component: AddFactureComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "societe",
        component: SocietiesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "print-facture",
        component: PrintFactureComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "devises",
        component: DevisesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-devise",
        component: AddDeviseComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-datedevise",
        component: AddDatedevisesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-date",
        component: AddDateComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-prixarticle",
        component: AddPrixarticleComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "add-prix",
        component: AddPrixComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "historique-devises",
        component: HistoriqueDevisesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "facture-payée",
        component: PaidFactureComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "archive-factures",
        component: ArchiveFactureComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "archive-articles",
        component: ArchiveArticlesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "archive-clients",
        component: ArchiveClientsComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "archive-devises",
        component: ArchiveDevisesComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "archive-accounts",
        component: ArchiveAccountsComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "archive-users",
        component: ArchiveUsersComponent,
        canActivate: [LoginGardGuard],
      },
      {
        path: "historique-articles",
        component: HistoriqueArticlesComponent,
        canActivate: [LoginGardGuard],
      },
    ],
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
