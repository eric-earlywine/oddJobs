import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IJobDetails } from 'app/shared/model/job-details.model';
import { JobDetailsService } from './job-details.service';

@Component({
  templateUrl: './job-details-delete-dialog.component.html'
})
export class JobDetailsDeleteDialogComponent {
  jobDetails?: IJobDetails;

  constructor(
    protected jobDetailsService: JobDetailsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobDetailsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('jobDetailsListModification');
      this.activeModal.close();
    });
  }
}
