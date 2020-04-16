import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRequirement } from 'app/shared/model/requirement.model';
import { RequirementService } from './requirement.service';
import { RequirementDeleteDialogComponent } from './requirement-delete-dialog.component';

@Component({
  selector: 'jhi-requirement',
  templateUrl: './requirement.component.html'
})
export class RequirementComponent implements OnInit, OnDestroy {
  requirements?: IRequirement[];
  eventSubscriber?: Subscription;

  constructor(
    protected requirementService: RequirementService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.requirementService.query().subscribe((res: HttpResponse<IRequirement[]>) => (this.requirements = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInRequirements();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRequirement): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRequirements(): void {
    this.eventSubscriber = this.eventManager.subscribe('requirementListModification', () => this.loadAll());
  }

  delete(requirement: IRequirement): void {
    const modalRef = this.modalService.open(RequirementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.requirement = requirement;
  }
}
