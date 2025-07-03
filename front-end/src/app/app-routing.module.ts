import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./dashboard/home/home.component";
import {MainLayoutComponent} from "./layout/main-layout/main-layout.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {LoginComponent} from "./auth/login/login.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: "house",
        loadChildren: () => import('./house/house.module').then(m => m.HouseModule),
        canActivate: [AuthGuard],
      },
      {
        path: "volunteer",
        loadChildren: () => import('./volunteer/volunteer.module').then(m => m.VolunteerModule),
        canActivate: [AuthGuard],
      },
      {
        path: "festival",
        loadChildren: () => import('./festival/festival.module').then(m => m.FestivalModule),
        canActivate: [AuthGuard],
      },
      {
        path: "fund",
        loadChildren: () => import('./fund/fund.module').then(m => m.FundModule),
        canActivate: [AuthGuard],
      }
    ],
  },
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
