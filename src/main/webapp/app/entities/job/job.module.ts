import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OddJobsSharedModule } from 'app/shared/shared.module';
import { JobComponent } from './job.component';
import { JobUpdateComponent } from './job-update.component';
import { JobDeleteDialogComponent } from './job-delete-dialog.component';
import { JobDetailComponent } from 'app/entities/job/job-detail.component';
import { jobRoute } from './job.route';

@NgModule({
  imports: [OddJobsSharedModule, RouterModule.forChild(jobRoute)],
  declarations: [JobComponent, JobUpdateComponent, JobDeleteDialogComponent, JobDetailComponent],
  entryComponents: [JobDeleteDialogComponent]
})
export class OddJobsJobModule {}
