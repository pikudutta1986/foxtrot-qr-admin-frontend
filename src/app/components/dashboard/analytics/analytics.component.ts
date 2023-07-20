import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent {
  
  viewType: any = '';
  planViewType: any = '';
  userViewType: any = '';

  userData: any;
  plans: any;
  planType:any;

  srcAnalyticsData: any = '';
  paymentViewData: any;
  planViewData: any;
  userViewData: any;

  userChartValid:any = '';
  planChartValid:any = '';
  paymentChartValid:any = '';

  userChartInvalidMsg:any = '';
  planChartInvalidMsg:any = '';
  paymentChartInvalidMsg:any = '';

  constructor(
    private router: Router,
    private cdrf: ChangeDetectorRef,
    public helperService: HelperService) {
    let data: any = localStorage.getItem('userData');
    this.userData = JSON.parse(data);
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.viewType = 'weekly';
    this.planViewType = 'weekly';
    this.userViewType = 'weekly';
    this.getAnalyticsData();
    this.cdrf.detectChanges();
  }

  // get analytics data
  getAnalyticsData() {
    this.helperService.showloader();
    this.helperService.get('auth/admin/dashboard').subscribe((res: any) => {
      if (res.status) {
        this.helperService.hideloader();
        if (res.data) {
          this.srcAnalyticsData = res.data;
          this.setDataToChart();
        }
      }
    })
  }

  // set data
  setDataToChart() {
    if (this.srcAnalyticsData) {
      
      let paymentsData = this.srcAnalyticsData.payments;
      let paymentViewData = paymentsData.weekly;
      this.setToPayment(paymentViewData);     

      let plansrcData = this.srcAnalyticsData.plan;
      this.setToPlan(plansrcData,'weekly');            

      let usersData = this.srcAnalyticsData.users;
      let userViewData = usersData.weekly;
      this.setToUser(userViewData);
      
    }
  }

  // user/payment details change
  onChangeViewType(e: any, ctype: any) {
    
    if (ctype == 'payment') {
      
      let paymentsData:any = this.srcAnalyticsData.payments;
      let paymentViewData:any = '';
      
      if (this.viewType == 'monthly') {
        paymentViewData = paymentsData.monthly;
      } else if (this.viewType == 'yearly') {
        paymentViewData = paymentsData.yearly;        
      } else {
        paymentViewData = paymentsData.weekly;       
      }

      this.setToPayment(paymentViewData);
    }

    if (ctype == 'user') {
      let usersData = this.srcAnalyticsData.users;
      let userViewData:any = '';
      if (this.userViewType == 'monthly') {
        userViewData = usersData.monthly; 
      } else if (this.userViewType == 'yearly') {
        userViewData = usersData.yearly;        
      } else {        
        userViewData = usersData.weekly;        
      }
      this.setToUser(userViewData);
    }

    this.cdrf.detectChanges();
  }

  // plan details channge
  onChangePlanViewType(e:any) {    
    let plansrcData = this.srcAnalyticsData.plan;
    this.setToPlan(plansrcData,this.planViewType);
  } 

  // payment chart
  setToPayment(paymentViewData:any) {
    let paymentObj:any = {};
    if(paymentViewData.length > 0) {      
      paymentViewData.map((e: any) => {
        var datePipe = new DatePipe('en-US');
        let key:any = datePipe.transform(e.x, 'dd/MM/yyyy');
        let value = e.y;
        paymentObj[key] = value;
      });
      this.paymentChartInvalidMsg = '';
      this.paymentChartValid = true;
      this.paymentViewData = paymentObj;
    } else {
      this.paymentChartInvalidMsg = 'No records found !!';
      this.paymentChartValid = false;
    }
  }

  // user chart
  setToUser(userViewData:any) {
    let userObj: any = {};
    if(userViewData && userViewData.length > 0) {
      userViewData.map((e: any) => {
        var datePipe = new DatePipe('en-US');
        let key:any = datePipe.transform(e.x, 'dd/MM/yyyy');
        let value = e.y;
        userObj[key] = value;
      });
      this.userChartInvalidMsg = '';
      this.userChartValid = true;
      this.userViewData = userObj;
    } else {
      this.userChartInvalidMsg = 'No records found !!';
      this.userChartValid = false;
    }    
  }

  // plan chart
  setToPlan(plansrcData:any,vtype:any) {
    
    let keys = Object.keys(plansrcData);
    this.plans = keys;
    let leng = this.plans.length;

    let weeklyData:any = [];

    var arr = [];
    arr[0] = "Year";  

    for(var i=0; i<leng; i++) {
      let planType = this.plans[i];
      arr[i+1] = planType;
      let planweeklyData = plansrcData[planType][vtype];
      
      planweeklyData.map((v:any) => {         
        weeklyData.push(v)
      }); 
      
      if(i == leng -1) { 
        if(weeklyData.length > 0) {
          weeklyData.sort((a: any, b: any) => (a.x > b.x) ? 1 : -1);

          let wd = JSON.stringify(weeklyData);
          let cwd = JSON.parse(wd);
  
          var weeklyOutput:any = [];
          
          cwd.forEach(function(item:any) {
            var existing = weeklyOutput.filter(function(v:any, i:any) {
              return v.x == item.x;
            });
            if (existing.length) {
              var existingIndex = weeklyOutput.indexOf(existing[0]);
              weeklyOutput[existingIndex].y = weeklyOutput[existingIndex].y.concat(item.y);
            } else {          
              item.y = [item.y];
              weeklyOutput.push(item);}
          });
          
          let ss:any = [];      
          ss.push(arr);
          let requiredLength = leng + 1; 
          
          weeklyOutput.forEach((element:any) => {  
            let InputData: any = [];  
            var datePipe = new DatePipe('en-US');
            InputData.push(datePipe.transform(element.x, 'dd/MM/yyyy'));
            element.y.forEach((z:any) => {
              InputData.push(z); 
            });
            ss.push(InputData);       
          });
  
          ss.map((chk:any) => {
            if(chk.length < requiredLength) {
              chk.push(0);
            }
          });
          this.planChartInvalidMsg = '';
          this.planChartValid = true;
  
          setTimeout(() => {
            this.planViewData = ss; 
          }, 500);
        } else {
          this.planChartInvalidMsg = 'No records found !!';
          this.planChartValid = false;
        }         
      }
      
    }    
    
  }
 
}
