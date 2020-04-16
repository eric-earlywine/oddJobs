import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { RequirementDetailComponent } from 'app/entities/requirement/requirement-detail.component';
import { Requirement } from 'app/shared/model/requirement.model';

describe('Component Tests', () => {
  describe('Requirement Management Detail Component', () => {
    let comp: RequirementDetailComponent;
    let fixture: ComponentFixture<RequirementDetailComponent>;
    const route = ({ data: of({ requirement: new Requirement(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [RequirementDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(RequirementDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RequirementDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load requirement on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.requirement).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
