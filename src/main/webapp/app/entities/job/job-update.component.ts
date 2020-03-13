import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IJob, Job } from 'app/shared/model/job.model';
import { JobService } from './job.service';
import { IJobDetails } from 'app/shared/model/job-details.model';
import { JobDetailsService } from 'app/entities/job-details/job-details.service';
import { INewUser } from 'app/shared/model/new-user.model';
import { NewUserService } from 'app/entities/new-user/new-user.service';

type SelectableEntity = IJobDetails | INewUser;

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html'
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;
  jobdetails: IJobDetails[] = [];
  newusers: INewUser[] = [];

  editForm = this.fb.group({
    id: [],
    jobName: [],
    payType: [],
    payAmt: [],
    jobDetails: [],
    newUser: []
  });

  constructor(
    protected jobService: JobService,
    protected jobDetailsService: JobDetailsService,
    protected newUserService: NewUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.updateForm(job);

      this.jobDetailsService
        .query({ filter: 'job-is-null' })
        .pipe(
          map((res: HttpResponse<IJobDetails[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IJobDetails[]) => {
          if (!job.jobDetails || !job.jobDetails.id) {
            this.jobdetails = resBody;
          } else {
            this.jobDetailsService
              .find(job.jobDetails.id)
              .pipe(
                map((subRes: HttpResponse<IJobDetails>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IJobDetails[]) => (this.jobdetails = concatRes));
          }
        });

      this.newUserService.query().subscribe((res: HttpResponse<INewUser[]>) => (this.newusers = res.body || []));
    });
  }

  updateForm(job: IJob): void {
    this.editForm.patchValue({
      id: job.id,
      jobName: job.jobName,
      payType: job.payType,
      payAmt: job.payAmt,
      jobDetails: job.jobDetails,
      newUser: job.newUser
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const job = this.createFromForm();
    if (job.id !== undefined) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  private createFromForm(): IJob {
    return {
      ...new Job(),
      id: this.editForm.get(['id'])!.value,
      jobName: this.editForm.get(['jobName'])!.value,
      payType: this.editForm.get(['payType'])!.value,
      payAmt: this.editForm.get(['payAmt'])!.value,
      jobDetails: this.editForm.get(['jobDetails'])!.value,
      newUser: this.editForm.get(['newUser'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
