import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { FormBuilder } from '@angular/forms';

import { IJob } from 'app/shared/model/job.model';
import { JobService } from './job.service';

@Component({
  templateUrl: './job-fulfilled.component.html'
})
export class JobFulfilledComponent {
  job?: IJob;
  noSelection = false;
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
  checkUser(): void {
    if (this.fulfillForm.get(['fulfillUser'])!.value === 'noSelection') {
      this.noSelection = true;
    } else {
      this.noSelection = false;
      if (this.job !== undefined) {
        this.confirmFulfill(this.job);
      }
    }
  }
  confirmFulfill(job: IJob): void {
    job.fulfilled = true;
    this.jobService.update(job).subscribe(() => {
      this.eventManager.broadcast('jobListModification');
      this.activeModal.close();
    });
  }
}
