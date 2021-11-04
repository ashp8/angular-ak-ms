import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ManagerComponent, SettingsComponent } from './manager/manager.component';

const routes: Routes = [
  {path:'', component:DashboardComponent, pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'manager', component: ManagerComponent},
  {path:'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
