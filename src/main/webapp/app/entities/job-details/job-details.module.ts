import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OddJobsSharedModule } from 'app/shared/shared.module';
import { JobDetailsComponent } from './job-details.component';
import { JobDetailsDetailComponent } from './job-details-detail.component';
import { JobDetailsUpdateComponent } from './job-details-update.component';
import { JobDetailsDeleteDialogComponent } from './job-details-delete-dialog.component';
import { jobDetailsRoute } from './job-details.route';

@NgModule({
  imports: [OddJobsSharedModule, RouterModule.forChild(jobDetailsRoute)],
  declarations: [JobDetailsComponent, JobDetailsDetailComponent, JobDetailsUpdateComponent, JobDetailsDeleteDialogComponent],
  entryComponents: [JobDetailsDeleteDialogComponent]
})
export class OddJobsJobDetailsModule {}
