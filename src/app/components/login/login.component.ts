import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('email') email!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChild('loader') loader!: ElementRef<HTMLInputElement>;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private helperService: HelperService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: ['']
    });

    // Remember me set
    let remeberData: any = localStorage.getItem('remeberData');
    remeberData = JSON.parse(remeberData);
    if (remeberData && remeberData.rememberMe) {
      this.loginForm.controls.email.setValue(remeberData.email);
      this.loginForm.controls.password.setValue(remeberData.password);
      this.loginForm.controls.remember.setValue(remeberData.rememberMe);
    }

    // 
    this.loginForm.get('email').valueChanges.subscribe((val: any) => {
      if (val) {
        if (this.helperService.validateEmail(val)) {
          this.email.nativeElement.classList.add('is-valid');
        }
        else {
          this.email.nativeElement.classList.remove('is-valid');
        }
      } else {
        this.email.nativeElement.classList.add('is-invalid');
      }
    });

    this.loginForm.get('password').valueChanges.subscribe((val: any) => {
      if (val) {
        this.password.nativeElement.classList.add('is-valid');
      } else {
        this.password.nativeElement.classList.remove('is-valid');
      }
    });
  }

  ngAfterViewInit(): void {
    let remeberData: any = localStorage.getItem('remeberData');
    remeberData = JSON.parse(remeberData);
    if (remeberData && remeberData.rememberMe) {
      this.email.nativeElement.classList.add('is-valid');
      this.password.nativeElement.classList.add('is-valid');
    }
  }
  

  // Login user
  login() {
    
    if(this.loginForm.valid) {

      this.showLoader();

      if (this.loginForm.controls.remember.value) {
        let remeberData = {
          'email': this.loginForm.controls.email.value,
          'password': this.loginForm.controls.password.value,
          'rememberMe': this.loginForm.controls.remember.value
        }
        localStorage.setItem('remeberData', JSON.stringify(remeberData));
      } else {
        localStorage.removeItem('remeberData');
      }

      let data = this.loginForm.value;
      let email = data.email;
      let pass = data.password;

      this.authService.doLogin(email,pass).subscribe((res:any) => {
       
        if(res.status) {      
          this.hideLoader();    
          // sessionStorage.setItem ('user_id', res.user_id);
          sessionStorage.setItem ('user_name', email);
          sessionStorage.setItem ('token', res.token);          
          this.router.navigate(['/dashboard']);
          this.loginForm.reset();
        } else {
          this.hideLoader();
          this.msg = res.message;
          console.log(this.msg,'msg');
        }
      });
    }
  }

  // show loader 
  showLoader() {
    this.loader.nativeElement.style.display = 'block';
  }

  // hide loader
  hideLoader() {
    this.loader.nativeElement.style.display = 'none';
  }

}
