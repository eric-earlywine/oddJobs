import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IRequirement, Requirement } from 'app/shared/model/requirement.model';
import { RequirementService } from './requirement.service';
import { IJob } from 'app/shared/model/job.model';
import { JobService } from 'app/entities/job/job.service';

@Component({
  selector: 'jhi-requirement-update',
  templateUrl: './requirement-update.component.html'
})
export class RequirementUpdateComponent implements OnInit {
  isSaving = false;
  jobs: IJob[] = [];

  editForm = this.fb.group({
    id: [],
    requirementName: [],
    job: []
  });

  constructor(
    protected requirementService: RequirementService,
    protected jobService: JobService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ requirement }) => {
      this.updateForm(requirement);

      this.jobService.query().subscribe((res: HttpResponse<IJob[]>) => (this.jobs = res.body || []));
    });
  }

  updateForm(requirement: IRequirement): void {
    this.editForm.patchValue({
      id: requirement.id,
      requirementName: requirement.requirementName,
      job: requirement.job
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const requirement = this.createFromForm();
    if (requirement.id !== undefined) {
      this.subscribeToSaveResponse(this.requirementService.update(requirement));
    } else {
      this.subscribeToSaveResponse(this.requirementService.create(requirement));
    }
  }

  private createFromForm(): IRequirement {
    return {
      ...new Requirement(),
      id: this.editForm.get(['id'])!.value,
      requirementName: this.editForm.get(['requirementName'])!.value,
      job: this.editForm.get(['job'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRequirement>>): void {
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

  trackById(index: number, item: IJob): any {
    return item.id;
  }
}
