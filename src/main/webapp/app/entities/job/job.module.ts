import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OddJobsSharedModule } from 'app/shared/shared.module';
import { JobComponent } from './job.component';
import { JobDetailComponent } from './job-detail.component';
import { JobUpdateComponent } from './job-update.component';
import { JobDeleteDialogComponent } from './job-delete-dialog.component';
import { jobRoute } from './job.route';
import { AddRequirementComponent } from './requirements/add-requirement/add-requirement.component';

@NgModule({
  imports: [OddJobsSharedModule, RouterModule.forChild(jobRoute)],
  declarations: [JobComponent, JobDetailComponent, JobUpdateComponent, JobDeleteDialogComponent, AddRequirementComponent],
  entryComponents: [JobDeleteDialogComponent]
})
export class OddJobsJobModule {}
