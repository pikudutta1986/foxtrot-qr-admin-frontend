import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginForm: any = FormGroup;
  public msg = '';

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  

  // Login user
  login() {
    console.log(this.loginForm.value)
    if(this.loginForm.valid) {
      let data = this.loginForm.value;
      let email = data.email;
      let pass = data.password;
      this.authService.doLogin(email,pass).subscribe((res:any) => {
        console.log(res);
        if(res.status) {
          this.loginForm.reset();
          sessionStorage.setItem ('user_id', res.user_id);
          sessionStorage.setItem ('user_name', res.user_name);
          sessionStorage.setItem ('token', res.token);          
          this.router.navigate(['/dashboard']);
        } else {
          this.msg = res.message;
          console.log(this.msg,'msg');
        }
      });
    }
  }

}
