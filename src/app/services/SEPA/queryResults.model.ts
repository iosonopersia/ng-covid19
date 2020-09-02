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
  name: IGraphData;
  lat: IGraphData;
  lon: IGraphData;
  totalCases: IGraphData;
  dailyPositiveCases: IGraphData;
}

export interface ITree<T> {
  node: T;
  children: ITree<T>[];
}

export interface IPlaceNode {
  placeURI: string;
  placeLabel: string;
}

export type IPlaceTree = ITree<IPlaceNode>;

// Query: HISTORY
export interface IHistory {
  a: IGraphData;
  timestamp: IGraphData;
  res: IGraphData;
  type: IGraphData;
  unit: IGraphData;
  value: IGraphData;
}

export interface IProperty {
  propertyURI: string;
  propertyLabel: string;
}
