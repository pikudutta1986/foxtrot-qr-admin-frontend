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

  displayedColumns: string[] = ['position', 'name', 'price', 'payment_gateway', 'duration_in_months', 'platform', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize:any = 10;

  message = '';
  classType: any = '';

  pricings: any = '';
  srcPricings: any = [];

  selectedPlatform:any = '';
  searchInput:any = '';
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

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.helperService.showloader();
    this.helperService.searchInput.subscribe((res:any) => {
      // this.applyFilter(res);
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
      if(this.pricings && this.pricings.length > 0) {
        let i = 0;
        this.pricings.map((x:any) => {
          i++;
          x.sno = i;
        });
      }
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

  applyFilter() {

    let filteredData = [];

    if(this.searchInput) {     
      let result = this.pricings.filter((x: any) => JSON.stringify(x.name).toLowerCase().indexOf(this.searchInput.toLowerCase()) !== -1);
      filteredData = result;
    }

    if(this.selectedPlatform) {
      if(filteredData.length > 0) {
        let result = filteredData.filter((x: any) => {
          if(x.platform == this.selectedPlatform) {
            return x;
          }
        });
        filteredData = result;
      } else {
        let result = this.pricings.filter((x: any) => {
          if(x.platform == this.selectedPlatform) {
            return x;
          }
        });
        filteredData = result;
      } 
    }  

    if(!this.searchInput && !this.selectedPlatform) {
      filteredData = this.pricings;
    }

    this.srcPricings = new MatTableDataSource(filteredData)
    this.srcPricings.paginator = this.paginator;
    this.srcPricings.sort = this.sort;    
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
        if(res.status) {
          this.helperService.allPricings = [];
          this.helperService.getAllPricings();
          setTimeout(() => {
            this.getPricings();
            this.helperService.hideloader();
            this.helperService.snackPositionTopCenter(res.message);
          }, 1000);
        } 
        // this.message = res.message;        
      },
      (errors:any) => {
        console.log(errors);
        this.helperService.hideloader();
      },
    )
    this.classType = 'danger';
  }

  
}
