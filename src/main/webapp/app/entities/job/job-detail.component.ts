import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJob } from 'app/shared/model/job.model';
import { IUser, User } from 'app/core/user/user.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['job-update.scss']
})
export class JobDetailComponent implements OnInit {
  job: IJob | null = null;
  user: IUser = new User();

  constructor(protected activatedRoute: ActivatedRoute, protected accountService: AccountService, protected userService: UserService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => (this.job = job));
    this.getCurrentUser();
  }
  formatPayType(type: String): String {
    if (type === 'JOBCOMPLETION') {
      return 'On job completion';
    } else if (type === 'HOURLY') {
      return 'Hourly';
    }
    return 'Daily';
  }
  isMyJob(job: IJob): boolean {
    if (job.user !== undefined && job.user.id !== undefined) {
      return this.user.id === job.user.id;
    }
    return false;
  }
  private getCurrentUser(): void {
    if (this.accountService.isAuthenticated()) {
      this.userService.find(this.accountService.getUsername()).subscribe((resBody: IUser | null) => {
        if (resBody != null) {
          this.user = resBody;
        }
      });
    }
  }

  previousState(): void {
    window.history.back();
  }
}
