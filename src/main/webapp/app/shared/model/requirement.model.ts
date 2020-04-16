import { IJob } from 'app/shared/model/job.model';

export interface IRequirement {
  id?: number;
  requirementName?: string;
  job?: IJob;
}

export class Requirement implements IRequirement {
  constructor(public id?: number, public requirementName?: string, public job?: IJob) {}
}
