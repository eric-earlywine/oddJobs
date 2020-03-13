import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IUserDetails, UserDetails } from 'app/shared/model/user-details.model';
import { UserDetailsService } from './user-details.service';
import { UserDetailsComponent } from './user-details.component';
import { UserDetailsDetailComponent } from './user-details-detail.component';
import { UserDetailsUpdateComponent } from './user-details-update.component';

@Injectable({ providedIn: 'root' })
export class UserDetailsResolve implements Resolve<IUserDetails> {
  constructor(private service: UserDetailsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((userDetails: HttpResponse<UserDetails>) => {
          if (userDetails.body) {
            return of(userDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserDetails());
  }
}

export const userDetailsRoute: Routes = [
  {
    path: '',
    component: UserDetailsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'UserDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: UserDetailsDetailComponent,
    resolve: {
      userDetails: UserDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'UserDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: UserDetailsUpdateComponent,
    resolve: {
      userDetails: UserDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'UserDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: UserDetailsUpdateComponent,
    resolve: {
      userDetails: UserDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'UserDetails'
    },
    canActivate: [UserRouteAccessService]
  }
];
