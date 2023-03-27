import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss']
})
export class CreatePlanComponent {

  public createForm: any = FormGroup;
  public msg = '';

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
      number_of_codes: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      duration_in_months: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      tracking_enabled: [false, [Validators.required]],
      only_trackable: [false, [Validators.required]],
      contains_ad: [false, [Validators.required]],
      descriptions: ['', [Validators.required]],
    });

    this.setData();
  }

  setData() {
    let currentPlan: any = localStorage.getItem('currentPlan');
    currentPlan = JSON.parse(currentPlan);
    if (currentPlan && currentPlan.id) {
      currentPlan.descriptions = currentPlan.descriptions.toString();
      this.createForm.controls.name.setValue(currentPlan.name);
      this.createForm.controls.price.setValue(currentPlan.price);
      this.createForm.controls.number_of_codes.setValue(currentPlan.number_of_codes);
      this.createForm.controls.duration_in_months.setValue(currentPlan.duration_in_months);
      this.createForm.controls.tracking_enabled.setValue(currentPlan.tracking_enabled);
      this.createForm.controls.only_trackable.setValue(currentPlan.only_trackable);
      this.createForm.controls.contains_ad.setValue(currentPlan.contains_ad);
      this.createForm.controls.descriptions.setValue(currentPlan.descriptions);
    }

  }

  submit() {
    if(this.createForm.valid) {
      this.helperService.showloader();
      let params:any = this.createForm.value;
      params.tracking_enabled = params.tracking_enabled ? 1 : 0;
      params.only_trackable = params.only_trackable ? 1 : 0;
      params.contains_ad = params.contains_ad ? 1 : 0;
      params.descriptions = params.descriptions.split(',');

      let url = 'auth/admin/plans';
      this.helperService.post(url,params).subscribe(
        (res:any) => {
          if(res.status) {
            this.msg = res.message;
            this.createForm.reset();
          } else {  
            this.msg = res.message;
          }
          
          this.helperService.hideloader();
        },
        (err:any) => {
          this.helperService.hideloader();
          console.log(err);
        }
      )
    }
   

  }

}
