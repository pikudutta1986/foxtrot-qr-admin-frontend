import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { HeaderComponent } from '../common/header/header.component';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ]
})
export class LoginModule { }
