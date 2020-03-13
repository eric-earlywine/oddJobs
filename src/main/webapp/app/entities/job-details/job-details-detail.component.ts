import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobDetails } from 'app/shared/model/job-details.model';

@Component({
  selector: 'jhi-job-details-detail',
  templateUrl: './job-details-detail.component.html'
})
export class JobDetailsDetailComponent implements OnInit {
  jobDetails: IJobDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobDetails }) => (this.jobDetails = jobDetails));
  }

  previousState(): void {
    window.history.back();
  }
}
