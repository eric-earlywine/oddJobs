import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobDetails } from 'app/shared/model/job-details.model';
import { JobDetailsService } from './job-details.service';
import { JobDetailsDeleteDialogComponent } from './job-details-delete-dialog.component';

@Component({
  selector: 'jhi-job-details',
  templateUrl: './job-details.component.html'
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  jobDetails?: IJobDetails[];
  eventSubscriber?: Subscription;

  constructor(protected jobDetailsService: JobDetailsService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.jobDetailsService.query().subscribe((res: HttpResponse<IJobDetails[]>) => (this.jobDetails = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInJobDetails();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IJobDetails): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInJobDetails(): void {
    this.eventSubscriber = this.eventManager.subscribe('jobDetailsListModification', () => this.loadAll());
  }

  delete(jobDetails: IJobDetails): void {
    const modalRef = this.modalService.open(JobDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobDetails = jobDetails;
  }
}
