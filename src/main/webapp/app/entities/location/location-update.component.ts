import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ILocation, Location } from 'app/shared/model/location.model';
import { LocationService } from './location.service';
import { IJob } from 'app/shared/model/job.model';
import { JobService } from 'app/entities/job/job.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html'
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;
  jobs: IJob[] = [];

  editForm = this.fb.group({
    id: [],
    streetAddress: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    job: []
  });

  constructor(
    protected locationService: LocationService,
    protected jobService: JobService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);

      this.jobService.query().subscribe((res: HttpResponse<IJob[]>) => (this.jobs = res.body || []));
    });
  }

  updateForm(location: ILocation): void {
    this.editForm.patchValue({
      id: location.id,
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      stateProvince: location.stateProvince,
      job: location.job
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      streetAddress: this.editForm.get(['streetAddress'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      city: this.editForm.get(['city'])!.value,
      stateProvince: this.editForm.get(['stateProvince'])!.value,
      job: this.editForm.get(['job'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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
