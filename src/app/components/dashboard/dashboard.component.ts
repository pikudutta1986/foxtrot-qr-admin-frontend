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
      this.getAllplans();
      this.getAllPricings();
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

    // this.getUserDetails();
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

  // get all plans
  getAllplans() {
    let params = 'auth/admin/plans';
    this.helperService.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.helperService.allPlans = res.plans;    
        } else {         
          this.helperService.allPlans = []; 
        }
      },
      (err: any) => {
        console.log(err);
    });    
  }

  // get all pricings
  getAllPricings() {
    let params = 'auth/admin/pricings ';
    this.helperService.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.helperService.allPricings = res.pricings;           
        } else {
          this.helperService.allPricings = [];
        }
      },
      (err: any) => {
        console.log(err);
    });

  }


}
