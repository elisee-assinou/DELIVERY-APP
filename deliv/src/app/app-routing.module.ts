import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';

import { DeliveryDetailsComponent } from './pages/delivery-details/delivery-details.component';
import { PackageDetailsComponent } from './pages/package-details/package-details.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminService } from './services/admin/admin.service';

const routes: Routes = [
  {
    "path": '',
    "component": LoginComponent
  },
  {
    "path": 'login',
    "component": LoginComponent
  },
  {
    "path": 'admin',
    "component": AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    "path": 'client',
    "component": PackageDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    "path": 'register',
    "component": RegisterComponent
  },


  {
    "path": 'driver',
    "component": DeliveryDetailsComponent,
    canActivate: [AuthGuard]
  },



  {
    "path": "not-found",
    "component": NotFoundComponent,
  },
  {
    "path": "**",
    redirectTo: "/not-found"
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
