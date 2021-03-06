import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { QueryComponent } from './pages/query/query.component';
import { HelpComponent } from './pages/help/help.component';
import { SupersetComponent } from './pages/superset/superset.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'query', component: QueryComponent },
  { path: 'help', component: HelpComponent },
  {
    path: 'covidFree',
    component: SupersetComponent,
    data: { dashboardName: 'covidFreeDashboard' },
  },
  {
    path: 'airQuality',
    component: SupersetComponent,
    data: { dashboardName: 'airQualityDashboard' },
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
