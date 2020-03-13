import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { INewUser } from 'app/shared/model/new-user.model';
import { NewUserService } from './new-user.service';

@Component({
  templateUrl: './new-user-delete-dialog.component.html'
})
export class NewUserDeleteDialogComponent {
  newUser?: INewUser;

  constructor(protected newUserService: NewUserService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.newUserService.delete(id).subscribe(() => {
      this.eventManager.broadcast('newUserListModification');
      this.activeModal.close();
    });
  }
}
