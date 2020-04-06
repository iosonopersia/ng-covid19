import { IQueryResult } from './../sepa.model';
import { Injectable } from '@angular/core';
import { jsap } from '../jsap';
import { List } from 'immutable';
import { IContainedPlace } from '../queryResults.model';

declare const Sepajs: any; // Global variable defined in src/assets/sepa.js

export interface IPlaceTree {
  placeURI: string;
  placeName: string;
  children: IPlaceTree[];
}

@Injectable({
  providedIn: 'root',
})
export class SEPAQueriesService {
  private prefixes: string;
  private sepa: any;
  private bench: any;

  constructor() {
    this.prefixes = '';

    // tslint:disable-next-line: forin
    for (const ns in jsap.namespaces) {
      this.prefixes += ' PREFIX ' + ns + ':<' + jsap.namespaces[ns] + '>';
    }

    this.sepa = Sepajs.client;
    this.bench = new Sepajs.bench();
  }

  queryHistory(
    place: string,
    property: string,
    from: string,
    to: string
  ): Promise<any> {
    const query: string =
      this.prefixes +
      ' ' +
      this.bench.sparql(jsap.queries.HISTORY.sparql, {
        from: {
          type: 'DateTime',
          value: '\'' + from + '\'^^xsd:dateTime',
        },
        to: {
          type: 'DateTime',
          value: '\'' + to + '\'^^xsd:dateTime',
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

    return this.sepa.query(query, jsap).then((data) => {
      return data;
    });
  }

  queryPlaceTree(placeURI: string, placeName: string): Promise<IPlaceTree> {
    const tree: IPlaceTree = {
      placeURI,
      placeName,
      children: [],
    };

    // We return a Promise which, when resolved, will return
    // a reference to the 'tree' object from thisf local context.
    return this.queryPlaceChildren(placeURI, tree.children).then(() => {
      console.log(tree);
      return tree;
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
     * 3) then we populate placeURI and placeName fields of every child node;
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
            placeURI: place.child.value,
            placeName: place.name.value,
            children: [],
          };
          childrenNodes.push(child);

          // STEP 4)
          const numOfChildren: number = parseInt(place.numOfChildren.value, 10);
          if (numOfChildren > 0) {
            promises.push(
              this.queryPlaceChildren(child.placeURI, child.children)
            );
          }
        }

        // STEP 5)
        return Promise.all(promises);
      });
  }
}
