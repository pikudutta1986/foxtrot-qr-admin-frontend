
// IMPORTING Injectable FROM ANGULAR CORE.
import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';
import {AuthService} from './auth.service';

// INJECTING TO THE APP PROVIDER SO THAT WE CAN USE IT THROUGHOUT THE APPLICATION.
@Injectable
({
  providedIn: 'root'
})

// DECLARING THE AuthGuard CLASS WITH EXPORT SO THAT WE CAN USE THIS CLASS IN OTHER FILES.
export class AuthGuard implements CanActivate
{
  // CLASS CONSTRUCTOR, THIS WILL BE THE FIRST FUNCTION TO BE EXECUTED WHEN THIS CLASS LOADS.
  // HERE WE WILL TELL ANGULAR TO INJECT A DEPENDENCY BY SPECIFYING A CONSTRUCTOR
  // PARAMETER WITH THE DEPENDENCY TYPE.
  constructor (private authService: AuthService, private router: Router){}

  // THIS FUNCTION IS THE ROUTE ACTIVATOR USED IN app.routing.module. IT WILL RETURN TRUE IF USER
  // IS LOGGED IN, ELSE, REDIRECT THE USER TO LOGIN PAGE.
  canActivate (route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean
  {
    const url: string = state.url;
    return this.checkLogin();
  }

  // THIS FUNCTION IS USED TO CHECK IF THE USER IS LOGGED IN OR NOT.
  // IF LOGGED IN, RETURN TRUE, ELSE, ROUTE THE USER TO LOGIN PAGE.
  private checkLogin() 
  {
    // IF THE USER IS LOGGED IN.
    if (this.authService.isLoggedIn()) 
    {
      return true;
    }

    // IF THE USER IS NOT LOGGED IN.
    else
    {
      this.router.navigate (['/']);
      return false;
    }
  }
}
