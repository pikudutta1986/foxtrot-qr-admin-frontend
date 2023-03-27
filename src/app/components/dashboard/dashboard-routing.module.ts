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
