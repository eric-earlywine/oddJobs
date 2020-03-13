import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserDetails } from 'app/shared/model/user-details.model';
import { UserDetailsService } from './user-details.service';
import { UserDetailsDeleteDialogComponent } from './user-details-delete-dialog.component';

@Component({
  selector: 'jhi-user-details',
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  userDetails?: IUserDetails[];
  eventSubscriber?: Subscription;

  constructor(
    protected userDetailsService: UserDetailsService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.userDetailsService.query().subscribe((res: HttpResponse<IUserDetails[]>) => (this.userDetails = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInUserDetails();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IUserDetails): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInUserDetails(): void {
    this.eventSubscriber = this.eventManager.subscribe('userDetailsListModification', () => this.loadAll());
  }

  delete(userDetails: IUserDetails): void {
    const modalRef = this.modalService.open(UserDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userDetails = userDetails;
  }
}
