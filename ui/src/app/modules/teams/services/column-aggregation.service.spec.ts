import {ColumnAggregationService} from './column-aggregation.service';
import {Subject} from 'rxjs';

describe('ColumnAggregationService', () => {

  const mockHttpClient = jasmine.createSpyObj({
    get: new Subject()
  });

  const service = new ColumnAggregationService(mockHttpClient);

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
