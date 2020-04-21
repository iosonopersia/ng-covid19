import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QueryComponent } from './pages/dashboard/query/query.component';
import { SubscribeComponent } from './pages/dashboard/subscribe/subscribe.component';
import { HelpComponent } from './pages/dashboard/help/help.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'query', pathMatch: 'full' },
      { path: 'query', component: QueryComponent },
      { path: 'subscribe', component: SubscribeComponent },
      { path: 'help', component: HelpComponent },
      { path: '**', redirectTo: 'query', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
