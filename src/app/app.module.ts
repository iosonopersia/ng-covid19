import { SharedStateService } from './services/SharedState/shared-state.service';
import { SEPAQueriesService } from './services/SEPA/SEPAQueries/sepaqueries.service';
import { SEPASubscriptionsService } from './services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlotComponent } from './components/plot/plot.component';
import { HeaderComponent } from './pages/shared/header/header.component';
import { PageComponent } from './pages/shared/page/page.component';
import { ObservationBadgeComponent } from './components/observation-badge/observation-badge.component';
import { PropertiesCardComponent } from './components/properties-card/properties-card.component';
import { ObservationsComponent } from './components/observations/observations.component';
import { PlacesTreeComponent } from './components/places-tree/places-tree.component';
import { SubscribeComponent } from './pages/dashboard/subscribe/subscribe.component';
import { HelpComponent } from './pages/dashboard/help/help.component';
import { QueryComponent } from './pages/dashboard/query/query.component';
import { LoaderComponent } from './components/loader/loader.component';

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
    DashboardComponent,
    ObservationBadgeComponent,
    PropertiesCardComponent,
    ObservationsComponent,
    PlacesTreeComponent,
    QueryComponent,
    SubscribeComponent,
    HelpComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PlotlyViaWindowModule,
    NgbModule
  ],
  providers: [
    SEPASubscriptionsService,
    SEPAQueriesService,
    SharedStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
