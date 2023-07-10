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

  createForm: any = FormGroup;
  msg = '';

  plans: any;

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

  gateways: any = ['Payfast', 'Google Play', 'Apple Pay'];

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.createForm = this.formBuilder.group({
      plan_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      list_on_ui: [true, [Validators.required]],
      platform: ['', [Validators.required]],
      payment_gateway: ['', [Validators.required]],
      gateway_plan_id: [],
      time_interval: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      duration_in_months: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      is_recurring: [false, [Validators.required]],
      discount_enabled: [false, [Validators.required]],
      discounted_price: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      discount_start_date: [''],
      discount_end_date: [''],
      sorting_order: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    },
      {
        validator: this.dateValidator('discount_start_date', 'discount_end_date'),
    });

    this.getPlans();

    this.setEnableStatus(false);

    this.createForm.get("discount_enabled").valueChanges.subscribe((x:any) => {
      this.setEnableStatus(x);
    });
  }

  getPlans() {
    if (this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      this.plans = this.helperService.allPlans;
    } else {
      setTimeout(() => {
        this.getPlans();
      }, 1000);
    }
  }

  get formControl() {
    return this.createForm.controls;
  }

  // submit form
  submit() {
    if (this.createForm.valid) {
      this.helperService.scrollToTop();
      this.helperService.showloader();

      let params: any = this.createForm.value;

      if (!params.discounted_price) {
        delete params.discounted_price;
      }
      if (!params.discount_start_date) {
        delete params.discount_start_date;
      }
      if (!params.discount_end_date) {
        delete params.discount_end_date;
      }

      let url = 'auth/admin/pricings';

      this.helperService.post(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.createForm.reset();
            this.createForm.controls.list_on_ui.setValue(true);
            this.createForm.controls.is_recurring.setValue(false);
            this.createForm.controls.discount_enabled.setValue(false);
            this.helperService.getAllPricings();
          } 
          this.helperService.snackPositionTopCenter(res.message)
          this.helperService.hideloader();
        },
        (err: any) => {
          this.helperService.hideloader();
          console.log(err);
        }
      )
    };

  }

  // discount date validator
  dateValidator(controlName: string, discountEndControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const discountEndControl = formGroup.controls[discountEndControlName];
     
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      let ct = today.getTime();

      let startDate = Date.parse(control.value);
      let endDate = Date.parse(discountEndControl.value)

      if (control.value) {
        if (!discountEndControl.value) {
          discountEndControl.setErrors({ required: true });
        }
      }

      if (discountEndControl.value) {
        if (!control.value) {
          control.setErrors({ required: true });
        }
      }     

      if(control.value && discountEndControl.value) {
        if(startDate > endDate) {
          discountEndControl.setErrors({ minLength: true });
        }

        if(startDate < endDate) {
          control.setErrors(null);
          discountEndControl.setErrors(null);
        }
      }

      if (ct > Date.parse(control.value)) {
        control.setErrors({ dateValidator: true });
      }

      if (ct > Date.parse(discountEndControl.value)) {
        discountEndControl.setErrors({ dateValidator: true });
      }

    };
  }

  setEnableStatus(val:any) {
    if(val) {
        this.createForm.controls['discounted_price'].enable();
        this.createForm.controls['discount_start_date'].enable();
        this.createForm.controls['discount_end_date'].enable();
    } else {
        this.createForm.controls['discounted_price'].disable();
        this.createForm.controls['discount_start_date'].disable();
        this.createForm.controls['discount_end_date'].disable();
    }
  }

}
