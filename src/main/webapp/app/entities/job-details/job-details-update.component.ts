import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IJobDetails, JobDetails } from 'app/shared/model/job-details.model';
import { JobDetailsService } from './job-details.service';
import { ITag } from 'app/shared/model/tag.model';
import { TagService } from 'app/entities/tag/tag.service';

@Component({
  selector: 'jhi-job-details-update',
  templateUrl: './job-details-update.component.html'
})
export class JobDetailsUpdateComponent implements OnInit {
  isSaving = false;
  tags: ITag[] = [];

  editForm = this.fb.group({
    id: [],
    difficulty: [],
    description: [],
    tags: []
  });

  constructor(
    protected jobDetailsService: JobDetailsService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobDetails }) => {
      this.updateForm(jobDetails);

      this.tagService.query().subscribe((res: HttpResponse<ITag[]>) => (this.tags = res.body || []));
    });
  }

  updateForm(jobDetails: IJobDetails): void {
    this.editForm.patchValue({
      id: jobDetails.id,
      difficulty: jobDetails.difficulty,
      description: jobDetails.description,
      tags: jobDetails.tags
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobDetails = this.createFromForm();
    if (jobDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.jobDetailsService.update(jobDetails));
    } else {
      this.subscribeToSaveResponse(this.jobDetailsService.create(jobDetails));
    }
  }

  private createFromForm(): IJobDetails {
    return {
      ...new JobDetails(),
      id: this.editForm.get(['id'])!.value,
      difficulty: this.editForm.get(['difficulty'])!.value,
      description: this.editForm.get(['description'])!.value,
      tags: this.editForm.get(['tags'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobDetails>>): void {
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

  trackById(index: number, item: ITag): any {
    return item.id;
  }

  getSelected(selectedVals: ITag[], option: ITag): ITag {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
