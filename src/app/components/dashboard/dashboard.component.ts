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
    private router: Router) { }

  ngOnInit() {
    
    // SIDEBAR TOGGLE CLICK ACTION
    this.helperService.isSidebarToggled.subscribe((x: any) => {
      if (x) {
        this.isSidebarToggled = 'g-sidenav-hidden';
      } else {
        this.isSidebarToggled = 'g-sidenav-pinned';
      }
    })
  }

  ngOnChanges() {
    console.log(this.router.url)
  }

}
