import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OddJobsSharedModule } from 'app/shared/shared.module';
import { JobComponent } from './job.component';
import { JobUpdateComponent } from './job-update.component';
import { JobDeleteDialogComponent } from './job-delete-dialog.component';
import { JobDetailComponent } from 'app/entities/job/job-detail.component';
import { JobFulfilledComponent } from 'app/entities/job/job-fulfilled.component';
import { jobRoute } from './job.route';

@NgModule({
  imports: [OddJobsSharedModule, RouterModule.forChild(jobRoute)],
  declarations: [JobComponent, JobUpdateComponent, JobDeleteDialogComponent, JobDetailComponent, JobFulfilledComponent],
  entryComponents: [JobDeleteDialogComponent, JobFulfilledComponent]
})
export class OddJobsJobModule {}
