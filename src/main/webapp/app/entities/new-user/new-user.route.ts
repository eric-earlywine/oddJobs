import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { INewUser, NewUser } from 'app/shared/model/new-user.model';
import { NewUserService } from './new-user.service';
import { NewUserComponent } from './new-user.component';
import { NewUserDetailComponent } from './new-user-detail.component';
import { NewUserUpdateComponent } from './new-user-update.component';

@Injectable({ providedIn: 'root' })
export class NewUserResolve implements Resolve<INewUser> {
  constructor(private service: NewUserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INewUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((newUser: HttpResponse<NewUser>) => {
          if (newUser.body) {
            return of(newUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NewUser());
  }
}

export const newUserRoute: Routes = [
  {
    path: '',
    component: NewUserComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'NewUsers'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: NewUserDetailComponent,
    resolve: {
      newUser: NewUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'NewUsers'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: NewUserUpdateComponent,
    resolve: {
      newUser: NewUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'NewUsers'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: NewUserUpdateComponent,
    resolve: {
      newUser: NewUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'NewUsers'
    },
    canActivate: [UserRouteAccessService]
  }
];
