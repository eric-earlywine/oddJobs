import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OddJobsSharedModule } from 'app/shared/shared.module';
import { NewUserComponent } from './new-user.component';
import { NewUserDetailComponent } from './new-user-detail.component';
import { NewUserUpdateComponent } from './new-user-update.component';
import { NewUserDeleteDialogComponent } from './new-user-delete-dialog.component';
import { newUserRoute } from './new-user.route';

@NgModule({
  imports: [OddJobsSharedModule, RouterModule.forChild(newUserRoute)],
  declarations: [NewUserComponent, NewUserDetailComponent, NewUserUpdateComponent, NewUserDeleteDialogComponent],
  entryComponents: [NewUserDeleteDialogComponent]
})
export class OddJobsNewUserModule {}
