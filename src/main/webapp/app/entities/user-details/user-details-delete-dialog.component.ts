import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserDetails } from 'app/shared/model/user-details.model';
import { UserDetailsService } from './user-details.service';

@Component({
  templateUrl: './user-details-delete-dialog.component.html'
})
export class UserDetailsDeleteDialogComponent {
  userDetails?: IUserDetails;

  constructor(
    protected userDetailsService: UserDetailsService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userDetailsService.delete(id).subscribe(() => {
      this.eventManager.broadcast('userDetailsListModification');
      this.activeModal.close();
    });
  }
}
