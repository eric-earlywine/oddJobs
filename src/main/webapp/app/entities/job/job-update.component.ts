import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IJob, Job } from 'app/shared/model/job.model';
import { JobService } from './job.service';
import { TagService } from 'app/entities/tag/tag.service';
import { IJobDetails } from 'app/shared/model/job-details.model';
import { ITag, Tag } from 'app/shared/model/tag.model';
import { JobDetailsService } from 'app/entities/job-details/job-details.service';
import { INewUser } from 'app/shared/model/new-user.model';
import { NewUserService } from 'app/entities/new-user/new-user.service';

type SelectableEntity = IJobDetails | INewUser;

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
  styleUrls: ['job-update.scss']
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;
  isMakingTag = false;
  reqExists = false;
  jobdetails: IJobDetails[] = [];
  newusers: INewUser[] = [];
  jobReqs: string[] = [];
  jobTags: Tag[] = [];
  editForm = this.fb.group({
    id: [],
    jobName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    payType: ['', [Validators.required]],
    payAmt: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]],
    jobDesc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(280)]],
    jobReq: ['', [Validators.minLength(3), Validators.maxLength(80)]],
    jobLocation: ['', [Validators.required]],
    jobTag: ['', [Validators.maxLength(15)]]
  });
  constructor(
    protected jobService: JobService,
    protected jobDetailsService: JobDetailsService,
    protected newUserService: NewUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected tagService: TagService
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
      jobDesc: job.jobDesc,
      jobLocation: job.location
    });
    this.jobReqs = job.jobReqs ? job.jobReqs : [];
    this.jobTags = job.jobTags ? job.jobTags : [];
  }
  addReq(): void {
    if (this.editForm.get(['jobReq'])!.value !== '' && this.editForm.get(['jobReq'])!.valid) {
      if (this.jobReqs.includes(this.editForm.get(['jobReq'])!.value)) {
        this.reqExists = true;
      } else {
        this.reqExists = false;
        this.jobReqs.push(this.editForm.get(['jobReq'])!.value);
      }
    }
    this.editForm.patchValue({
      jobReq: ''
    });
  }
  remReq(req: string): void {
    this.jobReqs.splice(this.jobReqs.indexOf(req), 1);
  }
  clearReq(): void {
    this.jobReqs = [];
  }
  checkForTag(): void {
    const tag = this.editForm.get(['jobTag']);
    if (tag!.value !== '' && tag!.valid) {
      if (!this.jobTags.includes(tag!.value)) {
        this.tagService
          .findByTagName(tag!.value)
          .pipe(
            map((res: HttpResponse<ITag>) => {
              return res.body;
            })
          )
          .subscribe(
            (resBody: ITag | null) => {
              if (resBody != null) {
                this.addTag(resBody);
              } else {
                this.createTag(tag!.value);
              }
            },
            () => this.createTag(tag!.value)
          );
      }
    }
  }
  addTag(tag: Tag): void {
    this.jobTags.push(tag);
    this.editForm.patchValue({
      jobTag: ''
    });
  }
  createTag(tag: string): void {
    const newTag = this.createTagPlease(tag);
    this.subscribeToTagResponse(this.tagService.create(newTag));
  }
  remTag(tag: Tag): void {
    this.jobTags.splice(this.jobTags.indexOf(tag), 1);
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
      jobDesc: this.editForm.get(['jobDesc'])!.value,
      jobReqs: this.jobReqs,
      location: this.editForm.get(['jobLocation'])!.value,
      jobTags: this.jobTags
    };
  }
  private createTagPlease(tag: string): ITag {
    return {
      ...new Tag(),
      id: undefined,
      tagName: tag
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }
  protected subscribeToTagResponse(result: Observable<HttpResponse<ITag>>): void {
    result.subscribe(
      () => {
        this.onTagSuccess();
        this.checkForTag();
      },
      () => this.onTagError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  protected onTagSuccess(): void {
    this.isMakingTag = false;
  }

  protected onTagError(): void {
    this.isMakingTag = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
