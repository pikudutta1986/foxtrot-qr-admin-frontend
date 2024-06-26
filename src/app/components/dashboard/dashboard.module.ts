import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from '../common/sidebar/sidebar.component';
import { HeaderComponent } from '../common/header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { QrComponent } from '../shared/qr/qr.component';
import { QrlistComponent } from './qrlist/qrlist.component';
import { UsersComponent } from './users/users.component';
import { PaymentsComponent } from './payments/payments.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { BarChartComponent } from '../shared/charts/bar-chart/bar-chart.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PlansComponent } from './plans/plans.component';
import { SettingsComponent } from './settings/settings.component';
import { EditPlanComponent } from './edit-plan/edit-plan.component';
import { CreatePlanComponent } from './create-plan/create-plan.component';
import { PricingComponent } from './pricing/pricing.component';
import { EditPricingComponent } from './edit-pricing/edit-pricing.component';
import { CreatePricingComponent } from './create-pricing/create-pricing.component';
import { SiteComponent } from './site/site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { CreateSiteComponent } from './create-site/create-site.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const materialModules = [
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule
  
];

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    QrComponent,
    QrlistComponent,
    UsersComponent,
    PaymentsComponent,
    AnalyticsComponent,
    BarChartComponent,
    PlansComponent,
    SettingsComponent,
    EditPlanComponent,
    CreatePlanComponent,
    PricingComponent,
    EditPricingComponent,
    CreatePricingComponent,
    SiteComponent,
    EditSiteComponent,
    CreateSiteComponent,
    CreateUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ...materialModules,
    FormsModule,
    ReactiveFormsModule    
  ],
  providers: [  
    MatDatepickerModule,  
  ],
})
export class DashboardModule { }
