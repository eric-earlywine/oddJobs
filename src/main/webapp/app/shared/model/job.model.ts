import { ILocation } from 'app/shared/model/location.model';
import { INewUser } from 'app/shared/model/new-user.model';
import { PayType } from 'app/shared/model/enumerations/pay-type.model';
import { ITag } from 'app/shared/model/tag.model';
import { IRequirement } from 'app/shared/model/requirement.model';

export interface IJob {
  id?: number;
  jobName?: string;
  payType?: PayType;
  payAmt?: number;
  jobDesc?: string;
  locations?: ILocation[];
  newUser?: INewUser;
  jobReqs?: IRequirement[];
  jobLocation?: string;
  jobTags?: ITag[];
}

export class Job implements IJob {
  constructor(
    public id?: number,
    public jobName?: string,
    public payType?: PayType,
    public payAmt?: number,
    public jobDesc?: string,
    public locations?: ILocation[],
    public newUser?: INewUser,
    public jobReqs?: IRequirement[],
    public jobLocation?: string,
    public jobTags?: ITag[]
  ) {}
}
