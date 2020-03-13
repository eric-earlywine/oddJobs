import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { INewUser, NewUser } from 'app/shared/model/new-user.model';
import { NewUserService } from './new-user.service';
import { IUserDetails } from 'app/shared/model/user-details.model';
import { UserDetailsService } from 'app/entities/user-details/user-details.service';

@Component({
  selector: 'jhi-new-user-update',
  templateUrl: './new-user-update.component.html'
})
export class NewUserUpdateComponent implements OnInit {
  isSaving = false;
  userdetails: IUserDetails[] = [];

  editForm = this.fb.group({
    id: [],
    username: [],
    password: [],
    email: [],
    userDetails: []
  });

  constructor(
    protected newUserService: NewUserService,
    protected userDetailsService: UserDetailsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newUser }) => {
      this.updateForm(newUser);

      this.userDetailsService
        .query({ filter: 'newuser-is-null' })
        .pipe(
          map((res: HttpResponse<IUserDetails[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IUserDetails[]) => {
          if (!newUser.userDetails || !newUser.userDetails.id) {
            this.userdetails = resBody;
          } else {
            this.userDetailsService
              .find(newUser.userDetails.id)
              .pipe(
                map((subRes: HttpResponse<IUserDetails>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IUserDetails[]) => (this.userdetails = concatRes));
          }
        });
    });
  }

  updateForm(newUser: INewUser): void {
    this.editForm.patchValue({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      userDetails: newUser.userDetails
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const newUser = this.createFromForm();
    if (newUser.id !== undefined) {
      this.subscribeToSaveResponse(this.newUserService.update(newUser));
    } else {
      this.subscribeToSaveResponse(this.newUserService.create(newUser));
    }
  }

  private createFromForm(): INewUser {
    return {
      ...new NewUser(),
      id: this.editForm.get(['id'])!.value,
      username: this.editForm.get(['username'])!.value,
      password: this.editForm.get(['password'])!.value,
      email: this.editForm.get(['email'])!.value,
      userDetails: this.editForm.get(['userDetails'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INewUser>>): void {
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

  trackById(index: number, item: IUserDetails): any {
    return item.id;
  }
}
