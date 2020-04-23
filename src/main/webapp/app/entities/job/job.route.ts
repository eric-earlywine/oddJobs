import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IJob, Job } from 'app/shared/model/job.model';
import { JobService } from './job.service';
import { JobComponent } from './job.component';
import { JobDetailComponent } from './job-detail.component';
import { JobUpdateComponent } from './job-update.component';
import { IUser, User } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { TagResolve } from 'app/entities/tag/tag.route';

@Injectable({ providedIn: 'root' })
export class JobResolve implements Resolve<IJob> {
  constructor(private service: JobService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJob> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((job: HttpResponse<Job>) => {
          if (job.body) {
            return of(job.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Job());
  }
}
@Injectable({ providedIn: 'root' })
export class UserResolve implements Resolve<IUser> {
  constructor(private service: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(new User());
  }
}
@Injectable({ providedIn: 'root' })
export class SearchResolve {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot): String | null {
    const key = route.params['key'];
    if (key) {
      return key;
    }
    return null;
  }
}

export const jobRoute: Routes = [
  {
    path: '',
    component: JobComponent,
    resolve: {
      observeUser: UserResolve,
      search: SearchResolve,
      tag: TagResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'user/:login',
    component: JobComponent,
    resolve: {
      observeUser: UserResolve,
      search: SearchResolve,
      tagId: TagResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'tag/:id',
    component: JobComponent,
    resolve: {
      observeUser: UserResolve,
      search: SearchResolve,
      tag: TagResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'search/:key',
    component: JobComponent,
    resolve: {
      observeUser: UserResolve,
      search: SearchResolve,
      tagId: TagResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: JobDetailComponent,
    resolve: {
      job: JobResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: JobUpdateComponent,
    resolve: {
      job: JobResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: JobUpdateComponent,
    resolve: {
      job: JobResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Jobs'
    },
    canActivate: [UserRouteAccessService]
  }
];
