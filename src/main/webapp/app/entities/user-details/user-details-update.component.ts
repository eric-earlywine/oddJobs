import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IUserDetails, UserDetails } from 'app/shared/model/user-details.model';
import { UserDetailsService } from './user-details.service';

@Component({
  selector: 'jhi-user-details-update',
  templateUrl: './user-details-update.component.html'
})
export class UserDetailsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    profilePicture: [],
    description: [],
    rating: [],
    jobPostings: [],
    jobCompletions: []
  });

  constructor(protected userDetailsService: UserDetailsService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => {
      this.updateForm(userDetails);
    });
  }

  updateForm(userDetails: IUserDetails): void {
    this.editForm.patchValue({
      id: userDetails.id,
      profilePicture: userDetails.profilePicture,
      description: userDetails.description,
      rating: userDetails.rating,
      jobPostings: userDetails.jobPostings,
      jobCompletions: userDetails.jobCompletions
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userDetails = this.createFromForm();
    if (userDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.userDetailsService.update(userDetails));
    } else {
      this.subscribeToSaveResponse(this.userDetailsService.create(userDetails));
    }
  }

  private createFromForm(): IUserDetails {
    return {
      ...new UserDetails(),
      id: this.editForm.get(['id'])!.value,
      profilePicture: this.editForm.get(['profilePicture'])!.value,
      description: this.editForm.get(['description'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      jobPostings: this.editForm.get(['jobPostings'])!.value,
      jobCompletions: this.editForm.get(['jobCompletions'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserDetails>>): void {
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
}
