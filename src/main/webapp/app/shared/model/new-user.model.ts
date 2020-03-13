import { IUserDetails } from 'app/shared/model/user-details.model';
import { IJob } from 'app/shared/model/job.model';

export interface INewUser {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  userDetails?: IUserDetails;
  jobs?: IJob[];
}

export class NewUser implements INewUser {
  constructor(
    public id?: number,
    public username?: string,
    public password?: string,
    public email?: string,
    public userDetails?: IUserDetails,
    public jobs?: IJob[]
  ) {}
}
