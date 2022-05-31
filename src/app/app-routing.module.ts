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




const routes: Routes = [
  {
    path: "",
    component: SimpleComponent,
    children: [
      { path: "", redirectTo: "/login", pathMatch: "full" },
      { path: "login", component: LoginComponent },
      { path: "change-pw", component: ChangePwComponent },
      { path: "forgot-pw", component: ForgotpasswordComponent },

    ],
  },
  {
    path: "",
    component: FullComponent,
    children: [
      { path: "", redirectTo: "/dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
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
      { path: "profile", component: ProfileComponent },
      { path: "admin", component: BoardAdminComponent },
      { path: "add-user", component: AddUserComponent },
      { path: "articles", component: ArticlesComponent },
      { path: "add-article", component: AddArticleComponent },
      { path: "clients", component: ClientComponent },
      { path: "add-client", component: AddClientComponent },
      { path: "add-account", component: AddAccountComponent },
      { path: "bankaccounts", component: SocietyAccountsComponent },
      { path: "factures", component: FacturesComponent },
      {path: "add-facture", component: AddFactureComponent},
      { path: "societe", component: SocietiesComponent },
      { path: "add-societe", component: AddSocietyComponent },
      {path : "print-facture", component: PrintFactureComponent }
      { path: "devises", component: DevisesComponent },
      { path: "add-devise", component: AddDeviseComponent },

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
