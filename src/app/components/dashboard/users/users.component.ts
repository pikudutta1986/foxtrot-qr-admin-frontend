import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HelperService } from 'src/app/service/helper.service';
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

  public registerForm: any = FormGroup;

  @ViewChild('email') email!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChild('closebutton') closebutton!: ElementRef<HTMLInputElement>;
  msgForModal:any = '';

  staticData: any = [
    {
      id: 1, name: 'x', email: 'x@x.com', created_at: '2023-02-23 09:32:52'
    },
    {
      id: 2, name: 'y', email: 'y@y.com', created_at: '2023-02-23 09:33:52'
    },
    {
      id: 3, name: 'z', email: 'z@z.com', created_at: '2023-02-23 09:34:52'
    },
    {
      id: 4, name: 'a', email: 'a@a.com', created_at: '2023-02-23 09:35:52'
    },
    {
      id: 5, name: 'b', email: 'b@b.com', created_at: '2023-02-23 09:36:52'
    }
  ];

  mainSrcData: any = [];

  srcData: any = '';

  selectedUserId: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    public cdr: ChangeDetectorRef,
    public helperService: HelperService) { }

  ngOnInit(): void {

    this.helperService.showloader();

    this.getUsers();

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.registerForm.get('email').valueChanges.subscribe((val: any) => {
      if (val) {
        if (this.helperService.validateEmail(val)) {
          this.email.nativeElement.classList.add('is-valid');
        }
        else {
          this.email.nativeElement.classList.remove('is-valid');
        }
      } else {
        this.email.nativeElement.classList.add('is-invalid');
      }
    });

    this.registerForm.get('password').valueChanges.subscribe((val: any) => {
      if (val.length >= 8) {
        this.password.nativeElement.classList.add('is-valid');
      } else {
        this.password.nativeElement.classList.remove('is-valid');
      }
    });
  }

  ngAfterViewInit() {
    // this.userFiles.paginator = this.paginator;
    // this.staticData.map((x:any) => {
    //   x.isEdit = false;
    // });

    // this.userFiles = new MatTableDataSource(this.staticData)
    // this.userFiles.paginator = this.paginator;
    // this.userFiles.sort = this.sort;
    // this.cdr.detectChanges();
  }

  getUsers() {
    
    this.helperService.get('auth/admin/users').subscribe((res: any) => {
      if (res.success) {
        this.srcData = res.users.data;
        this.mainSrcData = JSON.stringify(res.users.data);
        this.setData();
      }
      this.helperService.hideloader();
    });

  }

  setData() {
    this.userFiles = new MatTableDataSource(this.srcData)
    this.userFiles.paginator = this.paginator;
    this.userFiles.sort = this.sort;
  }

  addUser() {
    this.helperService.showloader();
    this.helperService.post('auth/admin/users',this.registerForm.value).subscribe((res: any) => {
      if(res.status) {
        this.classType = 'success';
        this.message = 'Successfully created';
        this.registerForm.reset();
        let el: HTMLElement = this.closebutton.nativeElement as HTMLElement;
        el.click(); 
        this.getUsers();
      } else {
        this.helperService.hideloader();
      }
    },
    //Error callback
    (error) => {                              
      console.error('error caught in component')
      this.msgForModal = 'something went wrong'
      this.classType = 'red';
      this.helperService.hideloader();
    }
    );
      
  }

  editUser(element: any) {
    element.isEdit = true;
    this.selectedUserId = element.id;
    console.log(element, 'e')
  }

  deleteUser(element: any) {
    let url = `auth/admin/users/${element.id}`;
    this.helperService.delete(url).subscribe((res:any) => {
      if(res.status) {
        this.classType = 'danger';
        this.message = 'Successfully deleted';
        this.getUsers();
        // this.helperService.hideloader();
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

  saveUser(element: any) {
    this.helperService.showloader();
    element.isEdit = false;   
    let url = `auth/admin/users/${element.id}`;
    let data = {
      id: element.id,
      email: element.email,
      // _method: 'PATCH'
    }
    this.helperService.patch(url,data).subscribe((res:any) => {
      if(res.status) {
        this.classType = 'success';
        this.message = 'Successfully updated';
        this.getUsers();
        // this.helperService.hideloader();
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

  applyFilter(filterValue: any) {
    filterValue = filterValue.value;
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

}
