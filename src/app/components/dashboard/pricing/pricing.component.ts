import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {

  displayedColumns: string[] = ['position', 'name', 'price', 'payment_gateway', 'duration_in_months', 'platform', 'created_at', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  message = '';
  classType: any = '';

  pricings: any = '';
  srcPricings: any = [];

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.helperService.showloader();
    this.helperService.searchInput.subscribe((res:any) => {
      this.applyFilter(res);
    });
  }

  ngAfterViewInit() {   
    this.getPricings();
    this.cdr.detectChanges();
  }

  // ALL PRICING  
  getPricings() {   
    if(this.helperService.allPricings && this.helperService.allPricings.length > 0 ) {
      this.pricings = this.helperService.allPricings;
      this.setData();
    } else {
      setTimeout(() => {
        this.getPricings();
      }, 1000);
    }

  }

  setData() {   
    this.srcPricings = new MatTableDataSource(this.pricings)
    this.srcPricings.paginator = this.paginator;
    this.srcPricings.sort = this.sort;
    this.helperService.hideloader();
  }

  applyFilter(filterValue: any) {
    // filterValue = filterValue.value;
    this.srcPricings.filter = filterValue.trim().toLowerCase();
    if (this.srcPricings.paginator) {
      this.srcPricings.paginator.firstPage();
    }
  }

  editPricing(element: any) {
    localStorage.setItem('selectedPricing', JSON.stringify(element));
    this.router.navigate(['dashboard/pricing/edit',element.id]);
  }

  createPricing() {
    this.router.navigate(['dashboard/pricing/create-pricing']);    
  }

  deletePricing(element: any) {
    this.helperService.showloader();
    let url = `auth/admin/pricings/${element.id}`;
    this.helperService.delete(url).subscribe(
      (res:any) => {
        this.helperService.hideloader();
        if(res.status) {
          this.refreshAllPricings();
          // this.message = res.message;
        } else {

        }
        this.message = res.message;
        
      },
      (errors:any) => {
        console.log(errors);
        this.helperService.hideloader();
      },
    )
    this.classType = 'danger';
  }

  refreshAllPricings() {
    let params = 'auth/admin/pricings ';
    this.helperService.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.helperService.allPricings = res.pricings;  
          this.getPricings();         
        } else {
          this.helperService.allPricings = [];
        }
      },
      (err: any) => {
        console.log(err);
      });

  }

}
