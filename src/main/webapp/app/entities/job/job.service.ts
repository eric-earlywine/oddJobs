import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IJob } from 'app/shared/model/job.model';

type EntityResponseType = HttpResponse<IJob>;
type EntityArrayResponseType = HttpResponse<IJob[]>;

@Injectable({ providedIn: 'root' })
export class JobService {
  public resourceUrl = SERVER_API_URL + 'api/jobs';

  constructor(protected http: HttpClient) {}

  create(job: IJob): Observable<EntityResponseType> {
    const dataInfo = [];
    dataInfo.push({ job, jobReqs: job.jobReqs, tags: job.jobTags });
    return this.http.post(this.resourceUrl, dataInfo, { observe: 'response' });
  }

  update(job: IJob): Observable<EntityResponseType> {
    const dataInfo = [];
    dataInfo.push({ job, jobReqs: job.jobReqs, tags: job.jobTags });
    return this.http.put(this.resourceUrl, dataInfo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJob>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJob[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
