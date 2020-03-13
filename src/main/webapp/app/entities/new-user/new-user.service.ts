import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { INewUser } from 'app/shared/model/new-user.model';

type EntityResponseType = HttpResponse<INewUser>;
type EntityArrayResponseType = HttpResponse<INewUser[]>;

@Injectable({ providedIn: 'root' })
export class NewUserService {
  public resourceUrl = SERVER_API_URL + 'api/new-users';

  constructor(protected http: HttpClient) {}

  create(newUser: INewUser): Observable<EntityResponseType> {
    return this.http.post<INewUser>(this.resourceUrl, newUser, { observe: 'response' });
  }

  update(newUser: INewUser): Observable<EntityResponseType> {
    return this.http.put<INewUser>(this.resourceUrl, newUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INewUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INewUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
