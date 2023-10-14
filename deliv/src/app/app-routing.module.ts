import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';

import { DeliveryDetailsComponent } from './pages/delivery-details/delivery-details.component';
import { PackageDetailsComponent } from './pages/package-details/package-details.component';


const routes: Routes = [
  {
    "path": '',
    "component": HomeComponent
  },
  {
    "path": 'login',
    "component": LoginComponent
  },
  {
    "path": 'register',
    "component": RegisterComponent
  },


  {
    "path": 'driver',
    "component": DeliveryDetailsComponent
  },

  { path: 'package/:id', component: PackageDetailsComponent },

  {
    "path": "not-found",
    "component": NotFoundComponent,
    canActivate: [AuthGuard]
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
