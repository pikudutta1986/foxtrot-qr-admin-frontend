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
  public updateForm: any = FormGroup;

  @ViewChild('closebutton') closebutton!: ElementRef<HTMLInputElement>;
  @ViewChild('closeUpdateModal') closeUpdateModal!: ElementRef<HTMLInputElement>;
  

  msgForModal: any = '';

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

    this.updateForm = this.formBuilder.group({
      device_id: [''],
      platform: [''],
      country_code: [''],
    });

  }

  ngAfterViewInit() {

  }

  // get users
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

  // set data 
  setData() {
    this.userFiles = new MatTableDataSource(this.srcData)
    this.userFiles.paginator = this.paginator;
    this.userFiles.sort = this.sort;
  }

  // add new user
  addUser() {
    this.helperService.showloader();
    this.helperService.post('auth/admin/users', this.registerForm.value).subscribe((res: any) => {
      if (res.status) {
        this.classType = 'success';
        this.message = 'Successfully created';
        this.msgForModal = '';
        this.registerForm.reset();
        let el: HTMLElement = this.closebutton.nativeElement as HTMLElement;
        el.click();
        this.getUsers();
      } else {
        if (res.errors) {
          this.msgForModal = res.errors.email[0];
          this.classType = 'red';
        }
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

  // edit user
  editUser(element: any) {
    element.isEdit = true;
    this.selectedUserId = element.id;
    this.updateForm.controls.device_id.setValue(element.id);
    this.updateForm.controls.platform.setValue(element.platform);
    this.updateForm.controls.country_code.setValue(element.country_code);
  }

  // delete user
  deleteUser(element: any) {
    this.helperService.showloader();
    let url = `auth/admin/users/${element.id}`;
    this.helperService.delete(url).subscribe((res: any) => {
      if (res.status) {
        this.classType = 'danger';
        this.message = 'Successfully deleted';
        this.getUsers();
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

  // update user
  saveUser() {

    this.helperService.showloader();
    let url = `auth/admin/users/${this.selectedUserId}`;
    let data = this.updateForm.value;
    this.helperService.patch(url, data).subscribe((res: any) => {
      if (res.status) {
        this.classType = 'success';
        this.message = 'Successfully updated';
        let el: HTMLElement = this.closeUpdateModal.nativeElement as HTMLElement;
        el.click();
        this.getUsers();
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
