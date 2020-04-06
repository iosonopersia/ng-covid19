export interface IGraphData {
  type: string;
  datatype?: string;
  value: any;
}

export interface IQueryResult<T> {
  head: {
    link: [];
    vars: string[];
  };
  results: {
    distinct: boolean;
    ordered: boolean;
    bindings: T[];
  };
}

// export interface ISubscriptionResult<T> {

// }
