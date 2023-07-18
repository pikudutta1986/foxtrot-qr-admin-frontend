
// IMPORTING Injectable FROM ANGULAR CORE.
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

// INJECTING TO THE APP PROVIDER SO THAT WE CAN USE IT THROUGHOUT THE APPLICATION.
@Injectable
  ({
    providedIn: 'root'
  })

// DECLARING THE AuthGuard CLASS WITH EXPORT SO THAT WE CAN USE THIS CLASS IN OTHER FILES.
export class AuthGuard implements CanActivate {
  // CLASS CONSTRUCTOR, THIS WILL BE THE FIRST FUNCTION TO BE EXECUTED WHEN THIS CLASS LOADS.
  // HERE WE WILL TELL ANGULAR TO INJECT A DEPENDENCY BY SPECIFYING A CONSTRUCTOR
  // PARAMETER WITH THE DEPENDENCY TYPE.
  constructor(private authService: AuthService, private router: Router) { }

  // THIS FUNCTION IS THE ROUTE ACTIVATOR USED IN app.routing.module. IT WILL RETURN TRUE IF USER
  // IS LOGGED IN, ELSE, REDIRECT THE USER TO LOGIN PAGE.
  // canActivate (route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean
  // {
  //   const url: string = state.url;
  //   return this.checkLogin();
  // }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('canActivate on '+next.url);      
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate (['/']);
      return false;
    }
  }

}
