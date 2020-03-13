import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OddJobsTestModule } from '../../../test.module';
import { JobDetailsComponent } from 'app/entities/job-details/job-details.component';
import { JobDetailsService } from 'app/entities/job-details/job-details.service';
import { JobDetails } from 'app/shared/model/job-details.model';

describe('Component Tests', () => {
  describe('JobDetails Management Component', () => {
    let comp: JobDetailsComponent;
    let fixture: ComponentFixture<JobDetailsComponent>;
    let service: JobDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [JobDetailsComponent]
      })
        .overrideTemplate(JobDetailsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobDetailsComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JobDetailsService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new JobDetails(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.jobDetails && comp.jobDetails[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
