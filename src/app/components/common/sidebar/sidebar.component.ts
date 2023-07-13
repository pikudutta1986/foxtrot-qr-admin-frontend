import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  userName:any = '';
  isPinned: boolean = false;

  constructor(   
    private authService: AuthService,
    private helperService: HelperService,
    private router: Router) {      
      this.userName = localStorage.getItem('user_name');
  }

  ngOnInit() {

    this.helperService.userName.subscribe((res:any) => {
      this.userName = res;
    });
    
  }

  logout() {  
    this.helperService.showloader();
    this.authService.logout().subscribe((res:any) => {      
      if(res.status) {
        this.helperService.hideloader();
        localStorage.clear();
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

  // SIDEBAR TOGGLE
  sideNavbarToggle() {
    this.helperService.isSidebarToggled.next(true);
  }
}
