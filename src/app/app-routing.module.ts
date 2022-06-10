import { Component, NgModule, SimpleChange } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardAdminComponent } from "./components/board-admin/board-admin.component";
import { AddUserComponent } from "./components/board-admin/add-user/add-user.component";
import { AlertsComponent } from "./components/alerts/alerts.component";
import { AddArticleComponent } from "./components/articles/add-article/add-article.component";
import { ArticlesComponent } from "./components/articles/articles.component";
import { ClientComponent } from "./components/client/client.component";
import { AddClientComponent } from "./components/client/add-client/add-client.component";
import { ButtonsComponent } from "./components/buttons/buttons.component";
import { ChipsComponent } from "./components/chips/chips.component";
import { ExpansionComponent } from "./components/expansion/expansion.component";
import { FormsComponent } from "./components/forms/forms.component";
import { GridListComponent } from "./components/grid-list/grid-list.component";
import { LoginComponent } from "./components/login/login.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ProgressSnipperComponent } from "./components/progress-snipper/progress-snipper.component";
import { ProgressComponent } from "./components/progress/progress.component";
import { SlideToggleComponent } from "./components/slide-toggle/slide-toggle.component";
import { SliderComponent } from "./components/slider/slider.component";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { TabsComponent } from "./components/tabs/tabs.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { TooltipsComponent } from "./components/tooltips/tooltips.component";
import { ProductComponent } from "./dashboard/dashboard-components/product/product.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FullComponent } from "./layouts/full/full.component";
import { SimpleComponent } from "./layouts/simple/simple.component";
import { AddAccountComponent } from "./components/society-accounts/add-account/add-account.component";
import { SocietyAccountsComponent } from "./components/society-accounts/society-accounts.component";
import { FacturesComponent } from "./components/factures/factures.component";
import { AddFactureComponent } from "./components/factures/add-facture/add-facture.component";
import { AddSocietyComponent } from "./components/societies/add-society/add-society.component";
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
      { path: "alerts", component: AlertsComponent },
      { path: "forms", component: FormsComponent },
      { path: "table", component: ProductComponent },
      { path: "grid-list", component: GridListComponent },
      { path: "menu", component: MenuComponent },
      { path: "tabs", component: TabsComponent },
      { path: "expansion", component: ExpansionComponent },
      { path: "chips", component: ChipsComponent },
      { path: "progress", component: ProgressComponent },
      { path: "toolbar", component: ToolbarComponent },
      { path: "progress-snipper", component: ProgressSnipperComponent },
      { path: "snackbar", component: SnackbarComponent },
      { path: "slider", component: SliderComponent },
      { path: "slide-toggle", component: SlideToggleComponent },
      { path: "tooltip", component: TooltipsComponent },
      { path: "button", component: ButtonsComponent },
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
        canActivate: [LoginGardGuard],
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
        path: "add-societe",
        component: AddSocietyComponent,
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
