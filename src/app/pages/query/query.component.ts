import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import { jsapQuery } from 'src/app/services/SEPA/jsapQuery';
declare const Yasqe: any;
declare const Yasr: any;
declare const Yasgui: any;
declare const Sepajs: any; // Global variable defined in src/assets/sepa.js

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.css'],
})
export class QueryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('yasqe', { static: true }) private editorRef: ElementRef;
  @ViewChild('yasr', { static: true }) private viewerRef: ElementRef;
  private queryEditor: any;
  private resultsViewer: any;
  private prefixes: string;
  queries: any[];
  constructor() {
    this.queries = [];
    this.prefixes = '';
    // tslint:disable-next-line: forin
    for (const ns in jsapQuery.namespaces) {
      this.prefixes += ' PREFIX ' + ns + ':<' + jsapQuery.namespaces[ns] + '>\n';
    }
  }

  ngAfterViewInit(): void {
    this.queryEditor = new Yasqe(this.editorRef.nativeElement);
    this.resultsViewer = new Yasr(this.viewerRef.nativeElement);

    // window['queryEditor'] = this.queryEditor;
    // window['resultsViewer'] = this.resultsViewer;

    this.queryEditor.queryBtn.removeAllListeners();
    this.queryEditor.queryBtn.addEventListener('click', () =>
      this.executeQuery()
    );

    const queryNameArray = Object.getOwnPropertyNames(jsapQuery.queries);
    for (const queryName of queryNameArray) {
      this.queries.push({
        name: queryName,
        sparql: jsapQuery.queries[queryName]['sparql'],
      });
    }
  }

  onClick(sparql: string) {
    this.queryEditor.setValue(this.prefixes + '\n' + sparql);
    this.queryEditor.autoformat();
    //
    this.queryEditor.collapsePrefixes(true);
    this.queryEditor.collapsePrefixes(true);
    this.queryEditor.collapsePrefixes(true);
  }

  private executeQuery() {
    const queryText = this.queryEditor.getValue();
    const sepa = Sepajs.client;

    const start = Date.now();
    sepa.query(queryText, jsapQuery).then((data) => {
      this.resultsViewer.setResponse({
        data: JSON.stringify(data),
        contentType: 'application/sparql-results+json',
        status: 200,
        executionTime: Date.now() - start,
      });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.queryEditor.queryBtn.removeAllListeners();
    window['__zone_symbol__hashchangefalse'].pop(); // this ""should"" delete the listener added by Yasqe index.ts:103
  }
}
