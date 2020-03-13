import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { UserDetailsDetailComponent } from 'app/entities/user-details/user-details-detail.component';
import { UserDetails } from 'app/shared/model/user-details.model';

describe('Component Tests', () => {
  describe('UserDetails Management Detail Component', () => {
    let comp: UserDetailsDetailComponent;
    let fixture: ComponentFixture<UserDetailsDetailComponent>;
    const route = ({ data: of({ userDetails: new UserDetails(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [UserDetailsDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(UserDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userDetails on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
