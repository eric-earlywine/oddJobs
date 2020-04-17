import { IJob } from 'app/shared/model/job.model';

export interface IExtendedUser {
  id?: number;
  jobs?: IJob[];
}

export class ExtendedUser implements IExtendedUser {
  constructor(public id?: number, public jobs?: IJob[]) {}
}
