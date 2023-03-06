import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isPinned: boolean = false;
  currentRoute: any = '';
  routerEvents: any;

  constructor(
    private helperService: HelperService,
    private router: Router
  ) {
    this.currentRoute = this.router.url.substring(1);
    this.routerEvents = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        let currentUrl = event.url;
        let result = currentUrl.substring(1);
        // let parts = currentRoute.split("/");
        // let result = parts[parts.length - 1];
        this.currentRoute = result.charAt(0).toUpperCase() + result.slice(1);
      }
    });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  // SIDEBAR TOGGLE
  sideNavbarToggleForMobile() {
    this.helperService.isSidebarToggled.next(false);   
  }

  sideNavbarToggle() {
    if (this.isPinned) {
      this.helperService.isSidebarToggled.next(false);
    } else {
      this.helperService.isSidebarToggled.next(true);
    }
    this.isPinned = !this.isPinned;
  }

  ngOnDestroy(): void {
    this.routerEvents.unsubscribe();
  }
  
}
