import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Foxtrot Admin';
  currentRoute: string;

  constructor( private router: Router,
    @Inject(DOCUMENT) private document: any) {
    this.currentRoute = "";
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        this.currentRoute = event.url.slice(1);
        const body =  document.querySelector('body');
        body.className = '';
        
        body.classList.add('mat-typography');
        
        if(this.currentRoute == '') {
          body.classList.add('home');
        } else {
          body.classList.add(this.currentRoute);
        }

      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar

        // Present error to user
        console.log(event.error);
      }
    });
  }

 
}
