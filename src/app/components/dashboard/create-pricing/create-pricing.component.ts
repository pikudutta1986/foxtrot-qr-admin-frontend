import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-create-pricing',
  templateUrl: './create-pricing.component.html',
  styleUrls: ['./create-pricing.component.scss']
})
export class CreatePricingComponent {

  public createForm: any = FormGroup;
  public msg = '';

  plans:any;
  platforms:any = ['Web', 'Android', 'iOS'];
  gateways:any =  ['Payfast', 'Google Play', 'Apple Pay'];


  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.createForm = this.formBuilder.group({
      plan_id: ['',[Validators.required]],
      name: ['', [Validators.required]],
      list_on_ui: [true, [Validators.required]],
      platform: ['', [Validators.required]],
      payment_gateway: ['', [Validators.required]],
      gateway_plan_id: [],
      time_interval: [''],
      price: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      duration_in_months: ['', [Validators.pattern("^[0-9]*$")]],
      is_recurring: [false,[Validators.required]],      
      discount_enabled: [false,[Validators.required]],
      discounted_price: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      discount_start_date: [''],
      discount_end_date: [''],
      sorting_order: ['', [Validators.pattern("^[0-9]*$")]],
    });

    this.getPlans();
  }

  getPlans() {
    if(this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      this.plans = this.helperService.allPlans;
    } else {
      setTimeout(() => {
        this.getPlans();
      }, 1000);
    }
  }

  // submit form
  submit() {
    if (this.createForm.valid) {

      this.helperService.showloader();

      let params: any = this.createForm.value;

      if(!params.discounted_price) {
        delete params.discounted_price;
      }
      if(!params.discount_start_date) {
        delete params.discount_start_date;
      }
      if(!params.discount_end_date) {
        delete params.discount_end_date;
      }
      
      let url = 'auth/admin/pricings';

      this.helperService.post(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.msg = res.message;
            this.createForm.reset();
            this.refreshAllPricings();
          } else {
            this.msg = res.message;
          }

          this.helperService.hideloader();
        },
        (err: any) => {
          this.helperService.hideloader();
          console.log(err);
        }
      )
    };

  }

  refreshAllPricings() {
    let params = 'auth/admin/pricings ';
    this.helperService.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.helperService.allPricings = res.pricings;           
        } else {
          this.helperService.allPricings = [];
        }
      },
      (err: any) => {
        console.log(err);
      });

  }

}
