import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ColumnCombinerResponse} from '../../domain/column-combiner-response';
import {Observable} from 'rxjs';

@Injectable()
export class ColumnAggregationService {

  constructor(private httpClient: HttpClient) {
  }

  getColumns(teamId: string): Observable<ColumnCombinerResponse> {
    return this.httpClient.get<ColumnCombinerResponse>(`/api/v2/team/${teamId}/columns`, {observe: 'body'});
  }

}
