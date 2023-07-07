import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HelperService } from 'src/app/service/helper.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent {

  message = '';
  classType: any = '';
  userFiles: any = [];

  matcher = new ErrorStateMatcher();

  displayedColumns: string[] = ['position', 'email', 'created_at', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('closebutton') closebutton!: ElementRef<HTMLInputElement>;
  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef<HTMLInputElement>;
  

  msgForModal: any = '';

  mainSrcData: any = [];

  srcData: any = '';

  selectedUserId: any = '';

  platforms:any = [
    {
      id:'web',
      text: 'Web'
    },
    {
      id:'android',
      text: 'Android'
    },
    {
      id:'ios',
      text: 'iOS'
    },
  ];

  showmOdal:boolean = false;
  links:any;
  range: any;
  plans:any = [];

  constructor(
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    public cdr: ChangeDetectorRef,
    private router: Router,
    public helperService: HelperService) { }

  ngOnInit(): void {

    this.helperService.showloader();
    this.getPlans();
    // this.refreshAllUser();

    this.helperService.searchInput.subscribe((res:any) => {
      this.applyFilter(res);
    });

    this.range = this.formBuilder.group({
      searchInputText: "",
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
      plan_id: ""
    });

    this.range.get('searchInputText').valueChanges.subscribe((val: any) => {
      // this.applyFilterOn();
    });

  }

  ngAfterViewInit() {
    this.refreshAllUser();
    this.cdr.detectChanges();
  }
  
  // edit user
  editUser(element: any) {
    localStorage.setItem('currentEditedUser', JSON.stringify(element));
    this.router.navigate(['dashboard/users/edit', element.id]);
  }

  // delete user
  deleteUser(element: any) {
    this.helperService.showloader();
    let url = `auth/admin/users/${element.id}`;
    this.helperService.delete(url).subscribe((res: any) => {
      if (res.status) {
        this.classType = 'danger';
        this.message = 'Successfully deleted';
        this.refreshAllUser();
      } else {
        this.classType = 'danger';
        this.message = 'Something went wrong';
        this.helperService.hideloader();
      }

    },
      //Error callback
      (error) => {
        console.error('error caught in component')
        this.message = 'something went wrong'
        this.classType = 'danger';
        this.helperService.hideloader();
      })
  }

  // cancel editing
  cancelUser(element: any) {

    let mainArr = JSON.parse(this.mainSrcData);
    let result = mainArr.find((x: any) => {
      return x.id == element.id;
    });

    element.email = result.email;

    element.isEdit = false;
    this.classType = '';
    this.message = '';
  }

  // filter for all column
  applyFilter(filterValue: any) {
    // filterValue = filterValue.value;
    this.userFiles.filter = filterValue.trim().toLowerCase();
    if (this.userFiles.paginator) {
      this.userFiles.paginator.firstPage();
    }
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // refresh all userlist
  refreshAllUser() {
    this.helperService.get('auth/admin/users').subscribe((res: any) => {
      if (res.success) {
        this.helperService.allUsers = res.users.data;
        this.setPagination(res.users);
      }
      this.helperService.hideloader();
    },
    (e:any) => {
      this.helperService.hideloader();
    });
  }

  gotoPage(page:any) {   
    if(page.url) {      
      this.helperService.scrollToTop();           
      setTimeout(() => {        
        this.helperService.showloader();
        this.helperService.rawGet(page.url).subscribe((res:any) => {
          if (res.success) {
            this.setPagination(res.users);         
          } else {
            this.srcData = [];
          }
          this.helperService.hideloader();
        })           
      }, 500);                      
    }   
  }

  setPagination(links:any) {
    
    this.srcData = links.data; 
    
    this.userFiles = new MatTableDataSource(this.srcData)
    this.userFiles.sort = this.sort;             
    
    let srclinks = links.links;
    
    if(srclinks.length > 0) {
      srclinks.map((l:any) => {
        let text = l.label;
        let laquo = text.includes("&laquo;");
        if(laquo) {
          l.label = text.replace('&laquo;','');
        }
        let raquo = text.includes("&raquo;");
        if(raquo) {
          l.label = text.replace('&raquo;','');
        }
      });

      this.links = srclinks;
    }

    this.helperService.hideloader();
       
  }  

  // on date change
  addEvent(e: any) {
    let val = this.range.value;
    if ((val.start && val.end) && (val.start != null && val.end != null)) {
      console.log(val)

      var startTime = new Date(val.start).getTime() / 1000;
      var endTime = new Date(val.end).getTime() / 1000;

      if (startTime > endTime) {
        console.log('start time should be less than end time')
      } else {
        // this.applyFilterOn();
      }
    }
  }

  getPlans() {
    if(this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      this.plans = this.helperService.allPlans;     
      let selectedPlan = this.plans[0].id;
    } else {
      setTimeout(() => {
        this.getPlans();        
      }, 1000);
    }
  }

  export() {
    console.log('export')
  }

}
