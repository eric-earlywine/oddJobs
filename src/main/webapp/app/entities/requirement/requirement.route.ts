import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IRequirement, Requirement } from 'app/shared/model/requirement.model';
import { RequirementService } from './requirement.service';
import { RequirementComponent } from './requirement.component';
import { RequirementDetailComponent } from './requirement-detail.component';
import { RequirementUpdateComponent } from './requirement-update.component';

@Injectable({ providedIn: 'root' })
export class RequirementResolve implements Resolve<IRequirement> {
  constructor(private service: RequirementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRequirement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((requirement: HttpResponse<Requirement>) => {
          if (requirement.body) {
            return of(requirement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Requirement());
  }
}

export const requirementRoute: Routes = [
  {
    path: '',
    component: RequirementComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Requirements'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: RequirementDetailComponent,
    resolve: {
      requirement: RequirementResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Requirements'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: RequirementUpdateComponent,
    resolve: {
      requirement: RequirementResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Requirements'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: RequirementUpdateComponent,
    resolve: {
      requirement: RequirementResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Requirements'
    },
    canActivate: [UserRouteAccessService]
  }
];
