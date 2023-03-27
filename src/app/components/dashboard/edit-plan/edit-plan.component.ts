import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-edit-plan',
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.scss']
})
export class EditPlanComponent {

  editForm: any = FormGroup;
  msg = '';
  currentPLanId:any;

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // price: ['', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
      // number_of_codes: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      // duration_in_months: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      // tracking_enabled: ['', [Validators.required]],
      // only_trackable: ['', [Validators.required]],
      contains_ad: ['', [Validators.required]],
      descriptions: ['', [Validators.required]],
    });

    this.setData();
  }

  setData() {
    let currentPlan: any = localStorage.getItem('currentPlan');
    currentPlan = JSON.parse(currentPlan);
    if (currentPlan && currentPlan.id) {
      this.currentPLanId = currentPlan.id;
      currentPlan.descriptions = currentPlan.descriptions.toString();
      this.editForm.controls.name.setValue(currentPlan.name);
      // this.editForm.controls.price.setValue(currentPlan.price);
      // this.editForm.controls.number_of_codes.setValue(currentPlan.number_of_codes);
      // this.editForm.controls.duration_in_months.setValue(currentPlan.duration_in_months);
      // this.editForm.controls.tracking_enabled.setValue(currentPlan.tracking_enabled);
      // this.editForm.controls.only_trackable.setValue(currentPlan.only_trackable);
      this.editForm.controls.contains_ad.setValue(currentPlan.contains_ad);
      this.editForm.controls.descriptions.setValue(currentPlan.descriptions);
    }

  }

  update() {
    if(this.editForm.valid) {
      let params:any = this.editForm.value;
      // params.tracking_enabled = params.tracking_enabled ? 1 : 0;
      // params.only_trackable = params.only_trackable ? 1 : 0;
      params.contains_ad = params.contains_ad ? 1 : 0;
      params.descriptions = params.descriptions.split(',');
      console.log(params);

      let url = `auth/admin/plans/${this.currentPLanId}`;
      this.helperService.patch(url,params).subscribe(
        (res:any) => {
          if(res.status) {
            this.msg = res.message;
            localStorage.setItem('currentPlan', JSON.stringify(res.plan));;
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

  ngOnDestroy(): void {
    localStorage.removeItem('currentPlan');
  }

}
