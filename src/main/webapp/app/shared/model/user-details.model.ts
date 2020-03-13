import { INewUser } from 'app/shared/model/new-user.model';

export interface IUserDetails {
  id?: number;
  profilePicture?: string;
  description?: string;
  rating?: string;
  jobPostings?: number;
  jobCompletions?: number;
  newUser?: INewUser;
}

export class UserDetails implements IUserDetails {
  constructor(
    public id?: number,
    public profilePicture?: string,
    public description?: string,
    public rating?: string,
    public jobPostings?: number,
    public jobCompletions?: number,
    public newUser?: INewUser
  ) {}
}
