import { ITag } from 'app/shared/model/tag.model';
import { IJob } from 'app/shared/model/job.model';

export interface IJobDetails {
  id?: number;
  difficulty?: string;
  description?: string;
  tags?: ITag[];
  job?: IJob;
}

export class JobDetails implements IJobDetails {
  constructor(public id?: number, public difficulty?: string, public description?: string, public tags?: ITag[], public job?: IJob) {}
}
