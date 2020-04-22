import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { IJob } from 'app/shared/model/job.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { JobService } from './job.service';
import { JobDeleteDialogComponent } from './job-delete-dialog.component';
import { IUser, User } from 'app/core/user/user.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/core/user/user.service';
import { JobFulfilledComponent } from 'app/entities/job/job-fulfilled.component';

@Component({
  selector: 'jhi-job',
  templateUrl: './job.component.html',
  styleUrls: ['job-update.scss']
})
export class JobComponent implements OnInit, OnDestroy {
  jobs: IJob[];
  otherJobs: IJob[] = [];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;
  viewUserJobs = false;
  viewUserId: number | undefined;
  showFulfilled = false;
  user: IUser = new User();

  constructor(
    protected jobService: JobService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks,
    protected accountService: AccountService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.jobs = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.ascending = false;
  }
  toggleShowFulfilled(): void {
    this.showFulfilled = !this.showFulfilled;
    if (this.showFulfilled) {
      if (this.otherJobs.length > 0) {
        this.jobs = this.jobs.concat(this.otherJobs);
        this.otherJobs = [];
      }
    } else {
      for (let i = 0; i < this.jobs.length; i++) {
        if (this.jobs[i].fulfilled) {
          this.otherJobs.push(this.jobs[i]);
        }
      }
      for (const job of this.otherJobs) {
        if (this.jobs.includes(job)) {
          this.jobs.splice(this.jobs.indexOf(job), 1);
        }
      }
    }
  }
  loadAll(): void {
    this.jobService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IJob[]>) => this.paginateJobs(res.body, res.headers));
  }
  loadUserJobs(id: number): void {
    if (this.jobs.length > 0) {
      if (this.jobs[0].user !== undefined) {
        if (id !== this.jobs[0].user.id) {
          this.jobs = [];
        }
      }
    }
    if (this.viewUserJobs && this.viewUserId === this.user.id) {
      this.jobService
        .findAllByUser(id, {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IJob[]>) => this.paginateJobs(res.body, res.headers));
    } else {
      this.jobService
        .findAllByUserNoFulfilled(id, {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IJob[]>) => this.paginateJobs(res.body, res.headers));
    }
  }

  reset(): void {
    this.page = 0;
    this.jobs = [];
    if (this.viewUserJobs) {
      this.load(this.viewUserId);
    } else {
      this.loadAll();
    }
  }

  loadPage(page: number): void {
    this.page = page;
    if (this.viewUserJobs) {
      this.load(this.viewUserId);
    } else {
      this.loadAll();
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ observeUser }) => {
      if (observeUser.id !== undefined) {
        this.viewUserJobs = true;
        this.viewUserId = observeUser.id;
        this.getCurrentUser();
      } else {
        this.getCurrentUser();
      }
    });
    this.registerChangeInJobs();
  }
  load(id?: number): void {
    if (id) {
      this.loadUserJobs(id);
    } else {
      this.loadAll();
    }
  }
  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    this.jobs = [];
  }

  trackId(index: number, item: IJob): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
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
          if (this.viewUserJobs) {
            this.load(this.viewUserId);
          } else {
            this.load();
          }
        }
      });
    }
  }
  registerChangeInJobs(): void {
    this.eventSubscriber = this.eventManager.subscribe('jobListModification', () => this.reset());
  }

  delete(job: IJob): void {
    const modalRef = this.modalService.open(JobDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.job = job;
  }

  fulfill(job: IJob): void {
    const modalRef = this.modalService.open(JobFulfilledComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.job = job;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  jobsPostedBy(): string {
    if (this.jobs.length > 0) {
      if (this.jobs[0].user !== undefined && this.jobs[0].user.login !== undefined) {
        return this.jobs[0].user.login;
      }
    }
    return 'Unknown';
  }
  protected paginateJobs(data: IJob[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        if (this.showFulfilled) {
          this.jobs.push(data[i]);
        } else {
          if (data[i].fulfilled) {
            this.otherJobs.push(data[i]);
          } else {
            this.jobs.push(data[i]);
          }
        }
      }
    }
  }
}
