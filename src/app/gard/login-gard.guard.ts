import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
const USER_KEY = "auth-user";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: "root",
})
export class LoginGardGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    } else {
      Swal.fire({
        title: "Attention !",
        text: "Vous devez vous-connecter.",
        icon: "error",
        confirmButtonColor: "#e46a76",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["./login"]);
        }
      })
      return false;
    }
  }
}
