import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'job',
        loadChildren: () => import('./job/job.module').then(m => m.OddJobsJobModule)
      },
      {
        path: 'new-user',
        loadChildren: () => import('./new-user/new-user.module').then(m => m.OddJobsNewUserModule)
      },
      {
        path: 'location',
        loadChildren: () => import('./location/location.module').then(m => m.OddJobsLocationModule)
      },
      {
        path: 'job-details',
        loadChildren: () => import('./job-details/job-details.module').then(m => m.OddJobsJobDetailsModule)
      },
      {
        path: 'user-details',
        loadChildren: () => import('./user-details/user-details.module').then(m => m.OddJobsUserDetailsModule)
      },
      {
        path: 'tag',
        loadChildren: () => import('./tag/tag.module').then(m => m.OddJobsTagModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class OddJobsEntityModule {}
