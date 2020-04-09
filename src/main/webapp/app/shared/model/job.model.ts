import { IJobDetails } from 'app/shared/model/job-details.model';
import { ILocation } from 'app/shared/model/location.model';
import { INewUser } from 'app/shared/model/new-user.model';
import { PayType } from 'app/shared/model/enumerations/pay-type.model';

export interface IJob {
  id?: number;
  jobName?: string;
  payType?: PayType;
  payAmt?: number;
  jobDetails?: IJobDetails;
  jobDesc?: string;
  locations?: ILocation[];
  newUser?: INewUser;
  jobReqs?: string[];
}

export class Job implements IJob {
  constructor(
    public id?: number,
    public jobName?: string,
    public payType?: PayType,
    public payAmt?: number,
    public jobDetails?: IJobDetails,
    public jobDesc?: string,
    public locations?: ILocation[],
    public newUser?: INewUser,
    public jobReqs?: string[]
  ) {}
}
