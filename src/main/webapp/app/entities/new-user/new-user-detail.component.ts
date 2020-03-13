import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INewUser } from 'app/shared/model/new-user.model';

@Component({
  selector: 'jhi-new-user-detail',
  templateUrl: './new-user-detail.component.html'
})
export class NewUserDetailComponent implements OnInit {
  newUser: INewUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ newUser }) => (this.newUser = newUser));
  }

  previousState(): void {
    window.history.back();
  }
}
