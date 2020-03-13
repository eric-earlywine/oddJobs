import { IJobDetails } from 'app/shared/model/job-details.model';

export interface ITag {
  id?: number;
  tagName?: string;
  description?: string;
  jobDetails?: IJobDetails[];
}

export class Tag implements ITag {
  constructor(public id?: number, public tagName?: string, public description?: string, public jobDetails?: IJobDetails[]) {}
}
