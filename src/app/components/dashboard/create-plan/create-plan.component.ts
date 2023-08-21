import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  }

  get formControl() {
    return this.createForm.controls;
  }

  get descriptions() {
    return this.createForm.get('descriptions') as FormArray;
  }

  addDescription() {
    this.descriptions.push(this.formBuilder.control(null, Validators.required));
  } 

  removeDescription(index: number) {
    if(this.descriptions.length > 1) {
      this.descriptions.removeAt(index);
    }
  }

  // submit form
  submit() {
    if (this.createForm.valid) {
      this.helperService.scrollToTop();
      this.helperService.showloader();

      let params: any = this.createForm.value;
      params.is_free = params.is_free ? 1 : 0;
      params.is_custom = params.is_custom ? 1 : 0;

      if (params.descriptions.length < 1) {
        delete params.descriptions;
      }

      if (!params.number_of_codes) {
        delete params.number_of_codes;
      }

      let url = 'auth/admin/plans';

      this.helperService.post(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.helperService.snackPositionTopCenter(res.message);
            this.createForm.reset();
            this.createForm.controls.is_free.setValue(false);
            this.createForm.controls.is_custom.setValue(false);
            this.helperService.setPlans();
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
    };

  }

}
