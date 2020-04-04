import { CommonModule } from '@angular/common';
export interface IGraphData {
  type: string;
  datatype?: string;
  value: any;
}

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

export interface IPlace {
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
