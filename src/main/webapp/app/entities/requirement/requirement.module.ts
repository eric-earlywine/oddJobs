import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OddJobsSharedModule } from 'app/shared/shared.module';
import { RequirementComponent } from './requirement.component';
import { RequirementDetailComponent } from './requirement-detail.component';
import { RequirementUpdateComponent } from './requirement-update.component';
import { RequirementDeleteDialogComponent } from './requirement-delete-dialog.component';
import { requirementRoute } from './requirement.route';

@NgModule({
  imports: [OddJobsSharedModule, RouterModule.forChild(requirementRoute)],
  declarations: [RequirementComponent, RequirementDetailComponent, RequirementUpdateComponent, RequirementDeleteDialogComponent],
  entryComponents: [RequirementDeleteDialogComponent]
})
export class OddJobsRequirementModule {}
