import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { JobDetailsUpdateComponent } from 'app/entities/job-details/job-details-update.component';
import { JobDetailsService } from 'app/entities/job-details/job-details.service';
import { JobDetails } from 'app/shared/model/job-details.model';

describe('Component Tests', () => {
  describe('JobDetails Management Update Component', () => {
    let comp: JobDetailsUpdateComponent;
    let fixture: ComponentFixture<JobDetailsUpdateComponent>;
    let service: JobDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [JobDetailsUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(JobDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobDetailsUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(JobDetailsService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new JobDetails(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new JobDetails();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
