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
import { ITag, Tag } from 'app/shared/model/tag.model';
import { IRequirement, Requirement } from 'app/shared/model/requirement.model';
import { INewUser } from 'app/shared/model/new-user.model';
import { NewUserService } from 'app/entities/new-user/new-user.service';
import { RequirementService } from 'app/entities/requirement/requirement.service';

type SelectableEntity = INewUser;

@Component({
  selector: 'jhi-job-update',
  templateUrl: './job-update.component.html',
  styleUrls: ['job-update.scss']
})
export class JobUpdateComponent implements OnInit {
  isSaving = false;
  isMakingTag = false;
  reqExists = false;
  editing = false;
  newusers: INewUser[] = [];
  jobReqs: IRequirement[] = [];
  jobTags: Tag[] = [];
  newTags: Tag[] = [];
  job: IJob = new Job();
  editForm = this.fb.group({
    id: [],
    jobName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    payType: ['', [Validators.required]],
    payAmt: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]],
    jobDesc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(280)]],
    jobReq: ['', [Validators.minLength(3), Validators.maxLength(80)]],
    jobLocation: ['', [Validators.required]],
    jobTag: ['', [Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9 ]*$')]]
  });
  constructor(
    protected jobService: JobService,
    protected newUserService: NewUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    protected tagService: TagService,
    protected requirementService: RequirementService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => {
      this.updateForm(job);
      if (job.id !== undefined) {
        this.editing = true;
        this.requirementService
          .findByJobId(job.id)
          .pipe(
            map((res: HttpResponse<IRequirement[]>) => {
              return res.body;
            })
          )
          .subscribe((resBody: IRequirement[] | null) => {
            if (resBody != null) {
              this.jobReqs = resBody;
            }
          });
        this.tagService
          .findByJobId(job.id)
          .pipe(
            map((res: HttpResponse<ITag[]>) => {
              return res.body;
            })
          )
          .subscribe((resBody: ITag[] | null) => {
            if (resBody != null) {
              this.jobTags = resBody;
            }
          });
      }
    });
  }

  updateForm(job: IJob): void {
    this.job = job;
    this.editForm.patchValue({
      id: job.id,
      jobName: job.jobName,
      payType: job.payType,
      payAmt: job.payAmt,
      jobDesc: job.jobDesc,
      jobLocation: job.jobLocation
    });
    this.jobTags = job.jobTags ? job.jobTags : [];
  }
  addReq(): void {
    if (this.editForm.get(['jobReq'])!.value !== '' && this.editForm.get(['jobReq'])!.valid) {
      this.reqExists = false;
      for (let i = 0; i < this.jobReqs.length; i++) {
        // eslint-disable-next-line eqeqeq
        if (this.jobReqs[i].requirementName == this.editForm.get(['jobReq'])!.value) {
          this.reqExists = true;
          break;
        }
      }
      if (this.reqExists === false) {
        const newReq = this.formatReq(this.editForm.get(['jobReq'])!.value);
        this.jobReqs.push(newReq);
      }
      this.editForm.patchValue({
        jobReq: ''
      });
    }
  }
  formatReq(req: string): IRequirement {
    return {
      ...new Requirement(),
      id: undefined,
      requirementName: req,
      job: this.editing ? this.job : undefined
    };
  }
  remReq(req: IRequirement): void {
    this.jobReqs.splice(this.jobReqs.indexOf(req), 1);
  }
  clearReq(): void {
    this.jobReqs = [];
  }
  checkForTag(): void {
    const tag = this.editForm.get(['jobTag']);
    const tagString = tag!.value.trim();
    if (tagString !== '' && tag!.valid) {
      if (!this.jobTags.includes(tag!.value)) {
        this.tagService
          .findByTagName(tagString)
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
                this.addTag(this.formatTag(tagString));
              }
            },
            () => this.addTag(this.formatTag(tagString))
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
      jobLocation: this.editForm.get(['jobLocation'])!.value,
      jobTags: this.jobTags
    };
  }
  private formatTag(tagStr: string): ITag {
    return {
      ...new Tag(),
      id: undefined,
      tagName: tagStr
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJob>>): void {
    result
      .pipe(
        map((res: HttpResponse<IJob>) => {
          return res.body;
        })
      )
      .subscribe(
        (resBody: IJob | null) => {
          if (resBody != null) {
            this.onSaveSuccess();
          } else {
            this.onSaveError();
          }
        },
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
