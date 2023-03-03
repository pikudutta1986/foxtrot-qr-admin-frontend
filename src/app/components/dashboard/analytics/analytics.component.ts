import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent {

  userType:any = 'user';
  paymentType:any = 'payment';
  qrType:any = 'qr';

  users: any = 
    {
      oxygen: 0.78,
      nitrogen: 0.21,
      others: 0.54
  }
  ;

  payments: any = 
    {
      visa: 30.78,
      rupay: 20.21,
      master: 40.54
  }
  ;

  qrs: any = 
  {
    website: 14,
    mobile: 8,
    others: 33
  }
;


}
