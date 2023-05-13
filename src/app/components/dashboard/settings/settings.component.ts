import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public passwordResetForm: any = FormGroup;
  public msg = '';
  public classType = '';

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService,
    private router: Router) { }

  ngOnInit() {
    this.passwordResetForm = this.formBuilder.group({
      current_password: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]]
    },
      {
        validator: this.ConfirmedValidator('password', 'password_confirmation'),
      });

  }

  get formControl() {
    return this.passwordResetForm.controls;
  }

  // reset
  reset() {
    this.helperService.showloader();
    this.helperService.post('auth/admin/password-reset', this.passwordResetForm.value).subscribe((res: any) => {
      if (res.errors) {
        this.msg = res.errors.current_password[0];
        this.classType = 'danger';
        this.helperService.hideloader();
      } else {
        if(res.status) {
          this.msg = res.message;
          this.classType = 'success';
          this.passwordResetForm.reset();
        }        
        this.helperService.hideloader();
      }

    },
    (error: any) => {   
      this.classType = 'danger';
      this.msg = error.error.message;
      this.helperService.hideloader();
    }
    )
  }

  // match password & confirmed password
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}




