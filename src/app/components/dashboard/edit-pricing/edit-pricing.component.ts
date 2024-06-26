import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-edit-pricing',
  templateUrl: './edit-pricing.component.html',
  styleUrls: ['./edit-pricing.component.scss']
})
export class EditPricingComponent {

  editForm: any = FormGroup;
  msg = '';

  platforms:any = [
    {
      id:'web',
      text: 'Web'
    },
    {
      id:'android',
      text: 'Android'
    },
    {
      id:'ios',
      text: 'iOS'
    },
  ];
  gateways:any =  ['Payfast', 'Google Play', 'Apple Pay'];

  currentPricingId:any;
  plans:any;

  isDisabled:any = true;

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    let params: any = this.route.snapshot.params;
    
    this.currentPricingId = params.id;

    this.editForm =  this.formBuilder.group({
      plan_id: ['',[Validators.required]],
      name: ['', [Validators.required]],
      list_on_ui: [true, [Validators.required]],
      platform: ['', [Validators.required]],
      payment_gateway: ['', [Validators.required]],
      gateway_plan_id: [],
      time_interval: ['',[Validators.required]],
      price: ['', [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      duration_in_months: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      is_recurring: [false,[Validators.required]],      
      discount_enabled: [false,[Validators.required]],
      discounted_price: ['', [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      discount_start_date: [''],
      discount_end_date: [''],
      sorting_order: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    },
    {
      validator: this.dateValidator('discount_start_date', 'discount_end_date'),
    });

    this.helperService.showloader();

    this.getPlans();

    this.editForm.get("discount_enabled").valueChanges.subscribe((x:any) => {
      this.setEnableStatus(x);
    });

  }

  get formControl() {
    return this.editForm.controls;
  }

  getPricingDetailsById() {
    if(this.helperService.allPricings && this.helperService.allPricings.length > 0) {      
      let currentPricing: any= this.helperService.allPricings.find((x:any) => x.id == this.currentPricingId);
      if(this.currentPricingId == currentPricing.id) {        
        this.setData(currentPricing)
      } 
    } 
  }

  getPlans() {
    if(this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      this.plans = this.helperService.allPlans;
      this.getPricingDetailsById();
    } else {
      setTimeout(() => {
        this.getPlans();
      }, 1000);
    }
  }

  setData(currentPricing: any) {

    if (currentPricing && currentPricing.id) {
      this.editForm.controls.plan_id.setValue(currentPricing.plan_id);
      this.editForm.controls.name.setValue(currentPricing.name);
      this.editForm.controls.list_on_ui.setValue(currentPricing.list_on_ui);
      this.editForm.controls.platform.setValue(currentPricing.platform);
      this.editForm.controls.payment_gateway.setValue(currentPricing.payment_gateway);      
      this.editForm.controls.time_interval.setValue(currentPricing.time_interval);
      this.editForm.controls.price.setValue(currentPricing.price);
      this.editForm.controls.duration_in_months.setValue(currentPricing.duration_in_months);
      this.editForm.controls.is_recurring.setValue(currentPricing.is_recurring);
      this.editForm.controls.discount_enabled.setValue(currentPricing.discount_enabled);
      this.editForm.controls.discounted_price.setValue(currentPricing.discounted_price);
      this.editForm.controls.discount_start_date.setValue(currentPricing.discount_start_date);
      this.editForm.controls.discount_end_date.setValue(currentPricing.discount_end_date);
      this.editForm.controls.sorting_order.setValue(currentPricing.sorting_order);

      if(currentPricing.discount_enabled) {
        this.isDisabled = false;        
      } else {
        this.isDisabled = true;
        this.setEnableStatus(false);        
      }
      console.log(this.editForm.value)
    }

    this.helperService.hideloader();

  }

  update() {
    if (this.editForm.valid) {
      this.helperService.scrollToTop();
      this.helperService.showloader();
      let params: any = this.editForm.value;
      if(!params.discounted_price) {
        delete params.discounted_price;
      }
      if(!params.discount_start_date) {
        delete params.discount_start_date;
      }
      if(!params.discount_end_date) {
        delete params.discount_end_date;
      }
      let url = `auth/admin/pricings/${this.currentPricingId}`;
      this.helperService.patch(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.helperService.snackPositionTopCenter(res.message);
            this.helperService.getAllPricings();
          } else {
            this.helperService.snackPositionTopCenter(res.message);
          }

          this.helperService.hideloader();
        },
        (err: any) => {
          this.helperService.hideloader();
          console.log(err);
        }
      )
    }
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
        this.editForm.controls['discounted_price'].enable();
        this.editForm.controls['discount_start_date'].enable();
        this.editForm.controls['discount_end_date'].enable();
    } else {
        this.editForm.controls['discounted_price'].disable();
        this.editForm.controls['discount_start_date'].disable();
        this.editForm.controls['discount_end_date'].disable();
    }
  }

  ngOnDestroy(): void {
    let currentPricing:any = localStorage.getItem('selectedPricing');
    currentPricing = JSON.parse(currentPricing);
    if(currentPricing) {
      localStorage.removeItem('selectedPricing');
    }
  }

}
