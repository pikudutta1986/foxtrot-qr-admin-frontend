import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent {

  displayedColumns: string[] = ['position', 'name', 'descriptions', 'number_of_codes', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  message = '';
  classType: any = '';
  userPlans: any = [];

  plans: any = '';

  selectedUserId: any = '';

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {    
    this.helperService.showloader();
    this.helperService.searchInput.subscribe((res: any) => {
      this.applyFilter(res);
    });
  }

  ngAfterViewInit() {
    this.getPlans();
    this.cdr.detectChanges();
  }

  // ALL PLANS  
  getPlans() {
    if(this.helperService.allPlans && this.helperService.allPlans.length > 0 ) {
      this.plans = this.helperService.allPlans;
      this.setData();
    } else {
      setTimeout(() => {
        this.getPlans();
      }, 1000);
    }
  }

  // set data
  setData() {    
    this.userPlans = new MatTableDataSource(this.plans)
    this.userPlans.paginator = this.paginator;
    this.userPlans.sort = this.sort;
    this.helperService.hideloader();
  }

  // filter
  applyFilter(filterValue: any) {
    // filterValue = filterValue.value;
    this.userPlans.filter = filterValue.trim().toLowerCase();
    if (this.userPlans.paginator) {
      this.userPlans.paginator.firstPage();
    }
  }

  // edit
  editPlan(element: any) {
    localStorage.setItem('currentPlan', JSON.stringify(element));
    this.router.navigate(['dashboard/plans/edit', element.id]);
  }

  // create
  createPlan() {
    this.router.navigate(['dashboard/plans/create-plan']);
  }

  // delete
  deletePlan(element: any) {
    this.helperService.scrollToTop();
    this.helperService.showloader();
    let url = `auth/admin/plans/${element.id}`;
    this.helperService.delete(url).subscribe(
      (res: any) => {        
        if (res.status) {
          this.helperService.allPlans = [];
          this.helperService.setPlans();
          setTimeout(() => {
            this.getPlans();
            this.helperService.hideloader();            
          }, 1000);
          this.helperService.snackPositionTopCenter(res.message);
        } else {
          this.helperService.snackPositionTopCenter(res.message);
        }
      },
      (errors: any) => {
        console.log(errors);
        this.helperService.hideloader();
      },
    )
  }

}
