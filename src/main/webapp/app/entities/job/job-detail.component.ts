import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJob } from 'app/shared/model/job.model';

@Component({
  selector: 'jhi-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['job-update.scss']
})
export class JobDetailComponent implements OnInit {
  job: IJob | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ job }) => (this.job = job));
  }
  formatPayType(type: String): String {
    if (type === 'JOBCOMPLETION') {
      return 'On job completion';
    } else if (type === 'HOURLY') {
      return 'Hourly';
    }
    return 'Daily';
  }

  previousState(): void {
    window.history.back();
  }
}
