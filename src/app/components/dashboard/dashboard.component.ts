import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router) {
      this.helperService.getAllUsers(); 
      this.helperService.setPlans();
      this.helperService.getAllPricings();
      this.helperService.getSiteSettings();
  }

  ngOnInit() {
    
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

  }

  ngOnChanges() {
    console.log(this.router.url)
  }  

  // get user details
  getUserDetails() {

    this.helperService.get('user').subscribe((res:any) => {
      if(res) {
        this.helperService.userName.next(res.email);
        sessionStorage.setItem ('user_id', res.id);
        sessionStorage.setItem ('user_name', res.email);
      }
    });    
  }

}
