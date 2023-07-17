import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {

  displayedColumns: string[] = ['position', 'userDisplay', 'planDisplay', 'price', 'payment_gateway', 'status', 'created_at', 'expired_at'];
  
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  message = '';
  classType:any = '';
  userPayments:any = [];
  srcData:any;
  selectedUserId:any = '';
  total:any;
  links:any;

  plans: any = [];
  pricings:any = [];
  paymentGateways:any = [];

  searchInputText: any = '';
  planId: any = '';
  pricingId:any = '';
  gatewayId:any;
  from_date: any = '';
  to_date: any = '';
  keyupTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    public helperService: HelperService) { }

  ngOnInit(): void {    
    this.helperService.showloader();
  } 

  ngAfterViewInit() {
    this.getPayments();
    this.getPlans();
    this.getAllPricings();
    this.cdr.detectChanges();   
  }

  // get all plans
  getPlans() {
    if (this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      this.plans = this.helperService.allPlans;
    } else {
      setTimeout(() => {
        this.getPlans();
      }, 1000);
    }
  }

  // get all pricings
  getAllPricings() {
    if (this.helperService.allPricings && this.helperService.allPricings.length > 0) {
      this.pricings = this.helperService.allPricings;
    } else {
      setTimeout(() => {
        this.getAllPricings();
      }, 1000);
    }
  }

  // ALL PAYMENTS  
  getPayments() {
    if(this.helperService.allPayments && this.helperService.allPayments.data.length > 0 ) {
      this.setPagination(this.helperService.allPayments);
    } else {
      setTimeout(() => {
        this.getPayments();
      }, 1000);
    }
  } 
  
  setPagination(links: any) {
    let srcData = links.data;
    srcData.map((x:any) => {
      x.userDisplay = x.user.email;
      x.planDisplay = x.pricing.name;
      x.expired_at = x.user.current_plan_expiry_day;
    });
    this.srcData = srcData;
    this.total = links.total;
    this.userPayments = new MatTableDataSource(this.srcData)
    this.userPayments.sort = this.sort;

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

  gotoPage(page: any) {
    if (page.url) {
      this.helperService.scrollToTop();
      setTimeout(() => {
        this.helperService.showloader();
        this.helperService.rawGet(page.url).subscribe((res: any) => {
          if (res.success) {
            this.setPagination(res.pricings);
          } else {
            this.srcData = [];
          }
          this.helperService.hideloader();
        })
      }, 500);
    }
  }

  filter() {

  }


}
