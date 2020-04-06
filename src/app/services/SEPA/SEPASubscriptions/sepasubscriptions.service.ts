import { Injectable } from '@angular/core';
import { jsap } from './../jsap';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { List } from 'immutable';
import { IObservation, IMapPlace } from '../queryResults.model';
import { IQueryResult } from '../sepa.model';

declare const Sepajs: any; // Global variable defined in src/assets/sepa.js

@Injectable({
  providedIn: 'root'
})
export class SEPASubscriptionsService {
  private prefixes: string;
  private sepa: any;
  private bench: any;

  // <http://covid19/observation> dataset
  private covid19Observations: List<IObservation>;
  private COVID19_OBSERVATIONS: Subject<List<IObservation>>;
  covid19Observations$: Observable<List<IObservation>>;

  // <http://istat/demographics> dataset
  private istatObservations: List<IObservation>;
  private ISTAT_OBSERVATIONS: Subject<List<IObservation>>;
  istatObservations$: Observable<List<IObservation>>;

  // <http://covid19/context> dataset
  private places: List<IMapPlace>;
  private PLACES: Subject<List<IMapPlace>>;
  places$: Observable<List<IMapPlace>>;

  constructor() {
    this.prefixes = '';

    // tslint:disable-next-line: forin
    for (const ns in jsap.namespaces) {
      this.prefixes += ' PREFIX ' + ns + ':<' + jsap.namespaces[ns] + '>';
    }

    this.sepa = Sepajs.client;
    this.bench = new Sepajs.bench();

    // <http://covid19/observation> dataset
    this.covid19Observations = List<IObservation>(); // empty list
    this.COVID19_OBSERVATIONS = new BehaviorSubject<List<IObservation>>(
      this.covid19Observations
    );
    this.covid19Observations$ = this.COVID19_OBSERVATIONS.asObservable();

    // <http://istat/demographics> dataset
    this.istatObservations = List<IObservation>(); // empty list
    this.ISTAT_OBSERVATIONS = new BehaviorSubject<List<IObservation>>(
      this.istatObservations
    );
    this.istatObservations$ = this.ISTAT_OBSERVATIONS.asObservable();

    // <http://covid19/context> dataset
    this.places = List<IMapPlace>(); // empty list
    this.PLACES = new BehaviorSubject<List<IMapPlace>>(this.places);
    this.places$ = this.PLACES.asObservable();
  }

  subscribe() {
    let query: string =
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
    subscription.on('added', (addedResults: IQueryResult<IObservation>) => {
      if (addedResults?.results?.bindings) {
        this.onCovid19Observations(addedResults.results.bindings);
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
    subscription.on('added', (addedResults: IQueryResult<IObservation>) => {
      if (addedResults?.results?.bindings) {
        this.onIstatObservations(addedResults.results.bindings);
      }
    });

    query = this.prefixes + ' ' + jsap.queries.MAP_PLACES.sparql;

    subscription = this.sepa.subscribe(query, jsap);
    subscription.on('added', (addedResults: IQueryResult<IMapPlace>) => {
      if (addedResults?.results?.bindings) {
        this.onAddedPlaces(addedResults.results.bindings);
      }
    });
    subscription.on('removed', (removedResults: IQueryResult<IMapPlace>) => {
      if (removedResults?.results?.bindings) {
        this.onRemovedPlaces(removedResults.results.bindings);
      }
    });
  }

  private onCovid19Observations(bindings: IObservation[]) {
    // Update the array
    for (const observation of bindings) {
      const index: number = this.covid19Observations.findIndex(
        (value: IObservation) => {
          return observation.observation === value.observation;
        }
      );
      if (index === -1) {
        this.covid19Observations = this.covid19Observations.push(observation);
      } else {
        this.covid19Observations = this.covid19Observations.set(
          index,
          observation
        );
      }
    }
    // Notify subscribers
    this.COVID19_OBSERVATIONS.next(this.covid19Observations);
  }

  private onIstatObservations(bindings: IObservation[]) {
    // Update the array
    for (const observation of bindings) {
      const index: number = this.istatObservations.findIndex((value: IObservation) => {
        return observation.observation === value.observation;
      });
      if (index === -1) {
        this.istatObservations = this.istatObservations.push(observation);
      } else {
        this.istatObservations = this.istatObservations.set(index, observation);
      }
    }
    // Notify subscribers
    this.ISTAT_OBSERVATIONS.next(this.istatObservations);
  }

  private onAddedPlaces(bindings: IMapPlace[]) {
    // Update the array
    for (const place of bindings) {
      const index: number = this.places.findIndex((value: IMapPlace) => {
        return place.place === value.place;
      });
      if (index === -1) {
        this.places = this.places.push(place);
      } else {
        this.places = this.places.set(index, place);
      }
    }
    // Notify subscribers
    this.PLACES.next(this.places);
  }

  private onRemovedPlaces(bindings: IMapPlace[]) {
    // Update the array
    for (const place of bindings) {
      const index: number = this.places.findIndex((value: IMapPlace) => {
        return place.place === value.place;
      });
      if (index !== -1) {
        this.places = this.places.delete(index);
      }
    }
    // Notify subscribers
    this.PLACES.next(this.places);
  }
}
