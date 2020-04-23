import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { FormBuilder } from '@angular/forms';

import { IJob } from 'app/shared/model/job.model';
import { JobService } from './job.service';
import { IUser } from 'app/core/user/user.model';

@Component({
  templateUrl: './job-fulfilled.component.html',
  styleUrls: ['job-update.scss']
})
export class JobFulfilledComponent {
  job?: IJob;
  noSelection = false;
  selectedUser?: IUser;
  fulfillForm = this.fb.group({
    fulfillUser: []
  });
  constructor(
    protected jobService: JobService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager,
    private fb: FormBuilder
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }
  selectUser(): void {
    this.selectedUser = this.fulfillForm.get(['fulfillUser'])!.value;
    this.noSelection = false;
  }
  checkUser(): void {
    if (this.selectedUser === undefined) {
      this.noSelection = true;
    } else {
      this.noSelection = false;
      if (this.job !== undefined) {
        this.confirmFulfill(this.job, this.selectedUser);
      }
    }
  }
  confirmFulfill(job: IJob, fulfilledUser: IUser): void {
    job.fulfilled = true;
    job.fulfilledUser = fulfilledUser;
    this.jobService.update(job).subscribe(() => {
      this.eventManager.broadcast('jobListModification');
      this.activeModal.close();
    });
  }
}
