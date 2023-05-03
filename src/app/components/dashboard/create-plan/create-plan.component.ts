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
      tagline: ['', [Validators.required]],
      is_free: [false, [Validators.required]],
      price_tag_prefix: [''],
      price_tag_surfix: [''],
      is_custom: [false, [Validators.required]],
      descriptions: ['', [Validators.required]],
      number_of_codes_tag_prefix: ['', [Validators.required]],
      number_of_codes: ['', [Validators.pattern("^[0-9]*$")]],
      number_of_codes_text: ['', [Validators.required]],
      cta_text: ['', [Validators.required]],
      sorting_order: ['', [Validators.required]],
    });

  }

  // submit form
  submit() {
    if (this.createForm.valid) {

      this.helperService.showloader();

      let params: any = this.createForm.value;
      params.is_free = params.is_free ? 1 : 0;
      params.is_custom = params.is_custom ? 1 : 0;
      params.descriptions = params.descriptions.split(',');

      let url = 'auth/admin/plans';

      this.helperService.post(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.msg = res.message;
            this.createForm.reset();
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

}
