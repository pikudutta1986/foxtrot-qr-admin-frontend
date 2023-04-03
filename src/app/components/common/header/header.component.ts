import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
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

  authenticated:boolean = false;

  constructor(
    private helperService: HelperService,
    private authService: AuthService,
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
    // let auth_token: any = sessionStorage.getItem('admin_token');
    // auth_token = JSON.parse(auth_token);

    let token: any = sessionStorage.getItem('admin_token');
    if(token) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    this.authService.isLogged.subscribe((res:any) => {
      if(res) {
        this.authenticated = res;
      } else {
        this.authenticated = res;
      }
    });
  }

  ngAfterViewInit() {

  }

  logout() {  
    this.helperService.showloader();
    this.authService.logout().subscribe((res:any) => {      
      if(res.status) {
        this.helperService.hideloader();
        sessionStorage.clear();
        this.router.navigate((['/']))
      }
    },
    //Error callback
    (error) => {                              
      console.error('error caught in component')
      alert('Something went wrong..');
      this.helperService.hideloader();
    }
    );
    
  }

  ngOnDestroy(): void {
    this.routerEvents.unsubscribe();
  }
  
}
