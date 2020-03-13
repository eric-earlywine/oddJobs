import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { OddJobsTestModule } from '../../../test.module';
import { NewUserUpdateComponent } from 'app/entities/new-user/new-user-update.component';
import { NewUserService } from 'app/entities/new-user/new-user.service';
import { NewUser } from 'app/shared/model/new-user.model';

describe('Component Tests', () => {
  describe('NewUser Management Update Component', () => {
    let comp: NewUserUpdateComponent;
    let fixture: ComponentFixture<NewUserUpdateComponent>;
    let service: NewUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OddJobsTestModule],
        declarations: [NewUserUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(NewUserUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NewUserUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(NewUserService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new NewUser(123);
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
        const entity = new NewUser();
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
