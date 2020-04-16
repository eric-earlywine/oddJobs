import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { RequirementUpdateComponent } from 'app/entities/requirement/requirement-update.component';
import { RequirementService } from 'app/entities/requirement/requirement.service';
import { Requirement } from 'app/shared/model/requirement.model';

describe('Component Tests', () => {
  describe('Requirement Management Update Component', () => {
    let comp: RequirementUpdateComponent;
    let fixture: ComponentFixture<RequirementUpdateComponent>;
    let service: RequirementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [RequirementUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(RequirementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RequirementUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RequirementService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Requirement(123);
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
        const entity = new Requirement();
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
