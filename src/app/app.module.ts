import { SEPASubscriptionsService } from './services/SEPA/SEPASubscriptions/sepasubscriptions.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    SEPASubscriptionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
