import { IJob } from 'app/shared/model/job.model';

export interface ILocation {
  id?: number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  stateProvince?: string;
  job?: IJob;
}

export class Location implements ILocation {
  constructor(
    public id?: number,
    public streetAddress?: string,
    public postalCode?: string,
    public city?: string,
    public stateProvince?: string,
    public job?: IJob
  ) {}
}
