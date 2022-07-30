import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FactureGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = this.tokenService.getUser();
      if (user.role === "Super Administrateur" || user.role === "Administrateur") {
        return true;
      } else {
        Swal.fire({
          title: "Attention !",
          text: "Vous n\'avez pas le droit d\'accès à cette page.",
          icon: "error",
          confirmButtonColor: "#e46a76",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(["./dashboard"]);
          }
        })
        return false;
      }
  }
  
}
