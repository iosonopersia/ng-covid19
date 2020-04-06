import { IGraphData } from './sepa.model';

// Query: OBSERVATIONS
export interface IObservation {
  observation: IGraphData;
  place: IGraphData;
  timestamp: IGraphData;
  result: IGraphData;
  property: IGraphData;
  unit: IGraphData;
  value: IGraphData;
  label: IGraphData;
  name: IGraphData;
  lat: IGraphData;
  lon: IGraphData;
  symbol: IGraphData;
}

// Query: CONTAINED_PLACES
export interface IContainedPlace {
  child: IGraphData;
  name: IGraphData;
  numOfChildren: IGraphData;
}

// Query: MAP_PLACES
export interface IMapPlace {
  place: IGraphData;
  code: IGraphData;
  class: IGraphData;
  name: IGraphData;
  lat: IGraphData;
  lon: IGraphData;
  obs: IGraphData;
  res: IGraphData;
  cases: IGraphData;
}
