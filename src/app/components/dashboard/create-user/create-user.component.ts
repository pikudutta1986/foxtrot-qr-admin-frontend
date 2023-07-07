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

  constructor(
    private formBuilder: FormBuilder,
    public helperService: HelperService) { }

  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      plan_id: ['',[Validators.required]],
    });

    this.getPlans();

  }

  get formControl() {
    return this.registerForm.controls;
  }

  // add new user
  addUser() {
    this.helperService.showloader();
    this.helperService.post('auth/admin/users', this.registerForm.value).subscribe((res: any) => {
      if (res.status) {
        
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

  getPlans() {
    if(this.helperService.allPlans && this.helperService.allPlans.length > 0) {
      let plans = this.helperService.allPlans;
      plans.map((x:any) => {
        if(x.id == 1) {
          x.disabled = false;
        } else {
          x.disabled = true;
        }
      });
      this.plans = plans;
      let selectedPlan = this.plans[0].id;
      this.registerForm.controls.plan_id.setValue(selectedPlan);
    } else {
      setTimeout(() => {
        this.getPlans();        
      }, 1000);
    }
  }

}
