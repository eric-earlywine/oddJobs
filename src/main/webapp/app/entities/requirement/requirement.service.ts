import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IRequirement } from 'app/shared/model/requirement.model';

type EntityResponseType = HttpResponse<IRequirement>;
type EntityArrayResponseType = HttpResponse<IRequirement[]>;

@Injectable({ providedIn: 'root' })
export class RequirementService {
  public resourceUrl = SERVER_API_URL + 'api/requirements';

  constructor(protected http: HttpClient) {}

  create(requirement: IRequirement): Observable<EntityResponseType> {
    return this.http.post<IRequirement>(this.resourceUrl, requirement, { observe: 'response' });
  }

  update(requirement: IRequirement): Observable<EntityResponseType> {
    return this.http.put<IRequirement>(this.resourceUrl, requirement, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRequirement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRequirement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
