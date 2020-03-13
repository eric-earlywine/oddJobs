import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { NewUserDetailComponent } from 'app/entities/new-user/new-user-detail.component';
import { NewUser } from 'app/shared/model/new-user.model';

describe('Component Tests', () => {
  describe('NewUser Management Detail Component', () => {
    let comp: NewUserDetailComponent;
    let fixture: ComponentFixture<NewUserDetailComponent>;
    const route = ({ data: of({ newUser: new NewUser(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [NewUserDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(NewUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(NewUserDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load newUser on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.newUser).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
