import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { Router } from "@angular/router";

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

interface alerts {
  border: string;
  background: string;
  color: string;
  icon: string;
  iconColor: string;
  message: string;
}

@Component({
  selector: "app-full",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
})
export class FullComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  username?: string;

  search: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private breakpointObserver: BreakpointObserver
  ) {}

  routerActive: string = "activelink";

  sidebarMenu: sidebarMenu[] = [
    {
      link: "/dashboard",
      icon: "dashboard",
      menu: "Dashboard",
    },
    {
      link: "/articles",
      icon: "article",
      menu: "Articles",
    },
    {
      link: "/clients",
      icon: "people",
      menu: "Clients",
      
    },
    {
      link: "/societe",
      icon: "business",
      menu: "Société",
      
    },
    {
      link: "/factures",
      icon: "file_copy",
      menu: "Factures",
      
    },
    {
      link: "/commandes",
      icon: "card_giftcard",
      menu: "Commandes",
      
    },
    
  ];

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showAdminBoard = this.roles.includes("admin");
      this.username = user.username;
    }
  }

  alerts: alerts[] = [
    {
      border: "alert-border-warning",
      background: "alert-warning",
      color: "alert-text-warning",
      icon: "alert-triangle",
      iconColor: "text-warning",
      message: "Vous n'êtes pas authentifié ! veuillez vous-connectez.",
    },
  ];

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }
}
