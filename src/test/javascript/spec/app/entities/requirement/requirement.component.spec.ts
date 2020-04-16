import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OddJobsTestModule } from '../../../test.module';
import { RequirementComponent } from 'app/entities/requirement/requirement.component';
import { RequirementService } from 'app/entities/requirement/requirement.service';
import { Requirement } from 'app/shared/model/requirement.model';

describe('Component Tests', () => {
  describe('Requirement Management Component', () => {
    let comp: RequirementComponent;
    let fixture: ComponentFixture<RequirementComponent>;
    let service: RequirementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [RequirementComponent]
      })
        .overrideTemplate(RequirementComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RequirementComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RequirementService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Requirement(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.requirements && comp.requirements[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
