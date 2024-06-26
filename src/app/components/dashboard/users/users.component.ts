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
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;
declare var saveAs: any;
declare var XLSX:any;

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

  displayedColumns: string[] = ['position', 'email', 'plans', 'current_plan_expiry_day', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('closebutton') closebutton!: ElementRef<HTMLInputElement>;
  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef<HTMLInputElement>;


  msgForModal: any = '';

  mainSrcData: any = [];

  srcData: any = '';

  selectedUserId: any = '';

  platforms: any = [
    {
      id: 'web',
      text: 'Web'
    },
    {
      id: 'android',
      text: 'Android'
    },
    {
      id: 'ios',
      text: 'iOS'
    },
  ];

  showmOdal: boolean = false;
  links: any;
  range: any;
  plans: any = [];
  total: any = '';

  searchInputText: any = '';
  planId: any = '';
  from_date: any = '';
  to_date: any = '';
  keyupTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private _snackBar: MatSnackBar,
    public helperService: HelperService) { }

  ngOnInit(): void {
    this.helperService.showloader();   
  }

  ngAfterViewInit() {
    this.getPlans();
    this.getUsers();
    this.cdr.detectChanges();
  }

  // get all plans
  getPlans() {
    if (this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      this.plans = this.helperService.allPlans;
      let selectedPlan = this.plans[0].id;
    } else {
      setTimeout(() => {
        this.getPlans();
      }, 1000);
    }
  }

  // get users
  getUsers() {
    if (this.helperService.allUsers && this.helperService.allUsers.data && this.helperService.allUsers.data.length > 0) {
      this.setPagination(this.helperService.allUsers);
    } else {
      setTimeout(() => {
        this.getUsers();
      }, 1000);
    }

  }

  // edit user
  editUser(element: any) {
    localStorage.setItem('currentEditedUser', JSON.stringify(element));
    this.router.navigate(['dashboard/users/edit', element.id]);
  }

  // delete user
  deleteUser(element: any) {
    this.helperService.scrollToTop();
    this.helperService.showloader();
    let url = `auth/admin/users/${element.id}`;
    this.helperService.delete(url).subscribe((res: any) => {
      if (res.status) {
        this.helperService.snackPositionTopCenter(res.message);
        this.helperService.allUsers = [];
        this.helperService.getAllUsers();
        setTimeout(() => {
          this.getUsers();
        }, 1000);
      } else {
        this.helperService.snackPositionTopCenter('Something went wrong');
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

  gotoPage(page: any) {
    if (page.url) {
      this.helperService.scrollToTop();
      setTimeout(() => {
        this.helperService.showloader();
        this.helperService.rawGet(page.url).subscribe((res: any) => {
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

  setPagination(links: any) {
    let srcData = links.data;
    let i = 0;
    if(links.current_page > 1) {
      i = (links.current_page - 1) * links.per_page;
    }
    srcData.map((x:any) => {
      i++;
      x.sno = i;
      x.plans = x.plan.name;
    });
    
    this.srcData = srcData;
    this.total = links.total;
    this.userFiles = new MatTableDataSource(this.srcData)
    this.userFiles.sort = this.sort;

    let srclinks = links.links;

    if (srclinks.length > 0) {
      srclinks.map((l: any) => {
        let text = l.label;
        let laquo = text.includes("&laquo;");
        if (laquo) {
          l.label = text.replace('&laquo;', '');
        }
        let raquo = text.includes("&raquo;");
        if (raquo) {
          l.label = text.replace('&raquo;', '');
        }
      });

      this.links = srclinks;
    }

    this.helperService.hideloader();

  }

  filter(download?: any) {
    let param = '';

    if (this.searchInputText) {
      param = `search=${this.searchInputText}`;
    }

    if (this.planId) {
      if (param && param.length > 0) {
        param = `${param}&plan=${this.planId}`;
      } else {
        param = `${param}plan=${this.planId}`;
      }
    }

    if (this.from_date) {
      if (param && param.length > 0) {
        param = `${param}&from_date=${this.from_date}`;
      } else {
        param = `${param}from_date=${this.from_date}`;
      }
    }

    if (this.to_date) {
      if (param && param.length > 0) {
        param = `${param}&to_date=${this.to_date}`;
      } else {
        param = `${param}to_date=${this.to_date}`;
      }
    }

    if (download) {
      if (param && param.length > 0) {
        param = `${param}&download=1`;
      } else {
        param = `${param}download=1`;
      }
    }
    // console.log(param)

    clearTimeout(this.keyupTimer);
    this.keyupTimer = setTimeout(() => {
      this.getFilterData(param);
    }, 1800);


  }
  
  // get filter data
  getFilterData(p: any) {
    this.helperService.showloader();
    let params = 'auth/admin/users';
    let s = `${params}?${p}`
    this.helperService.get(s).subscribe(
      async (res: any) => {
        if (res.success) {          
          if(p.includes ('download')) {
            let url = `${this.helperService.mediaUrl}${res.users}`;
            let cDate = new Date().toISOString().slice(0, 10);
            const result = await fetch(url);
            const file = await result.blob()
            const fileUrl = URL.createObjectURL(file);
            const filename = `Report - ${cDate}.xlsx`;
            downloadURI(fileUrl,filename);
          } else {
            this.setPagination(res.users);
          }          
          this.helperService.hideloader();
        }
      },
      (e: any) => {
        console.log(e);
    });
  }

  exportToExcel(val:any) {
    let result = JSON.parse(val);
    let i = 0;
    result.map((x:any) => {
      i = i+1;
      // x.Serial = i;
      delete x.id;
      delete x.deleted_at;
      delete x.plan;
      x.plan = x.plans;
      delete x.plans;
      x.updated_at = new DatePipe('en-US').transform(x.updated_at, 'MMM d, y, h:mm:ss a');
      x.created_at = new DatePipe('en-US').transform(x.created_at, 'MMM d, y, h:mm:ss a');
      x.email_verified_at = new DatePipe('en-US').transform(x.email_verified_at, 'MMM d, y, h:mm:ss a');

    });
    var myJsonString = JSON.stringify(result);   
    var jsonDataObject = eval(myJsonString);		
		exportWorksheet(jsonDataObject);  
  };

}

function exportWorksheet(jsonObject:any) {
  var myFile = "report.xlsx";
  var myWorkSheet = XLSX.utils.json_to_sheet(jsonObject);
  var myWorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "myWorkSheet");
  XLSX.writeFile(myWorkBook, myFile);
}

function downloadURI(uri:any, name?:any) {
  var link = document.createElement("a");
  link.setAttribute('download', name);
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
}



