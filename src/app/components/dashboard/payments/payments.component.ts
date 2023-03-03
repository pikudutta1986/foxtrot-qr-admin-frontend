import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {

  displayedColumns: string[] = ['position', 'amount', 'type', 'created_at', 'action'];
  
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  message = '';
  classType:any = '';
  userPlans:any = [];
  staticData:any = [
    {
      id: 1, amount: '106', type: 'yearly', created_at: '2023-02-23 09:32:52'
    },
    {
      id: 2, amount: '206', type: 'unlimited', created_at: '2023-02-23 09:33:52'
    },
    {
      id: 3, amount: '306', type: 'yearly', created_at: '2023-02-23 09:34:52'
    },
    {
      id: 4, amount: '406', type: 'yearly', created_at: '2023-02-23 09:35:52'
    },
    {
      id: 5, amount: '506', type: 'quarter', created_at: '2023-02-23 09:36:52'
    }
  ];

  mainSrcData:any = [
    {
      id: 1, amount: '106', type: 'yearly', created_at: '2023-02-23 09:32:52'
    },
    {
      id: 2, amount: '206', type: 'unlimited', created_at: '2023-02-23 09:33:52'
    },
    {
      id: 3, amount: '306', type: 'yearly', created_at: '2023-02-23 09:34:52'
    },
    {
      id: 4, amount: '406', type: 'yearly', created_at: '2023-02-23 09:35:52'
    },
    {
      id: 5, amount: '506', type: 'quarter', created_at: '2023-02-23 09:36:52'
    }
  ];

  selectedUserId:any = '';

  constructor(
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {    
    // this.getPlans();   
  } 

  ngAfterViewInit() {
    this.staticData.map((x:any) => {
      x.isEdit = false;
    });    
    this.userPlans = new MatTableDataSource(this.staticData)
    this.userPlans.paginator = this.paginator;
    this.userPlans.sort = this.sort;
    this.cdr.detectChanges();
  }

  getPlans() {
    this.userPlans = new MatTableDataSource(this.staticData)
    this.userPlans.paginator = this.paginator;
    this.userPlans.sort = this.sort;
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.value;
    this.userPlans.filter = filterValue.trim().toLowerCase();
    if (this.userPlans.paginator) {
      this.userPlans.paginator.firstPage();
    }
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
    this.message = '';
    let result = this.mainSrcData.find((x:any) => {
      return x.id == element.id;
    });

    element.name = result.name;
    element.email = result.email;

    element.isEdit = false;
  }

}
