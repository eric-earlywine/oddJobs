import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJob } from 'app/shared/model/job.model';
import { IUser, User } from 'app/core/user/user.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/core/user/user.service';
import { JobService } from 'app/entities/job/job.service';
import { JobFulfilledComponent } from 'app/entities/job/job-fulfilled.component';

@Component({
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['job-update.scss']
})
export class JobDetailComponent implements OnInit {
  job: IJob | null = null;
  user: IUser = new User();
  isRequesting = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected userService: UserService,
    protected jobService: JobService,
    protected modalService: NgbModal
  ) {}

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
  requestJob(job: IJob): void {
    if (job.requestUsers === undefined) {
      job.requestUsers = [];
    }
    if (!this.isRequesting) {
      job.requestUsers.push(this.user);
      this.subscribeToRequestResponse(this.jobService.update(job));
    }
  }
  remRequestJob(job: IJob): void {
    if (job.requestUsers !== undefined && !this.isRequesting) {
      job.requestUsers.splice(job.requestUsers.indexOf(job), 1);
      this.subscribeToRequestResponse(this.jobService.update(job));
    }
  }
  protected subscribeToRequestResponse(result: Observable<HttpResponse<IJob>>): void {
    result
      .pipe(
        map((res: HttpResponse<IJob>) => {
          return res.body;
        })
      )
      .subscribe((resBody: IJob | null) => {
        if (resBody != null) {
          this.isRequesting = false;
        }
      });
  }
  fulfill(job: IJob): void {
    const modalRef = this.modalService.open(JobFulfilledComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.job = job;
  }
  isNotRequested(job: IJob): boolean {
    if (job.requestUsers !== undefined) {
      for (const user of job.requestUsers) {
        if (user.id === this.user.id) {
          return false;
        }
      }
    }
    return true;
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
