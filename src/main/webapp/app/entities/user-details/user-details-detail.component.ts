import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserDetails } from 'app/shared/model/user-details.model';

@Component({
  selector: 'jhi-user-details-detail',
  templateUrl: './user-details-detail.component.html'
})
export class UserDetailsDetailComponent implements OnInit {
  userDetails: IUserDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userDetails }) => (this.userDetails = userDetails));
  }

  previousState(): void {
    window.history.back();
  }
}
