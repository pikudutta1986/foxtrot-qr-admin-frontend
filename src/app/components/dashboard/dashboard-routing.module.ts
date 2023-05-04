import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CreatePlanComponent } from './create-plan/create-plan.component';
import { DashboardComponent } from './dashboard.component';
import { EditPlanComponent } from './edit-plan/edit-plan.component';
import { PaymentsComponent } from './payments/payments.component';
import { PlansComponent } from './plans/plans.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { PricingComponent } from './pricing/pricing.component';
import { EditPricingComponent } from './edit-pricing/edit-pricing.component';
import { CreatePricingComponent } from './create-pricing/create-pricing.component';

const routes: Routes = [
  { 
    path: '', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'payments', component: PaymentsComponent
      },
      {
        path: 'plans', component: PlansComponent
      },
      {
        path: 'plans/create-plan', component: CreatePlanComponent
      },
      {
        path: 'plans/edit/:id', component: EditPlanComponent
      },
      {
        path: 'pricing', component: PricingComponent
      },
      {
        path: 'pricing/create-pricing', component: CreatePricingComponent
      },
      {
        path: 'pricing/edit/:id', component: EditPricingComponent
      },
      {
        path: 'analytics', component: AnalyticsComponent
      },
      {
        path: 'settings', component: SettingsComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
