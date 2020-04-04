import { IObservation, IPlace } from './../sepa.model';
import { Injectable } from '@angular/core';
import { jsap } from './../jsap';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

declare const Sepajs: any; // Global variable defined in src/assets/sepa.js

@Injectable({
  providedIn: 'root'
})
export class SEPASubscriptionsService {
  private prefixes: string;
  private sepa: any;
  private bench: any;

  // <http://covid19/observation> dataset
  private covid19Observations: IObservation[];
  private COVID19_OBSERVATIONS: Subject<IObservation[]>;
  covid19Observations$: Observable<IObservation[]>;

  // <http://istat/demographics> dataset
  private istatObservations: IObservation[];
  private ISTAT_OBSERVATIONS: Subject<IObservation[]>;
  istatObservations$: Observable<IObservation[]>;

  // <http://covid19/context> dataset
  private places: IPlace[];
  private PLACES: Subject<IPlace[]>;
  places$: Observable<IPlace[]>;

  constructor() {
    this.prefixes = '';

    // tslint:disable-next-line: forin
    for (const ns in jsap.namespaces) {
      this.prefixes += ' PREFIX ' + ns + ':<' + jsap.namespaces[ns] + '>';
    }

    this.sepa = Sepajs.client;
    this.bench = new Sepajs.bench();

    // <http://covid19/observation> dataset
    this.covid19Observations = [];
    this.COVID19_OBSERVATIONS = new BehaviorSubject<IObservation[]>(
      this.covid19Observations
    );
    this.covid19Observations$ = this.COVID19_OBSERVATIONS.asObservable();

    // <http://istat/demographics> dataset
    this.istatObservations = [];
    this.ISTAT_OBSERVATIONS = new BehaviorSubject<IObservation[]>(
      this.istatObservations
    );
    this.istatObservations$ = this.ISTAT_OBSERVATIONS.asObservable();

    // <http://covid19/context> dataset
    this.places = [];
    this.PLACES = new BehaviorSubject<IPlace[]>(this.places);
    this.places$ = this.PLACES.asObservable();
  }

  subscribe() {
    let query =
      this.prefixes +
      ' ' +
      this.bench.sparql(jsap.queries.OBSERVATIONS.sparql, {
        qudtGraph: {
          type: 'uri',
          value: 'http://localhost:8890/DAV'
        },
        obsGraph: {
          type: 'uri',
          value: 'http://covid19/observation'
        },
        proGraph: {
          type: 'uri',
          value: 'http://covid19/observation/context'
        },
        ctxGraph: {
          type: 'uri',
          value: 'http://covid19/context'
        }
      });

    let subscription = this.sepa.subscribe(query, jsap);
    subscription.on('added', addedResults => {
      if (addedResults?.results?.bindings) {
        this.onObservations('covid19', addedResults.results.bindings);
      }
    });

    query =
      this.prefixes +
      ' ' +
      this.bench.sparql(jsap.queries.OBSERVATIONS.sparql, {
        qudtGraph: {
          type: 'uri',
          value: 'http://localhost:8890/DAV'
        },
        obsGraph: {
          type: 'uri',
          value: 'http://istat/demographics'
        },
        proGraph: {
          type: 'uri',
          value: 'http://istat/demographics/context'
        },
        ctxGraph: {
          type: 'uri',
          value: 'http://covid19/context'
        }
      });

    subscription = this.sepa.subscribe(query, jsap);
    subscription.on('added', addedResults => {
      if (addedResults?.results?.bindings) {
        this.onObservations('istat', addedResults.results.binding);
      }
    });

    query = this.prefixes + ' ' + jsap.queries.MAP_PLACES.sparql;

    subscription = this.sepa.subscribe(query, jsap);
    subscription.on('added', addedResults => {
      if (addedResults?.results?.bindings) {
        this.onAddedPlaces(addedResults.results.bindings);
      }
    });
    subscription.on('removed', removedResults => {
      if (removedResults?.results?.bindings) {
        this.onRemovedPlaces(removedResults.results.bindings);
      }
    });
  }

  private onObservations(dataset: string, bindings: IObservation[]) {
    const observationsArray = dataset.toLowerCase() + 'Observations';
    const subject = dataset.toUpperCase() + '_OBSERVATIONS';

    if (!this[observationsArray + 'Observations'] || !this[subject + '_OBSERVATIONS']) {
      throw new Error('Supplied dataset does not exist!');
    }

    // Update the array
    for (const observation of bindings) {
      const index = this[observationsArray].findIndex(
        (value: IObservation) => {
          return observation.observation === value.observation;
        }
      );
      if (index === -1) {
        this[observationsArray].push(observation);
      } else {
        this[observationsArray][index] = observation;
      }
    }
    // Notify subscribers
    this[subject].next(this.covid19Observations);
  }

  private onAddedPlaces(bindings: IPlace[]) {
    // Update the array
    for (const place of bindings) {
      const index = this.places.findIndex(
        (value: IPlace) => {
          return place.place === value.place;
        }
      );
      if (index === -1) {
        this.places.push(place);
      } else {
        this.places[index] = place;
      }
    }
    // Notify subscribers
    this.PLACES.next(this.places);
  }

  private onRemovedPlaces(bindings: IPlace[]) {
    // Update the array
    for (const place of bindings) {
      const index = this.places.findIndex(
        (value: IPlace) => {
          return place.place === value.place;
        }
      );
      if (index !== -1) {
        this.places.splice(index, 1);
      }
    }
    // Notify subscribers
    this.PLACES.next(this.places);
  }
}
