import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRequirement } from 'app/shared/model/requirement.model';
import { RequirementService } from './requirement.service';

@Component({
  templateUrl: './requirement-delete-dialog.component.html'
})
export class RequirementDeleteDialogComponent {
  requirement?: IRequirement;

  constructor(
    protected requirementService: RequirementService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.requirementService.delete(id).subscribe(() => {
      this.eventManager.broadcast('requirementListModification');
      this.activeModal.close();
    });
  }
}
