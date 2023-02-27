import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
 
  isPinned:boolean = false;

  constructor(    
    private helperService: HelperService,
    private router: Router) { }

  ngOnInit() {
    
  }
 
  ngAfterViewInit() {
    
  }

  // SIDEBAR TOGGLE
  sideNavbarToggle() {
    
    if(this.isPinned) {
      this.helperService.isSidebarToggled.next(false);      
    } else {
      this.helperService.isSidebarToggled.next(true);
    }

    this.isPinned = !this.isPinned;
    
  }

}
