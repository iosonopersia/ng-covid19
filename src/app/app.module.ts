import { SEPASubscriptionsService } from './services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlotComponent } from './components/plot/plot.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { PageComponent } from './components/shared/page/page.component';

// La distro 'basic' di plotly mette a disposizione solamente 'scatter', 'bar' e 'pie'
import { PlotlyViaWindowModule } from 'angular-plotly.js';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PlotComponent,
    HeaderComponent,
    PageComponent,
    HomePageComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PlotlyViaWindowModule
  ],
  providers: [
    SEPASubscriptionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
