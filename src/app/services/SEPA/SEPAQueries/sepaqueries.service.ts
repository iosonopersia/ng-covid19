import { IPlaceTree, IHistory } from 'src/app/services/SEPA/queryResults.model';
import { IPlaceNode } from './../queryResults.model';
import { IQueryResult } from './../sepa.model';
import { Injectable } from '@angular/core';
import { jsap } from '../jsap';
import { IContainedPlace } from '../queryResults.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { List } from 'immutable';

declare const Sepajs: any; // Global variable defined in src/assets/sepa.js

@Injectable({
  providedIn: 'root',
})
export class SEPAQueriesService {
  private prefixes: string;
  private sepa: any;
  private bench: any;

  private historyStart: Date = new Date(2020, 1, 24); // 24 febbraio 2020 (la numerazione dei mesi parte da 0)
  private historyEnd: Date = new Date();

  private tree: IPlaceTree;
  placeTree$: Observable<IPlaceTree>;
  private PLACE_TREE: BehaviorSubject<IPlaceTree>;

  private history: List<IHistory>;
  history$: Observable<List<IHistory>>;
  private HISTORY: BehaviorSubject<List<IHistory>>;

  constructor() {
    this.prefixes = '';

    // tslint:disable-next-line: forin
    for (const ns in jsap.namespaces) {
      this.prefixes += ' PREFIX ' + ns + ':<' + jsap.namespaces[ns] + '>';
    }

    this.sepa = Sepajs.client;
    this.bench = new Sepajs.bench();

    this.PLACE_TREE = new BehaviorSubject<IPlaceTree>(null);
    this.placeTree$ = this.PLACE_TREE.asObservable().pipe(filter(tree => tree !== null));

    this.history = List<IHistory>(); // Empty list
    this.HISTORY = new BehaviorSubject<List<IHistory>>(this.history);
    this.history$ = this.HISTORY.asObservable();
  }

  queryHistory(
    place: string,
    property: string
  ) {
    const historyStart = this.historyStart.toISOString();
    const historyEnd = this.historyEnd.toISOString();
    const query: string =
      this.prefixes +
      ' ' +
      this.bench.sparql(jsap.queries.HISTORY.sparql, {
        from: {
          type: 'DateTime',
          value: '\'' + historyStart + '\'^^xsd:dateTime',
        },
        to: {
          type: 'DateTime',
          value: '\'' + historyEnd + '\'^^xsd:dateTime',
        },
        place: {
          type: 'uri',
          value: place,
        },
        property: {
          type: 'uri',
          value: property,
        },
      });

    this.sepa.query(query, jsap).then((data: IQueryResult<IHistory>) => {
      if (!data?.results?.bindings) {
        throw new Error('Data retrieved is not valid');
      }
      this.history = this.history.clear();
      for (const binding of data.results.bindings) {
        this.history = this.history.push(binding);
      }
      this.HISTORY.next(this.history);
    });
  }

  queryPlaceTree(place: IPlaceNode) {
    if (this.tree) {
      return;
    }

    this.tree = {
      node: {
        placeURI: place.placeURI,
        placeLabel: place.placeLabel
      },
      children: [],
    };

    this.queryPlaceChildren(place.placeURI, this.tree.children).then(() => {
      this.PLACE_TREE.next(this.tree);
    });
  }

  private queryPlaceChildren(
    parentNodeURI: string,
    childrenNodes: IPlaceTree[]
  ) {
    /**
     * Here we promise to the caller that 'childrenNodes' array will be completely
     * populated in the future.
     * So we must define how to do it:
     * 1) we return the 'this.sepa.query(...)' Promise;
     * 2) later on, the 'this.sepa.query(...)' Promise is resolved;
     * 3) then we populate placeURI and placeLabel fields of every child node;
     * 4) in order to populate also the 'children' field of every child node
     *    we have to recursively call queryPlaceChildren(), which in turn promises
     *    us to fill that field;
     * 5) now it's necessary to wait for each of the Promises returned by every
     *    queryPlaceChildren() invocation made during step 4) to end;
     * 6) the 'childrenNodes' array is now ready, hence the control passes again
     *    to the caller.
     */
    const query: string =
      this.prefixes +
      ' ' +
      this.bench.sparql(jsap.queries.CONTAINED_PLACES.sparql, {
        root: {
          type: 'uri',
          value: parentNodeURI,
        },
      });

    // STEP 1)
    return this.sepa
      .query(query, jsap)
      .then((data: IQueryResult<IContainedPlace>) => {
        // STEP 2)
        if (!data?.results?.bindings) {
          throw new Error('Data retrieved is not valid');
        }

        const promises = [];

        for (const place of data.results.bindings) {
          // STEP 3)
          const child: IPlaceTree = {
            node: {
              placeURI: place.child.value,
              placeLabel: place.name.value
            },
            children: [],
          };
          childrenNodes.push(child);

          // STEP 4)
          const numOfChildren: number = parseInt(place.numOfChildren.value, 10);
          if (numOfChildren > 0) {
            promises.push(
              this.queryPlaceChildren(child.node.placeURI, child.children)
            );
          }
        }

        // STEP 5)
        return Promise.all(promises);
      });
  }
}
