import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IJobDetails, JobDetails } from 'app/shared/model/job-details.model';
import { JobDetailsService } from './job-details.service';
import { JobDetailsComponent } from './job-details.component';
import { JobDetailsDetailComponent } from './job-details-detail.component';
import { JobDetailsUpdateComponent } from './job-details-update.component';

@Injectable({ providedIn: 'root' })
export class JobDetailsResolve implements Resolve<IJobDetails> {
  constructor(private service: JobDetailsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((jobDetails: HttpResponse<JobDetails>) => {
          if (jobDetails.body) {
            return of(jobDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JobDetails());
  }
}

export const jobDetailsRoute: Routes = [
  {
    path: '',
    component: JobDetailsComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'JobDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: JobDetailsDetailComponent,
    resolve: {
      jobDetails: JobDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'JobDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: JobDetailsUpdateComponent,
    resolve: {
      jobDetails: JobDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'JobDetails'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: JobDetailsUpdateComponent,
    resolve: {
      jobDetails: JobDetailsResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'JobDetails'
    },
    canActivate: [UserRouteAccessService]
  }
];
