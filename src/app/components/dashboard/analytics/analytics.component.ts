import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent {

  paymentType: any = 'payment';
  qrType: any = 'qr';

  payments: any = {
    Website: 14,
    Email: 3,
    Location: 7,
    Socialmedia: 5,
    Whatsapp: 40,
    Wifi: 11,
    VirtualCard: 7,
    Event: 13,
  };

  qrs: any = {
    Website: 14,
    Email: 3,
    Location: 7,
    Socialmedia: 5,
    Whatsapp: 40,
    Wifi: 11,
    VirtualCard: 7,
    Event: 13,
  };

  viewType: any = '';
  columnChartsData: any;

  columnChartsDataWeekWise: any = {
    Sun: 6,
    Mon: 2,
    Tue: 8,
    Wed: 9,
    Thu: 21,
    Fri: 15,
    Sat: 10,
  }

  columnChartsDataYearwise: any = {
    2017: 6,
    2018: 26,
    2019: 16,
  };

  columnChartsDataMonthwise: any = {
    Jan: 6,
    Feb: 26,
    Mar: 16,
  };

  platforms: any = {
    'Android': 22,
    'Ios': 23,
    'Web': 55
  };

  locationChartData: any;
  planChartsrcData:any = {
    'Starter': 25,
    'Pro': 35,
    'Enterprise': 45
  };
  paymentChartsrcData:any = {};

  userData: any;
  plans: any;
  userPlan: any = [];

  constructor(
    private router: Router,
    private cdrf: ChangeDetectorRef,
    public helperService: HelperService) {
    let data: any = sessionStorage.getItem('userData');
    this.userData = JSON.parse(data);

    let plans: any = sessionStorage.getItem('all-plans');
    this.plans = JSON.parse(plans);
  }

  ngOnInit() {
    this.getLocationData();
  }

  ngAfterViewInit() {
    this.viewType = 'weekly';
    this.columnChartsData = this.columnChartsDataWeekWise;
    this.cdrf.detectChanges();
  }

  onChangeViewType(e: any) {
    if (this.viewType == 'monthly') {
      this.columnChartsData = this.columnChartsDataMonthwise;
    } else if (this.viewType == 'yearly') {
      this.columnChartsData = this.columnChartsDataYearwise;
    } else {
      this.columnChartsData = this.columnChartsDataWeekWise;
    }

    this.cdrf.detectChanges();
  }

  // get percentage
  getPercentage(num: any, total: any) {
    return ((num / total) * 100).toFixed(2);
  }

  getLocationData() {
    let locationData: any = 
      {
        users: [
          {
            count: 25,
            name: 'India',
          },
          {
            count: 21,
            name: 'UK',
          },
          {
            count: 19,
            name: 'USA',
          },
          {
            count: 15,
            name: 'RSA',
          }
        ],
        count: 80
      }
    ;
    if (locationData.count > 0) {
      locationData.users.map((x: any) => {
        x.percentage = this.getPercentage(x.count, locationData.count)
      });

      this.locationChartData = locationData;
      console.log(this.locationChartData)
    }
  }


}
