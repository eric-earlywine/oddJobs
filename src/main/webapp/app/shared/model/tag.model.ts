import { IJob } from 'app/shared/model/job.model';

export interface ITag {
  id?: number;
  tagName?: string;
  jobs?: IJob[];
}

export class Tag implements ITag {
  constructor(public id?: number, public tagName?: string, public jobs?: IJob[]) {}
}
