import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent {

  message = '';
  classType:any = '';
  userFiles:any = [];

  matcher = new ErrorStateMatcher();

  displayedColumns: string[] = ['position', 'name', 'email', 'created_at', 'action'];
  
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  staticData:any = [
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

  mainSrcData:any = [
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

  selectedUserId:any = '';

  constructor(
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {    
    // this.getUsers();   
  }  

  ngAfterViewInit() {
    // this.userFiles.paginator = this.paginator;
    this.staticData.map((x:any) => {
      x.isEdit = false;
    });

    this.userFiles = new MatTableDataSource(this.staticData)
    this.userFiles.paginator = this.paginator;
    this.userFiles.sort = this.sort;
  }

  getUsers() {
    this.userFiles = new MatTableDataSource(this.staticData)
    this.userFiles.paginator = this.paginator;
    this.userFiles.sort = this.sort;
  }

  editUser(element:any) {
    element.isEdit = true;
    this.selectedUserId = element.id;
    console.log(element,'e')
  }

  deleteUser(element:any) {
    console.log(element,'e')
    this.classType = 'danger';
    this.message = 'Successfully deleted';
  }

  saveUser(element:any) {
    element.isEdit = false;
    this.classType = 'success';
    this.message = 'Successfully updated';
    console.log(element,'e')
  }

  cancelUser(element:any) {
    
    let result = this.mainSrcData.find((x:any) => {
      return x.id == element.id;
    });

    element.name = result.name;
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
