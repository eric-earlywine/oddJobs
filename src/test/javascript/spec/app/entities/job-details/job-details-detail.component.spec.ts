import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { JobDetailsDetailComponent } from 'app/entities/job-details/job-details-detail.component';
import { JobDetails } from 'app/shared/model/job-details.model';

describe('Component Tests', () => {
  describe('JobDetails Management Detail Component', () => {
    let comp: JobDetailsDetailComponent;
    let fixture: ComponentFixture<JobDetailsDetailComponent>;
    const route = ({ data: of({ jobDetails: new JobDetails(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [JobDetailsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(JobDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jobDetails on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jobDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
