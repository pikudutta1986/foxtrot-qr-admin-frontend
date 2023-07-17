import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  isSidebarToggled: any = '';

  constructor(
    private helperService: HelperService,
    private authService: AuthService,
    private router: Router) {         
  }

  ngOnInit() {

    this.getAllData();   
    
    // SIDEBAR TOGGLE CLICK ACTION
    this.helperService.isSidebarToggled.subscribe((x: any) => {
      if (x) {
        this.isSidebarToggled = 'g-sidenav-hidden';
      } else {
        this.isSidebarToggled = 'g-sidenav-pinned';
      }
    });

    this.helperService.error.subscribe((e:any) => {
      console.log(e.message)
      this.helperService.hideloader();
      this.helperService.snackPositionTopCenter(e.message)
    });

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationStart),
    ).subscribe((event: NavigationStart) => {
      this.checkAuthentication();
    });

  }

  getAllData() {
    if(this.helperService.access_token) {
      this.helperService.getAllUsers(); 
      this.helperService.setPlans();
      this.helperService.getAllPricings();
      this.helperService.getSiteSettings();
      this.helperService.getAllPayments();
    } else {
      setTimeout(() => {
        this.getAllData();        
      }, 800);
    }
    
  }

  ngOnChanges() {
    console.log(this.router.url)
  }  

  // get user details
  getUserDetails() {
    this.helperService.get('user').subscribe((res:any) => {
      if(res) {
        this.helperService.userName.next(res.email);
        localStorage.setItem ('user_id', res.id);
        localStorage.setItem ('user_name', res.email);
      }
    });    
  }

  checkAuthentication() {
    if(this.authService.isLoggedIn()) {
      console.log('true')
      // this.router.navigate(['dashboard/payments']);
    }
  }

}
