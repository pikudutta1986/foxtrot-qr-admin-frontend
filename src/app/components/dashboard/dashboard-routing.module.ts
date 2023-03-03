import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { AnalyticsComponent } from './analytics/analytics.component';
import { DashboardComponent } from './dashboard.component';
import { PaymentsComponent } from './payments/payments.component';
import { PlansComponent } from './plans/plans.component';
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
        path: 'analytics', component: AnalyticsComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
