import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { 
    path: '', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'users', component: UsersComponent
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
