import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent {

  registerForm: any = FormGroup;
  plans:any = [];
  selectedPlan:any;

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
  prices:any = [];

  enableDetails:boolean = false;
  enablePriceDetails:boolean = false;
  platformError:boolean = false;
  priceError:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public helperService: HelperService) { }

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      plan: ['',[Validators.required]],
      platform: [''],
      price: [''],
    });

    this.getPlans();

  }

  get formControl() {
    return this.registerForm.controls;
  }

  // add new user
  addUser() {
    this.platformError = false;
    this.priceError = false;

    let formValue = this.registerForm.value;
    // console.log(this.registerForm.value)
    if(this.enableDetails) {
      if(formValue.platform == '') {
        this.platformError = true;
      }
  
      if(formValue.price == '') {
        this.priceError = true;        
      }

      if(formValue.platform && formValue.price) {
        this.finalSubmit();
      }

    } else {
      this.finalSubmit();
    }
  }

  getPlans() {
    if(this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      let plans = this.helperService.allPlans;
      this.plans = plans;
      this.selectedPlan = this.plans[0].id;
      this.registerForm.controls.plan.setValue(this.selectedPlan);
    } else {
      setTimeout(() => {
        this.getPlans();        
      }, 1000);
    }
  }

  onChangePlan(e:any) {
    this.enablePriceDetails = false;
    let res = this.plans.find((x:any) => {
      if(x.id == e) {
        return x;
      }
    });
    if(res) {
      if(!res.is_custom && !res.is_free) {
        this.enableDetails = true;
        this.registerForm.controls.platform.setValue('');
        this.registerForm.controls.price.setValue('');
        console.log('done')
      } else {
        this.enableDetails = false;
        this.registerForm.controls.platform.setValue('');
        this.registerForm.controls.price.setValue('');
      }
    }
  }

  onChangePlatform(e:any) {
    let pricing = this.helperService.allPricings;
    let plan_id = this.registerForm.controls['plan'].value;
    let result = pricing.filter((x:any) => {
      if(x.plan_id == plan_id && x.platform == e) {
        return x;
      }
    });

    if(result && result.length > 0) {
      this.prices = result;
      this.enablePriceDetails = true;
      this.platformError = false;
      this.registerForm.controls.price.setValue('');
    }
    console.log(result)
  }

  onChangePrice(e:any) {
    this.priceError = false;
    console.log(e);
  }

  finalSubmit() {
    this.helperService.showloader();
    this.helperService.post('auth/admin/users', this.registerForm.value).subscribe((res: any) => {
      if (res.status) {
        this.helperService.hideloader();
        this.registerForm.reset();
        this.registerForm.controls.plan.setValue(this.selectedPlan);
        this.enableDetails = false;
        this.enablePriceDetails = false;
        this.helperService.snackPositionTopCenter(res.message);   
        this.helperService.allUsers = [];
        this.helperService.getAllUsers();     
      } else {
        if (res.errors) {
         
        }
        this.helperService.hideloader();
      }
    },
      //Error callback
      (error) => {
        console.error('error caught in component');       
      }
    );
  }

}
