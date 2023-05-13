import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-edit-plan',
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.scss']
})
export class EditPlanComponent {

  editForm: any = FormGroup;
  msg = '';
  currentPLanId: any;

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let params: any = this.route.snapshot.params;
    
    this.currentPLanId = params.id;

    this.editForm =this.formBuilder.group({
      name: ['', [Validators.required]],
      tagline: [''],
      is_free: [false, [Validators.required]],
      price_tag_prefix: [''],
      price_tag_surfix: [''],
      is_custom: [false, [Validators.required]],
      descriptions:this.formBuilder.array([]), 
      number_of_codes_tag_prefix: [''],
      number_of_codes: ['', [Validators.pattern("^[0-9]*$")]],
      number_of_codes_text: [''],
      cta_text: ['', [Validators.required]],
      sorting_order: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

    this.getPlanDetailsById();
  }

  get formControl() {
    return this.editForm.controls;
  }

  get descriptions() {
    return this.editForm.get('descriptions') as FormArray;
  }

  addDescription() {
    this.descriptions.push(this.formBuilder.control(null, Validators.required));
  } 

  setData(currentPlan: any) {

    if (currentPlan && currentPlan.id) {
      // currentPlan.descriptions = currentPlan.descriptions.toString();

      if(currentPlan.descriptions && currentPlan.descriptions.length > 0) {
        currentPlan.descriptions.forEach((element:any) => {
          this.descriptions.push(this.formBuilder.control(element, Validators.required));          
        });
      }

      this.editForm.controls.name.setValue(currentPlan.name);
      this.editForm.controls.tagline.setValue(currentPlan.tagline);
      this.editForm.controls.number_of_codes.setValue(currentPlan.number_of_codes);
      this.editForm.controls.is_free.setValue(currentPlan.is_free);
      this.editForm.controls.is_custom.setValue(currentPlan.is_custom);
      this.editForm.controls.price_tag_prefix.setValue(currentPlan.price_tag_prefix);
      this.editForm.controls.price_tag_surfix.setValue(currentPlan.price_tag_surfix);

      this.editForm.controls.number_of_codes_tag_prefix.setValue(currentPlan.number_of_codes_tag_prefix);
      this.editForm.controls.number_of_codes_text.setValue(currentPlan.number_of_codes_text);

      // this.editForm.controls.descriptions.setValue(currentPlan.descriptions);
      this.editForm.controls.cta_text.setValue(currentPlan.cta_text);
      this.editForm.controls.sorting_order.setValue(currentPlan.sorting_order);
    }

  }

  getPlanDetailsById() {
    this.helperService.showloader();

    let url = `auth/admin/plans/${this.currentPLanId}`;

    this.helperService.get(url).subscribe(
      (res: any) => {
        if (res.status) {
          this.setData(res.plan)
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
  }

  update() {
    if (this.editForm.valid) {
      this.helperService.showloader();
      let params: any = this.editForm.value;

      // params.descriptions = params.descriptions.split(',');

      if (params.descriptions.length < 1) {
        delete params.descriptions;
      }

      if (!params.number_of_codes) {
        delete params.number_of_codes;
      }

      let url = `auth/admin/plans/${this.currentPLanId}`;

      this.helperService.patch(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.msg = res.message;
            localStorage.setItem('currentPlan', JSON.stringify(res.plan));
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
    }


  }

  ngOnDestroy(): void {
    localStorage.removeItem('currentPlan');
  }

}
